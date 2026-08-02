"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Package, Truck, CheckCircle2, User, MapPin } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const { t } = useTranslation("profile");
  const { user } = useAuthStore();

  if (!user) return null;

  // Mock Orders Data
  const mockOrders = [
    {
      id: "ORD-2026-XQ9",
      date: "Oct 24, 2026",
      total: 215.00,
      status: "shipping",
      items: [
        { name: "Tech-Fleece Padded Bomber", qty: 1, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop" }
      ]
    },
    {
      id: "ORD-2026-A12",
      date: "Oct 10, 2026",
      total: 129.99,
      status: "delivered",
      items: [
        { name: "Cyber-Graphic Hoodie", qty: 1, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop" }
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
        <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col items-center text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-zinc-800 mb-4 bg-gray-100 dark:bg-zinc-800">
                <Image 
                  src={user.avatar || "/default-avatar.svg"} 
                  alt={user.name} 
                  fill 
                  sizes="96px"
                  className="object-cover" 
                />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              
              <div className="w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Size: {user.preferredSize}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Neo-Hanoi, Sector 7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Orders Area */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase">{t("activeOrders")}</h2>
            
            <div className="space-y-6">
              {mockOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl">
                  
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t("orderId")}</p>
                      <p className="font-mono font-bold text-sm">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">Date</p>
                      <p className="font-bold text-sm text-right">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">Total</p>
                      <p className="font-black text-lg text-right">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="mb-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Futuristic Tracking Timeline */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">{t("status")}</p>
                    
                    <div className="relative flex justify-between">
                      {/* Progress Line */}
                      <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 dark:bg-zinc-800 rounded-full -z-10"></div>
                      <div 
                        className="absolute top-4 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -z-10 transition-all duration-1000"
                        style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipping' ? '50%' : '0%' }}
                      ></div>

                      {/* Step 1: Packing */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          order.status === 'delivered' || order.status === 'shipping' 
                            ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white border-2 border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 text-gray-400'
                        }`}>
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-center w-20 leading-tight">
                          {t("timeline.packing")}
                        </span>
                      </div>

                      {/* Step 2: Shipping */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          order.status === 'delivered' || order.status === 'shipping' 
                            ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white border-2 border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 text-gray-400'
                        }`}>
                          <Truck className={`w-4 h-4 ${order.status === 'shipping' ? 'animate-bounce' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-center w-20 leading-tight">
                          {t("timeline.shipping")}
                        </span>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          order.status === 'delivered' 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                            : 'bg-white border-2 border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 text-gray-400'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-center w-20 leading-tight">
                          {t("timeline.delivered")}
                        </span>
                      </div>
                      
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
      </div>
    </ProtectedRoute>
  );
}
