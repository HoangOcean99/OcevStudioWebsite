"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MapPin, Phone, X, CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ShippingInfoModal() {
  const { user, updateProfile } = useAuthStore();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isForced, setIsForced] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Only check if user is logged in
    if (!user) {
      setIsOpen(false);
      return;
    }

    // Check if missing info
    const isMissingInfo = !user.phone || !user.address;

    if (isMissingInfo) {
      if (pathname.includes("/checkout")) {
        setIsForced(true);
        setIsOpen(true);
      } else {
        const hasSkipped = sessionStorage.getItem("hasSkippedShippingModal");
        if (!hasSkipped) {
          setIsForced(false);
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(false);
    }
  }, [user, pathname]);

  if (!isOpen) return null;

  const handleSkip = () => {
    sessionStorage.setItem("hasSkippedShippingModal", "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ phone, address });
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        
        {!isForced && !success && (
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-bold text-white">Cập nhật thành công!</h3>
            <p className="text-sm text-gray-400">Thông tin giao hàng đã được lưu.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {isForced ? "Bắt buộc Thanh toán" : "Hoàn thiện Hồ sơ"}
              </h2>
              <p className="text-xs text-gray-400">
                {isForced 
                  ? "Vui lòng cung cấp thông tin giao hàng để tiến hành đặt hàng."
                  : "Thêm thông tin giao hàng để trải nghiệm mua sắm và thanh toán nhanh hơn."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại của bạn"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Địa chỉ Giao hàng
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng chi tiết"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !phone || !address}
                  className="w-full py-3.5 bg-white text-black font-extrabold rounded-xl text-xs hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  {isLoading ? "Đang lưu..." : "Lưu Thông Tin"}
                </button>
                
                {!isForced && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-2.5 text-gray-500 font-bold text-[11px] hover:text-white transition-colors"
                  >
                    Bỏ qua, để sau
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
