"use client";
import { useState } from "react";
import { Loader2, Trash2, Search, X, ShieldCheck, Shield, Lock, Unlock, Edit, Plus } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import UserFormModal, { AdminUser } from "@/components/admin/UserFormModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  avatar?: string;
  isBanned?: boolean;
  createdAt?: string;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [confirmBanUser, setConfirmBanUser] = useState<AdminUser | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      const { data } = await api.get("/admin/users", {
        params: { pageSize: 100, keyword: search || undefined },
      });
      return data;
    },
  });

  const users: AdminUser[] = data?.items || [];



  const handleToggleBan = async () => {
    if (!confirmBanUser) return;
    setUpdatingId(confirmBanUser._id || null);
    try {
      await api.put(`/admin/users/${confirmBanUser._id}/ban`);
      toast.success(`${confirmBanUser.name} đã bị ${confirmBanUser.isBanned ? "mở khóa" : "khóa"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
      setConfirmBanUser(null);
    }
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDeleteUser) return;
    setDeletingId(confirmDeleteUser._id);
    try {
      await api.delete(`/admin/users/${confirmDeleteUser._id}`);
      toast.success("Đã xóa người dùng");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa người dùng thất bại");
    } finally {
      setDeletingId(null);
      setConfirmDeleteUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Quản lý Khách Hàng</h1>
          <p className="text-xs text-gray-500 mt-1">Danh sách người dùng đăng ký trên cửa hàng.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
            Lỗi khi tải danh sách người dùng.
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg font-bold">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Người Dùng</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Vai Trò</th>
                  <th className="px-6 py-4 font-bold">Ngày Đăng Ký</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shrink-0">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit ${
                          user.role === "admin"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                            : user.role === "staff"
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10"
                            : "bg-gray-50 text-gray-500 dark:bg-zinc-800"
                        }`}>
                          {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {user.role.toUpperCase()}
                        </span>
                        {user.isBanned && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-500/10 flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3" /> BANNED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setConfirmBanUser(user)}
                          disabled={updatingId === user._id}
                          className={`p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 transition-colors disabled:opacity-50 ${user.isBanned ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                          title={user.isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        >
                          {updatingId === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            user.isBanned ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteUser(user)}
                          disabled={deletingId === user._id}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          {deletingId === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy người dùng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-500 mt-auto">
          <p>Tổng số: {data?.total ?? users.length} người dùng</p>
        </div>
      </div>
      <UserFormModal open={modalOpen} initial={editingUser} onClose={() => setModalOpen(false)} />
      
      <ConfirmModal
        open={!!confirmBanUser}
        title={confirmBanUser?.isBanned ? "Xác nhận mở khóa" : "Xác nhận khóa"}
        message={
          <>
            Bạn có chắc muốn {confirmBanUser?.isBanned ? "MỞ KHÓA" : "KHÓA"} tài khoản của người dùng 
            <span className="font-bold text-gray-900 dark:text-white mx-1">
              {confirmBanUser?.name}
            </span> 
            không?
          </>
        }
        onConfirm={handleToggleBan}
        onCancel={() => setConfirmBanUser(null)}
        isLoading={updatingId === confirmBanUser?._id}
        type={confirmBanUser?.isBanned ? "info" : "warning"}
        confirmText={confirmBanUser?.isBanned ? "Mở Khóa" : "Khóa"}
      />
      
      <ConfirmModal
        open={!!confirmDeleteUser}
        title="Xác nhận xóa"
        message={
          <>
            Người dùng 
            <span className="font-bold text-gray-900 dark:text-white mx-1">
              {confirmDeleteUser?.name}
            </span> 
            sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteUser(null)}
        isLoading={deletingId === confirmDeleteUser?._id}
        type="danger"
        confirmText="Xóa vĩnh viễn"
      />
    </div>
  );
}
