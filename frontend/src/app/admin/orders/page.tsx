"use client";
import React, { useState } from "react";
import { Loader2, Trash2, Package, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import ConfirmModal from "@/components/admin/ConfirmModal";

const STATUSES = ["Ordered", "Confirmed", "Packing", "Shipping", "Delivered", "Cancelled"];

const statusLabel: Record<string, string> = {
  Ordered: "Đã đặt",
  Confirmed: "Đã xác nhận",
  Packing: "Đang đóng gói",
  Shipping: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const statusClass: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  Shipping: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  Packing: "bg-purple-50 text-purple-600 dark:bg-purple-500/10",
  Confirmed: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10",
  Ordered: "bg-orange-50 text-orange-600 dark:bg-orange-500/10",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-500/10",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const getItemName = (item: any) => {
  if (typeof item.product === "object" && item.product && item.product.name) return item.product.name;
  if (typeof item.product === "string") {
    return item.product.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return "Sản phẩm";
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders", {
        params: { pageSize: 100 },
      });
      return data;
    },
  });

  const orders: any[] = data?.items || [];
  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const handleStatusChange = async (order: any, newStatus: string) => {
    if (newStatus === order.status) return;
    setUpdatingId(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status: newStatus });
      toast.success(`Đã cập nhật trạng thái: ${statusLabel[newStatus]}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    setDeletingId(orderToDelete._id);
    try {
      await api.delete(`/orders/${orderToDelete._id}`);
      toast.success("Đã xóa đơn hàng");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa đơn hàng thất bại");
    } finally {
      setDeletingId(null);
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Quản lý Đơn Hàng</h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi và cập nhật trạng thái đơn hàng.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  statusFilter === s
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {s === "all" ? "Tất cả" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-red-500 text-sm font-medium">
            Lỗi khi tải danh sách đơn hàng.
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg font-bold">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Mã Đơn</th>
                  <th className="px-6 py-4 font-bold">Khách Hàng</th>
                  <th className="px-6 py-4 font-bold">Sản Phẩm</th>
                  <th className="px-6 py-4 font-bold">Tổng Tiền</th>
                  <th className="px-6 py-4 font-bold">Thanh Toán</th>
                  <th className="px-6 py-4 font-bold">Trạng Thái</th>
                  <th className="px-6 py-4 font-bold">Thời Gian</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">
                        {order._id.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{order.user?.name || order.guestInfo?.name || "Khách vãng lai"}</p>
                        <p className="text-[10px] text-gray-400">{order.user?.email || order.guestInfo?.email || "Không có email"}</p>
                        <p className="text-[10px] text-gray-400">{order.user?.phone || order.guestInfo?.phone || "Không có SĐT"}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[240px]">
                        {order.items?.length > 1 ? (
                          <button 
                            onClick={() => toggleExpand(order._id)}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                          >
                            <Package className="w-3.5 h-3.5 shrink-0" />
                            Combo {order.items.length} sản phẩm
                            {expandedOrderId === order._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <p className="truncate text-gray-600 dark:text-gray-300 font-medium">
                              {order.items?.[0] ? `${getItemName(order.items[0])} (${order.items[0].size} x${order.items[0].quantity})` : "-"}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {order.paymentMethod === 'COD' ? 'Tiền mặt' : 'Thanh toán Online'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold w-fit uppercase ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                              : order.paymentStatus === "Failed"
                              ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-500/10"
                          }`}>
                            {order.paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {updatingId === order._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold border-0 outline-none cursor-pointer appearance-none ${statusClass[order.status] || "bg-gray-50 text-gray-500"}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{statusLabel[s]}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(order)}
                            disabled={deletingId === order._id}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Xóa"
                          >
                            {deletingId === order._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Collapsible Row for Combo Items */}
                    {expandedOrderId === order._id && order.items?.length > 1 && (
                      <tr className="bg-gray-50/50 dark:bg-zinc-900/30">
                        <td colSpan={8} className="px-6 py-3 border-t border-dashed border-gray-200 dark:border-zinc-800">
                          <div className="pl-14 space-y-2">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Chi tiết sản phẩm</p>
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700 shrink-0" />
                                <span className="font-semibold text-gray-900 dark:text-white w-48 truncate">{getItemName(item)}</span>
                                <span className="text-gray-500">Size: <strong className="text-gray-900 dark:text-white">{item.size}</strong></span>
                                <span className="text-gray-500">x <strong className="text-gray-900 dark:text-white">{item.quantity}</strong></span>
                                <span className="text-red-500 font-bold ml-4">{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingOrder(null)} />
          <div className="relative bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Chi tiết đơn hàng {viewingOrder._id.substring(0, 10)}...</h2>
              <button onClick={() => setViewingOrder(null)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Thông tin khách hàng & Giao hàng</h3>
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm space-y-2 border border-gray-100 dark:border-zinc-800">
                  <p><span className="font-semibold text-gray-600 dark:text-gray-400">Người nhận:</span> <span className="font-bold text-gray-900 dark:text-white">{viewingOrder.user?.name || viewingOrder.guestInfo?.name || "N/A"}</span></p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> {viewingOrder.user?.email || viewingOrder.guestInfo?.email || "N/A"}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-400">Số điện thoại:</span> {viewingOrder.guestInfo?.phone || "N/A"}</p>
                  <p className="pt-2 mt-2 border-t border-gray-200 dark:border-zinc-800"><span className="font-semibold text-gray-600 dark:text-gray-400">Địa chỉ giao hàng:</span></p>
                  <p className="font-medium text-gray-900 dark:text-white">{viewingOrder.shippingAddress || "N/A"}</p>
                </div>
              </div>
              
              {/* Payment Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Thanh toán</h3>
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl text-sm space-y-2 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Phương thức:</span> 
                    <span className="font-bold uppercase text-gray-900 dark:text-white">{viewingOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      viewingOrder.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" :
                      viewingOrder.paymentStatus === "Failed" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}>
                      {viewingOrder.paymentStatus || "Pending"}
                    </span>
                  </div>
                  {viewingOrder.vietQrTransactionId && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-400">Mã giao dịch (TxID):</span> 
                      <span className="font-mono text-gray-900 dark:text-white">{viewingOrder.vietQrTransactionId}</span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white uppercase text-xs">Tổng tiền:</span> 
                    <span className="font-black text-lg text-red-500">{formatCurrency(viewingOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Items Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sản phẩm ({viewingOrder.items?.length || 0})</h3>
                <div className="space-y-3">
                  {viewingOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{getItemName(item)}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">Size: <span className="font-bold text-gray-900 dark:text-white">{item.size}</span> x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!orderToDelete}
        title="Xóa Đơn Hàng"
        message={
          <>
            Bạn có chắc chắn muốn xóa đơn hàng <strong>{orderToDelete?._id}</strong> không? Hành động này không thể hoàn tác.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setOrderToDelete(null)}
        isLoading={!!deletingId}
        type="danger"
        confirmText="Xóa"
      />
    </div>
  );
}
