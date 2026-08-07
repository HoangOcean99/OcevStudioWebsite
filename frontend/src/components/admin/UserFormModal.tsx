"use client";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";

export interface AdminUser {
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  phone?: string;
  address?: string;
  isBanned?: boolean;
}

interface UserFormModalProps {
  open: boolean;
  initial: AdminUser | null;
  onClose: () => void;
}

const inputClass =
  "w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors";

const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

export default function UserFormModal({ open, initial, onClose }: UserFormModalProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (open && initial) {
      setForm({
        name: initial.name || "",
        email: initial.email || "",
        role: initial.role || "user",
        phone: initial.phone || "",
        address: initial.address || "",
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    const payload: any = {
      name: form.name.trim(),
      role: form.role,
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    setSaving(true);
    try {
      if (initial?._id) {
        await api.put(`/admin/users/${initial._id}`, payload);
        toast.success("Đã cập nhật người dùng");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lưu người dùng thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">
            Sửa Người Dùng
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Tên đầy đủ *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email (Không thể sửa)</label>
            <input type="email" name="email" value={form.email} disabled className={inputClass + " opacity-70 cursor-not-allowed"} />
          </div>

          <div>
            <label className={labelClass}>Vai trò *</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
              <option value="user">Khách hàng (User)</option>
              <option value="staff">Nhân viên (Staff)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="0987654321" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Địa chỉ</label>
            <textarea rows={2} name="address" value={form.address} onChange={handleChange} placeholder="Hà Nội, Việt Nam" className={inputClass} />
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
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
