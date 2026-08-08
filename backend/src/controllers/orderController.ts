import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { IPreOrder } from '../models/PreOrder';
import { orderService, OrderService } from '../services/orderService';
import asyncHandler from 'express-async-handler';

class OrderController extends BaseController<IPreOrder> {
  private orderService: OrderService;

  constructor() {
    super(orderService);
    this.orderService = orderService;
  }

  // Override create to handle both logged-in and guest users
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { items, shippingAddress, paymentMethod, totalAmount, guestInfo } = req.body;

    if (items && items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7); // Default 7 days

    const user = (req as any).user ? (req as any).user.id : undefined;

    if (!user && (!guestInfo || !guestInfo.name || !guestInfo.email || !guestInfo.phone)) {
      res.status(400);
      throw new Error('Guest checkout requires name, email, and phone number');
    }

    const orderData = {
      user,
      guestInfo,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      estimatedDeliveryDate,
    };

    const createdItem = await this.orderService.create(orderData as any);
    res.status(201).json(createdItem);
  });

  getMyOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orders = await this.orderService.findMyOrders((req as any).user.id);
    res.json(orders);
  });

  // Override getById to check authorization
  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderService.findById(req.params.id as string);

    if (order) {
      if ((req as any).user.role === 'admin' || (order.user && order.user.toString() === (req as any).user.id)) {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

  updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status, paymentStatus, vietQrTransactionId } = req.body;
    
    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (vietQrTransactionId) updateFields.vietQrTransactionId = vietQrTransactionId;

    const updatedOrder = await this.orderService.update(req.params.id as string, updateFields);

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });
}

export const orderController = new OrderController();
