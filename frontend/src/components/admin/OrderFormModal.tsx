"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors";

const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

export default function OrderFormModal({ open, onClose }: OrderFormModalProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    shippingAddress: "",
    paymentMethod: "COD",
  });
  const [items, setItems] = useState<any[]>([]);

  // Fetch products for dropdown
  const { data: productsData } = useQuery({
    queryKey: ["products-minimal"],
    queryFn: async () => {
      const { data } = await api.get("/products", { params: { pageSize: 100 } });
      return data;
    },
    enabled: open,
  });
  const products = productsData?.items || [];

  useEffect(() => {
    if (open) {
      setForm({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        shippingAddress: "",
        paymentMethod: "COD",
      });
      setItems([]);
    }
  }, [open]);

  if (!open) return null;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { product: "", size: "M", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      if (field === "product") {
        const prod = products.find((p: any) => p._id === value);
        newItems[index] = { ...newItems[index], product: value, price: prod?.price || 0, size: prod?.sizes?.[0] || "M" };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return newItems;
    });
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.guestPhone || !form.shippingAddress) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }
    if (items.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    if (items.some((i) => !i.product)) {
      toast.error("Vui lòng chọn sản phẩm hợp lệ");
      return;
    }

    const payload = {
      guestInfo: {
        name: form.guestName,
        email: form.guestEmail || "khach@vanglai.com",
        phone: form.guestPhone,
      },
      shippingAddress: form.shippingAddress,
      paymentMethod: form.paymentMethod,
      items: items.map((i) => ({
        product: i.product,
        size: i.size,
        quantity: Number(i.quantity),
        price: Number(i.price),
      })),
      totalAmount: calculateTotal(),
    };

    setSaving(true);
    try {
      await api.post("/orders", payload);
      toast.success("Đã tạo đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Tạo đơn hàng thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">
            Tạo Đơn Hàng Mới
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-3">1. Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tên người nhận *</label>
                <input name="guestName" value={form.guestName} onChange={handleFormChange} className={inputClass} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className={labelClass}>Số điện thoại *</label>
                <input name="guestPhone" value={form.guestPhone} onChange={handleFormChange} className={inputClass} placeholder="0901234567" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email (Tuỳ chọn)</label>
                <input type="email" name="guestEmail" value={form.guestEmail} onChange={handleFormChange} className={inputClass} placeholder="email@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Địa chỉ giao hàng *</label>
                <input name="shippingAddress" value={form.shippingAddress} onChange={handleFormChange} className={inputClass} placeholder="Số 1, Đường 2, Quận 3..." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Phương thức thanh toán</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange} className={inputClass}>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="VietQR">Chuyển khoản VietQR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">2. Sản phẩm</h3>
              <button type="button" onClick={addItem} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Thêm sản phẩm
              </button>
            </div>
            
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl text-center text-sm text-gray-500 border border-dashed border-gray-300 dark:border-zinc-700">
                  Chưa có sản phẩm nào trong đơn hàng.
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl items-start sm:items-center">
                    <div className="flex-1 w-full">
                      <select 
                        value={item.product} 
                        onChange={(e) => handleItemChange(index, "product", e.target.value)} 
                        className={inputClass + " py-2 text-xs"}
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((p: any) => (
                          <option key={p._id} value={p._id}>{p.name} (${p.price})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input 
                        type="text" 
                        value={item.size} 
                        onChange={(e) => handleItemChange(index, "size", e.target.value)} 
                        placeholder="Size" 
                        className={inputClass + " py-2 text-xs text-center"} 
                      />
                    </div>
                    <div className="w-20">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)} 
                        className={inputClass + " py-2 text-xs text-center"} 
                      />
                    </div>
                    <button type="button" onClick={() => removeItem(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="font-bold text-gray-900 dark:text-white">Tổng tiền:</span>
              <span className="font-black text-xl text-red-500">{calculateTotal().toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:scale-[1.01] transition-transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Xác Nhận Tạo Đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
