"use client";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { name: "Tổng Doanh Thu", value: "$45,231.89", change: "+20.1%", icon: <DollarSign className="w-5 h-5" /> },
    { name: "Đơn Hàng Mới", value: "+2350", change: "+15.2%", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: "Khách Hàng Mới", value: "+12,234", change: "+19.2%", icon: <Users className="w-5 h-5" /> },
    { name: "Tỷ Lệ Chuyển Đổi", value: "4.23%", change: "+2.1%", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Alex Ocean", product: "Cyberpunk Leather Jacket", amount: "$350.00", status: "Đã giao", date: "Hôm nay" },
    { id: "ORD-002", customer: "Sarah Connor", product: "Tactical Cargo Pants", amount: "$120.00", status: "Đang xử lý", date: "Hôm nay" },
    { id: "ORD-003", customer: "John Doe", product: "Neon Cyber Hoodie", amount: "$180.00", status: "Đang giao", date: "Hôm qua" },
    { id: "ORD-004", customer: "Jane Smith", product: "Techwear Boots", amount: "$250.00", status: "Đã giao", date: "2 ngày trước" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Tổng Quan</h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi hoạt động kinh doanh của cửa hàng.</p>
        </div>
        <button className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2">
          Xuất Báo Cáo <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-700 dark:text-gray-300">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-zinc-950/50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Mã Đơn</th>
                <th className="px-6 py-4 font-bold">Khách Hàng</th>
                <th className="px-6 py-4 font-bold">Sản Phẩm</th>
                <th className="px-6 py-4 font-bold">Tổng Tiền</th>
                <th className="px-6 py-4 font-bold">Trạng Thái</th>
                <th className="px-6 py-4 font-bold">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{order.product}</td>
                  <td className="px-6 py-4 font-bold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                      order.status === 'Đang giao' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
