"use client";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  imageUrl?: string;
}

export default function AdminProductsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    }
  });

  const products: Product[] = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
          <p className="text-xs text-gray-500 mt-1">Quản lý kho hàng, giá cả và thông tin sản phẩm.</p>
        </div>
        <button className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-medium outline-none focus:border-black dark:focus:border-white transition-all"
          />
        </div>
        <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 text-sm font-medium">
            Lỗi khi tải danh sách sản phẩm: {(error as any).message}
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
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                              <span className="text-gray-400 text-[10px]">No Img</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">ID: {product._id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-wider">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                        {product.stock !== undefined ? product.stock : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="Sửa">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Thêm tùy chọn">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Chưa có sản phẩm nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500 mt-auto">
              <p>Hiển thị danh sách của {products.length} sản phẩm</p>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50">Trước</button>
                <button className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-md font-bold">1</button>
                <button className="px-3 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50">Sau</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
