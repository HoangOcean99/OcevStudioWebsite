import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware';
import PreOrder from '../models/PreOrder';
import Product from '../models/Product';
import User from '../models/User';
import Expense from '../models/Expense';

const router = express.Router();

router.use(protect, admin);

// Dashboard stats
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
      PreOrder.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      PreOrder.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ])
    ]);

    let recentOrders: any[] = [];
    try {
      recentOrders = await PreOrder.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      for (const order of recentOrders) {
        // Populate User
        if (order.user && typeof order.user.toString === 'function' && order.user.toString().match(/^[0-9a-fA-F]{24}$/)) {
          const userObj = await User.findById(order.user).select('name email avatar').lean();
          if (userObj) {
            order.user = userObj as any;
          }
        }

        // Populate Products
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product && typeof item.product.toString === 'function' && item.product.toString().match(/^[0-9a-fA-F]{24}$/)) {
              const prod = await Product.findById(item.product).lean();
              if (prod) {
                item.product = prod as any;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }

    res.json({
      totalRevenue: revenueAgg[0]?.total || 0,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching stats');
  }
}));

// Cash Flow Stats
router.get('/cashflow', asyncHandler(async (req, res) => {
  const period = req.query.period || 'all';
  
  let matchQueryOrder: any = { status: { $ne: 'Cancelled' } };
  let matchQueryExpense: any = {};
  
  const now = new Date();
  let startDate = new Date(0);
  let isDaily = false;
  
  if (period === '7days') {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    isDaily = true;
  } else if (period === 'thisMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    isDaily = true;
  } else if (period === 'lastMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    matchQueryOrder.createdAt = { $gte: startDate, $lte: endDate };
    matchQueryExpense.date = { $gte: startDate, $lte: endDate };
    isDaily = true;
  } else if (period === 'thisYear') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }
  
  if (period !== 'all' && period !== 'lastMonth') {
    matchQueryOrder.createdAt = { $gte: startDate };
    matchQueryExpense.date = { $gte: startDate };
  }

  const groupFormat = isDaily 
    ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } }
    : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
    
  const groupFormatExp = isDaily 
    ? { year: { $year: "$date" }, month: { $month: "$date" }, day: { $dayOfMonth: "$date" } }
    : { year: { $year: "$date" }, month: { $month: "$date" } };

  const revenueByTime = await PreOrder.aggregate([
    { $match: matchQueryOrder },
    { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalAmount" } } }
  ]);

  const expensesByTime = await Expense.aggregate([
    { $match: matchQueryExpense },
    { $group: { _id: groupFormatExp, totalExpense: { $sum: "$amount" } } }
  ]);

  const chartMap = new Map<string, any>();
  let totalRevenue = 0;
  
  const formatKey = (id: any) => {
    if (isDaily) return `${id.year}-${String(id.month).padStart(2, '0')}-${String(id.day).padStart(2, '0')}`;
    return `${id.year}-${String(id.month).padStart(2, '0')}`;
  };
  
  revenueByTime.forEach(item => {
    const key = formatKey(item._id);
    chartMap.set(key, { name: key, TiềnVào: item.totalRevenue, TiềnRa: 0, LợiNhuận: item.totalRevenue });
    totalRevenue += item.totalRevenue;
  });

  let totalExpense = 0;
  expensesByTime.forEach(item => {
    const key = formatKey(item._id);
    const existing = chartMap.get(key) || { name: key, TiềnVào: 0, TiềnRa: 0, LợiNhuận: 0 };
    existing.TiềnRa = item.totalExpense;
    existing.LợiNhuận = existing.TiềnVào - existing.TiềnRa;
    chartMap.set(key, existing);
    totalExpense += item.totalExpense;
  });

  const chartData = Array.from(chartMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  res.json({
    totalRevenue,
    totalExpense,
    netProfit: totalRevenue - totalExpense,
    chartData
  });
}));

// Get all expenses
router.get('/expenses', asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 }).limit(100);
  res.json(expenses);
}));

// Create expense
router.post('/expenses', asyncHandler(async (req, res) => {
  const { amount, category, description, date } = req.body;
  if (!amount || !category || !description) {
    res.status(400);
    throw new Error('Vui lòng nhập đủ thông tin (amount, category, description)');
  }
  const expense = await Expense.create({
    amount,
    category,
    description,
    date: date || new Date()
  });
  res.status(201).json(expense);
}));

// List users (paginated, searchable)
router.get('/users', asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const keyword = (req.query.keyword as string) || '';

  const filter = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password -savedOutfits')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ items: users, page, pages: Math.ceil(count / pageSize) || 1, total: count });
}));

// Create user
router.post('/users', asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    role: role || 'user',
    phone,
    address,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// Update user details and role
router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const reqUser = (req as any).user;
  if (reqUser.role === 'staff' && user.role === 'admin') {
    res.status(403);
    throw new Error('Staff không thể chỉnh sửa tài khoản Admin');
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  
  if (req.body.role && ['admin', 'staff', 'user'].includes(req.body.role)) {
    if (reqUser.role === 'staff' && req.body.role === 'admin') {
      res.status(403);
      throw new Error('Staff không thể cấp quyền Admin');
    }
    user.role = req.body.role;
  }
  
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.address !== undefined) user.address = req.body.address;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    address: updated.address,
    isBanned: updated.isBanned,
    avatar: updated.avatar,
    createdAt: updated.createdAt,
  });
}));

// Toggle user ban
router.put('/users/:id/ban', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const reqUser = (req as any).user;
  if (reqUser.id === req.params.id) {
    res.status(400);
    throw new Error('Không thể khóa chính tài khoản đang đăng nhập');
  }
  if (reqUser.role === 'staff' && user.role === 'admin') {
    res.status(403);
    throw new Error('Staff không thể khóa tài khoản Admin');
  }

  user.isBanned = !user.isBanned;
  const updated = await user.save();
  
  res.json({
    _id: updated._id,
    name: updated.name,
    isBanned: updated.isBanned
  });
}));

// Delete user
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const reqUser = (req as any).user;
  if (reqUser.id === req.params.id) {
    res.status(400);
    throw new Error('Không thể xóa chính tài khoản đang đăng nhập');
  }
  if (reqUser.role === 'staff' && user.role === 'admin') {
    res.status(403);
    throw new Error('Staff không thể xóa tài khoản Admin');
  }
  await user.deleteOne();
  res.json({ message: 'User removed successfully' });
}));

export default router;
