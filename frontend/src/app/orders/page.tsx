"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Package, Truck, CheckCircle2, Clock, ClipboardCheck, Check } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

const getProgressStyle = (status: string) => {
  switch (status) {
    case 'Delivered': return { width: '100%', backgroundColor: '#10b981' }; // emerald-500
    case 'Shipping': return { width: '75%', backgroundColor: '#3b82f6' }; // blue-500
    case 'Packing': return { width: '50%', backgroundColor: '#a855f7' }; // purple-500
    case 'Confirmed': return { width: '25%', backgroundColor: '#06b6d4' }; // cyan-500
    case 'Ordered': return { width: '0%', backgroundColor: '#f97316' }; // orange-500
    default: return { width: '0%', backgroundColor: '#e5e7eb' };
  }
};

const STATUS_ORDER = ['Ordered', 'Confirmed', 'Packing', 'Shipping', 'Delivered'];

const getStepState = (currentStatus: string, stepStatus: string) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(stepStatus);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'future';
};

const getStepClass = (state: string, currentColorClass: string) => {
  if (state === 'completed') return 'opacity-0';
  if (state === 'current') return `${currentColorClass} text-white shadow-lg`;
  return 'bg-white border-2 border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 text-gray-400';
};

export default function OrdersPage() {
  const { t } = useTranslation("orders");
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
            {t("title")}
          </h1>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                You haven't placed any orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t("orderId")}</p>
                      <p className="font-mono font-bold text-sm truncate max-w-[120px] sm:max-w-xs" title={order._id}>{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">Date</p>
                      <p className="font-bold text-sm text-right">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">Total</p>
                      <p className="font-black text-lg text-right">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="mb-8 space-y-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm line-clamp-1">{item.product?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Futuristic Tracking Timeline */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">{t("status")}</p>
                    
                    <div className="relative flex justify-between">
                      {/* Progress Line */}
                      <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 dark:bg-zinc-800 rounded-full z-0"></div>
                      <div 
                        className="absolute top-4 left-0 h-1 rounded-full z-0 transition-all duration-1000"
                        style={getProgressStyle(order.status)}
                      ></div>

                      {/* Step 1: Pending */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          getStepClass(getStepState(order.status, 'Ordered'), 'bg-orange-500 shadow-orange-500/30')
                        }`}>
                          {getStepState(order.status, 'Ordered') === 'completed' ? null : <Clock className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${getStepState(order.status, 'Ordered') === 'completed' ? 'opacity-0' : ''}`}>
                          {t("timeline.pending")}
                        </span>
                      </div>

                      {/* Step 2: Confirmed */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          getStepClass(getStepState(order.status, 'Confirmed'), 'bg-cyan-500 shadow-cyan-500/30')
                        }`}>
                          {getStepState(order.status, 'Confirmed') === 'completed' ? null : <ClipboardCheck className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${getStepState(order.status, 'Confirmed') === 'completed' ? 'opacity-0' : ''}`}>
                          {t("timeline.confirmed")}
                        </span>
                      </div>

                      {/* Step 3: Packing */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          getStepClass(getStepState(order.status, 'Packing'), 'bg-purple-500 shadow-purple-500/30')
                        }`}>
                          {getStepState(order.status, 'Packing') === 'completed' ? null : <Package className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${getStepState(order.status, 'Packing') === 'completed' ? 'opacity-0' : ''}`}>
                          {t("timeline.packing")}
                        </span>
                      </div>

                      {/* Step 4: Shipping */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          getStepClass(getStepState(order.status, 'Shipping'), 'bg-blue-500 shadow-blue-500/30')
                        }`}>
                          {getStepState(order.status, 'Shipping') === 'completed' ? null : <Truck className={`w-4 h-4 ${order.status === 'Shipping' ? 'animate-bounce' : ''}`} />}
                        </div>
                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${getStepState(order.status, 'Shipping') === 'completed' ? 'opacity-0' : ''}`}>
                          {t("timeline.shipping")}
                        </span>
                      </div>

                      {/* Step 5: Delivered */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          getStepClass(getStepState(order.status, 'Delivered'), 'bg-emerald-500 shadow-emerald-500/30')
                        }`}>
                          {getStepState(order.status, 'Delivered') === 'completed' ? null : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${getStepState(order.status, 'Delivered') === 'completed' ? 'opacity-0' : ''}`}>
                          {t("timeline.delivered")}
                        </span>
                      </div>
                      
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
