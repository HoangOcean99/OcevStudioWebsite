"use client";
import { useState } from "react";
import { TrendingUp, DollarSign, TrendingDown, Wallet, Loader2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("all");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "inventory",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const { data: cashflow, isLoading: cashflowLoading } = useQuery({
    queryKey: ["cashflow", period],
    queryFn: async () => {
      const { data } = await api.get(`/admin/cashflow?period=${period}`);
      return data;
    },
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data } = await api.get("/admin/expenses");
      return data;
    },
  });

  const createExpense = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/admin/expenses", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Đã ghi nhận khoản chi!");
      queryClient.invalidateQueries({ queryKey: ["cashflow"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowExpenseForm(false);
      setExpenseForm({ amount: "", category: "inventory", description: "", date: new Date().toISOString().split('T')[0] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi ghi khoản chi");
    }
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) {
      toast.error("Vui lòng điền đủ Số tiền và Lý do chi");
      return;
    }
    createExpense.mutate({
      ...expenseForm,
      amount: Number(expenseForm.amount)
    });
  };

  const stats = [
    { name: "Tổng Doanh Thu (Tiền vào)", value: cashflow ? formatCurrency(cashflow.totalRevenue) : "$0", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
    { name: "Tổng Chi Phí (Tiền ra)", value: cashflow ? formatCurrency(cashflow.totalExpense) : "$0", icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
    { name: "Lợi Nhuận Ròng", value: cashflow ? formatCurrency(cashflow.netProfit) : "$0", icon: <DollarSign className="w-5 h-5 text-blue-500" /> },
    { name: "Số Dư Hiện Tại", value: cashflow ? formatCurrency(cashflow.netProfit) : "$0", icon: <Wallet className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Dòng Tiền & Lợi Nhuận</h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi sức khỏe tài chính của cửa hàng trực quan.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">Toàn bộ thời gian</option>
            <option value="7days">7 ngày qua</option>
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="thisYear">Năm nay</option>
          </select>
          <button 
            onClick={() => setShowExpenseForm(!showExpenseForm)} 
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2"
          >
            {showExpenseForm ? "Đóng Form" : <><Plus className="w-3.5 h-3.5" /> Ghi Nhận Chi Phí</>}
          </button>
        </div>
      </div>

      {showExpenseForm && (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Ghi Nhận Khoản Chi (Tiền Ra)</h2>
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Số Tiền (VNĐ)</label>
              <input type="number" min="0" step="1000" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Ví dụ: 150000" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Hạng mục</label>
              <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="Nhập Hàng (Inventory)">Nhập Hàng (Inventory)</option>
                <option value="Marketing">Marketing (Ads)</option>
                <option value="Vận chuyển (Shipping)">Vận chuyển</option>
                <option value="Khác (Other)">Khác</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lý do / Mô tả</label>
              <input type="text" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Nhập áo thun đen size M..." />
            </div>
            <div className="lg:col-span-1 flex flex-col justify-end">
              <button disabled={createExpense.isPending} type="submit" className="w-full h-[38px] bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 font-bold rounded-lg text-xs transition-colors flex items-center justify-center disabled:opacity-50">
                {createExpense.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Khoản Chi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cashflowLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse h-28" />
          ))
        ) : (
          stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-700 dark:text-gray-300">
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <h3 className={`text-2xl font-black mt-1 ${stat.value.startsWith('-$') ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{stat.value}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-6">Biểu Đồ Tiền Vào / Tiền Ra</h2>
          {cashflowLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : cashflow?.chartData && cashflow.chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflow.chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="TiềnVào" name="Doanh Thu" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="TiềnRa" name="Chi Phí" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LợiNhuận" name="Lợi Nhuận" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm font-medium">Chưa có dữ liệu giao dịch</div>
          )}
        </div>

        {/* Lịch sử khoản chi */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5 flex flex-col h-[400px]">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Lịch Sử Chi Phí Gần Đây</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {expensesLoading ? (
               <div className="h-full flex items-center justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
               </div>
            ) : expenses?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-10">Chưa ghi nhận khoản chi nào.</p>
            ) : (
              <div className="space-y-4">
                {expenses?.map((exp: any) => (
                  <div key={exp._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-950">
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{exp.description}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase">{exp.category} • {formatDate(exp.date)}</p>
                    </div>
                    <div className="font-black text-red-500">
                      -{formatCurrency(exp.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
