"use client";
import React, { useMemo, useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, X, Loader2, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import ProductFormModal, { AdminProduct } from "@/components/admin/ProductFormModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

const CATEGORIES = ["streetwear", "cyberpunk", "minimalist", "techwear"];

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products", { params: { pageSize: 100 } });
      return data;
    },
  });

  const products: AdminProduct[] = data?.items || [];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p._id || "").toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete?._id) return;
    setDeletingId(productToDelete._id);
    try {
      await api.delete(`/products/${productToDelete._id}`);
      toast.success("Đã xóa sản phẩm");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
          <p className="text-xs text-gray-500 mt-1">Quản lý kho hàng, giá cả và thông tin sản phẩm.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-semibold outline-none focus:border-black dark:focus:border-white transition-all appearance-none"
            >
              <option value="all">Tất cả danh mục</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {(search || category !== "all") && (
            <button
              onClick={() => { setSearch(""); setCategory("all"); }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Xóa bộ lọc"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
            Lỗi khi tải danh sách sản phẩm.
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg font-bold">Thử lại</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-zinc-950/50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-bold">Sản phẩm</th>
                    <th className="px-6 py-4 font-bold">Danh mục</th>
                    <th className="px-6 py-4 font-bold">Giá bán</th>
                    <th className="px-6 py-4 font-bold">Tồn kho</th>
                    <th className="px-6 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                  {filtered.map((product) => (
                    <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleRow(product._id as string)} className="text-gray-400 hover:text-black dark:hover:text-white">
                            {expandedRows[product._id as string] ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                          </button>
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                              <span className="text-gray-400 text-[10px]">No Img</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">ID: {product._id?.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-wider">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{Number(product.price || 0).toLocaleString("vi-VN")} ₫</td>
                      <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                        <span className={`${(product.stock ?? 0) <= 5 ? "text-red-500 font-bold" : ""}`}>
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          product.isAvailable === false
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                        }`}>
                          {product.isAvailable === false ? "Ngừng bán" : "Đang bán"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            disabled={deletingId === product._id}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Xóa"
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[product._id as string] && (
                      <tr className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800">
                        <td colSpan={6} className="px-14 py-4">
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Link mua sản phẩm gốc</h4>
                            {product.bundleItems && product.bundleItems.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {product.bundleItems.map((item: any) => (
                                  <div key={item.id} className="flex flex-col gap-1 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{item.name}</span>
                                    {item.sourceLink ? (
                                      <a href={item.sourceLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" /> {item.sourceLink}
                                      </a>
                                    ) : (
                                      <span className="text-[11px] text-gray-400 italic">Chưa có link</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800 w-fit min-w-[250px]">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{product.name}</span>
                                {product.sourceLink ? (
                                  <a href={product.sourceLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> {product.sourceLink}
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-gray-400 italic">Chưa có link</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Không tìm thấy sản phẩm phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500 mt-auto">
              <p>Hiển thị {filtered.length} / {products.length} sản phẩm</p>
            </div>
          </>
        )}
      </div>

      <ProductFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmModal
        open={!!productToDelete}
        title="Xóa Sản Phẩm"
        message={
          <>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.name}</strong> không? Hành động này không thể hoàn tác.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
        isLoading={!!deletingId}
        type="danger"
        confirmText="Xóa"
      />
    </div>
  );
}
