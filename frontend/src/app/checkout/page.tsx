"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import toast from 'react-hot-toast';
import Footer from "@/components/Footer";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, CheckCircle2, Loader2, Package, CreditCard, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import api from "@/lib/api";

export default function CheckoutPage() {
  const { t } = useTranslation("checkout");
  const { cart, clearCart } = useAppStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [orderCode, setOrderCode] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [pendingOrderCode, setPendingOrderCode] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStep1Valid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "" && formData.address.trim() !== "";
  
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrderClick = () => {
    if (paymentMethod === 'bank') {
      const code = "OCEV-" + Math.floor(10000 + Math.random() * 90000).toString();
      setPendingOrderCode(code);
      setShowQR(true);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          size: item.size || 'Freesize',
          price: item.price
        })),
        shippingAddress: formData.address,
        paymentMethod: paymentMethod === 'cod' ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng",
        totalAmount: totalAmount + 15, // Including $15 drone shipping
        guestInfo: !user ? {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        } : undefined
      };

      const response = await api.post('/orders', orderData);
      
      const generatedCode = pendingOrderCode || "OCEV-" + Math.floor(10000 + Math.random() * 90000).toString();
      setOrderCode(response.data?.orderCode || response.data?._id?.substring(0, 8).toUpperCase() || generatedCode);
      
      setStep(3);
      setShowQR(false);
      clearCart();
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("There was an error placing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:scale-105 mb-8">
          <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
        </Link>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            {/* Step 1 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-200'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{t("step1")}</span>
            </div>
            
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-zinc-800'}`}></div>
            
            {/* Step 2 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-200 dark:border-zinc-800'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{t("step2")}</span>
            </div>

            <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-zinc-800'}`}></div>
            
            {/* Step 3 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-black dark:text-white' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200 dark:border-zinc-800'}`}>
                3
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{t("step3")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" /> {t("step1")}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("fullName")}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Alex Ocev" className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="alex@example.com" className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("phone")}</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+84 987 654 321" className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("address")}</label>
                    <textarea rows={3} name="address" value={formData.address} onChange={handleInputChange} placeholder="Sector 7, Neo-Hanoi, Cyber-District 2077" className="w-full bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"></textarea>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className={`mt-8 w-full py-4 rounded-xl text-sm font-bold transition-transform shadow-lg ${isStep1Valid ? 'bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'}`}
                >
                  {t("next")}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> {t("step2")}
                </h2>
                
                <div className="space-y-4">
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-xl bg-gray-50 dark:bg-zinc-950/50 flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-black dark:border-white' : 'border-transparent dark:border-zinc-800 opacity-70'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-4 flex-shrink-0 ${paymentMethod === 'cod' ? 'border-black dark:border-white bg-white dark:bg-black' : 'border-gray-300 dark:border-zinc-700 bg-transparent'}`}></div>
                    <div>
                      <p className="font-bold text-sm">{t("paymentCrypto")}</p>
                      <p className="text-xs text-gray-500">{t("paymentCryptoDesc")}</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-xl bg-gray-50 dark:bg-zinc-950/50 flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-black dark:border-white' : 'border-transparent dark:border-zinc-800 opacity-70'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-4 flex-shrink-0 ${paymentMethod === 'bank' ? 'border-black dark:border-white bg-white dark:bg-black' : 'border-gray-300 dark:border-zinc-700 bg-transparent'}`}></div>
                    <div>
                      <p className="font-bold text-sm">{t("paymentCredit")}</p>
                      <p className="text-xs text-gray-500">{t("paymentCreditDesc")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-4 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button 
                    onClick={handlePlaceOrderClick}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {t("processing")}</>
                    ) : (
                      <>{paymentMethod === 'bank' ? "Tiếp tục thanh toán" : t("placeOrder")}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && showQR && (
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 flex flex-col items-center text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Quét mã thanh toán</h2>
                <p className="text-gray-500 text-sm mb-6">Mã đơn hàng: <span className="font-bold text-black dark:text-white">{pendingOrderCode}</span></p>
                
                <div className="bg-white p-4 rounded-2xl mb-6 inline-block shadow-lg border border-gray-100">
                  <img 
                    src="/QR.jpg" 
                    alt="QR Code" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-zinc-950/50 rounded-xl p-4 text-left w-full max-w-sm mb-8 space-y-2 text-sm border border-gray-200 dark:border-zinc-800">
                  <p><span className="text-gray-500">Ngân hàng:</span> <span className="font-bold text-black dark:text-white float-right">VPBank</span></p>
                  <p><span className="text-gray-500">Số tài khoản:</span> <span className="font-bold text-black dark:text-white float-right">0968178905</span></p>
                  <p><span className="text-gray-500">Chủ tài khoản:</span> <span className="font-bold text-black dark:text-white float-right">HOANG HAI DUONG</span></p>
                  <p><span className="text-gray-500">Nội dung:</span> <span className="font-bold text-black dark:text-white float-right">{pendingOrderCode}</span></p>
                </div>
                
                <p className="text-xs text-gray-500 mb-8 max-w-sm">
                  Hãy giữ nguyên nội dung chuyển khoản để hệ thống ghi nhận.
                </p>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setShowQR(false)}
                    className="px-6 py-4 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {t("back")}
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {t("processing")}</>
                    ) : (
                      <>Tôi đã chuyển khoản</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-4 text-emerald-600 dark:text-emerald-400">
                  {t("successTitle")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                  {t("successMessage")}
                </p>
                <Link
                  href="/orders"
                  className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                  {t("viewOrders")}
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 dark:border-zinc-800 shadow-2xl sticky top-28">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
                {t("orderSummary")}
              </h3>
              
              {cart.length === 0 && step !== 3 ? (
                <p className="text-sm text-gray-500 text-center py-4">{t("cartEmpty")}</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {step === 3 ? (
                    <div className="text-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t("orderPlaced")}
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.cartItemId} className="flex gap-3">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                          <p className="text-xs font-bold mt-1">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step !== 3 && (
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{t("subtotal")}</span>
                    <span>{totalAmount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{t("shippingFee")}</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-2">
                    <span>{t("total")}</span>
                    <span>{(totalAmount + (cart.length > 0 ? 15 : 0)).toLocaleString("vi-VN")} ₫</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
        </main>
        
        <Footer />
      </div>
  );
}
