"use client";

import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Check, Palette } from "lucide-react";
import toast from 'react-hot-toast';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateCartItemSize, updateCartItemQuantity, updateCartItemColor, removeFromCart, removeOrDowngradeBundleItem } = useAppStore();
  const router = useRouter();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Group cart items
  const renderableItems = useMemo(() => {
    const items: any[] = [];
    const processedBundleIds = new Set<string>();

    cart.forEach(item => {
      if (item.cartBundleId && !processedBundleIds.has(item.cartBundleId)) {
        processedBundleIds.add(item.cartBundleId);
        const bundleItems = cart.filter(i => i.cartBundleId === item.cartBundleId);
        
        if (item.isBundle) {
          items.push({ type: 'bundle', id: item.cartBundleId, name: item.bundleName, items: bundleItems });
        } else if (item.isCustom && bundleItems.length >= 2) {
          items.push({ type: 'custom-bundle', id: item.cartBundleId, name: 'Combo Lẻ Tự Xếp', items: bundleItems });
        } else {
          bundleItems.forEach(singleItem => {
            items.push({ type: 'single', item: singleItem });
          });
        }
      } else if (!item.cartBundleId) {
        items.push({ type: 'single', item });
      }
    });
    return items;
  }, [cart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-black shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> 
                Giỏ Hàng
              </h2>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-wider text-sm">Giỏ hàng trống.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {renderableItems.map((group, idx) => {
                    if (group.type === 'bundle') {
                      const bundleAmount = group.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
                      return (
                        <div key={group.id} className="bg-orange-50 dark:bg-orange-950/20 rounded-3xl border border-orange-200 dark:border-orange-900/50 p-5 space-y-4 relative">
                          <div className="flex flex-col gap-1 pb-4 border-b border-orange-200/50 dark:border-orange-900/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-black text-orange-900 dark:text-orange-100 uppercase tracking-tight text-sm flex items-center gap-2">
                                  Combo: {group.name}
                                </h3>
                                <p className="text-xs font-bold text-orange-700/70 dark:text-orange-400 mt-0.5">{bundleAmount.toLocaleString("vi-VN")} ₫</p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-black rounded-md uppercase tracking-wider shrink-0 shadow-sm border border-green-200 dark:border-green-800">
                                Combo Ưu Đãi
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {group.items.map((item: any) => (
                              <div key={item.cartItemId} className="flex gap-3 relative group/item">
                                {/* Xóa khỏi combo => Thành mua lẻ */}
                                <button 
                                  onClick={() => removeOrDowngradeBundleItem(item.cartItemId)}
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
                                  title="Xóa món này khỏi Combo (những món còn lại sẽ thành mua lẻ)"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                
                                {/* Image */}
                                <div className="w-20 h-24 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden relative shrink-0 border border-orange-100 dark:border-orange-900/30">
                                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-center">
                                  <h4 className="text-xs font-bold line-clamp-1 pr-6 text-gray-900 dark:text-gray-100">{item.name}</h4>
                                  
                                  {/* Static Color Indicator */}
                                  {item.color && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: item.color.hex }} />
                                      <span className="text-[10px] text-gray-500 font-bold">{item.color.name}</span>
                                    </div>
                                  )}

                                  {/* Size picker */}
                                  <div className="flex flex-wrap gap-1 mt-2.5">
                                    {(item.availableSizes || ["Free Size"]).map((s: string) => (
                                      <button
                                        key={s}
                                        onClick={() => updateCartItemSize(item.cartItemId, s)}
                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all ${
                                          item.size === s 
                                            ? "bg-orange-500 text-white border-orange-500 shadow-sm" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
                                        }`}
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (group.type === 'custom-bundle') {
                      const bundleAmount = group.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
                      const itemCount = group.items.length;
                      const discountText = itemCount >= 4 ? 'Giảm 20%' : itemCount === 3 ? 'Giảm 15%' : 'Giảm 10%';
                      return (
                        <div key={group.id} className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-200 dark:border-indigo-900/50 p-5 space-y-4 relative">
                          <div className="flex flex-col gap-1 pb-4 border-b border-indigo-200/50 dark:border-indigo-900/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-tight text-sm flex items-center gap-2">
                                  {group.name}
                                </h3>
                                <p className="text-xs font-bold text-indigo-700/70 dark:text-indigo-400 mt-0.5">{bundleAmount.toLocaleString("vi-VN")} ₫</p>
                              </div>
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-[9px] font-black rounded-md uppercase tracking-wider shrink-0 shadow-sm border border-indigo-200 dark:border-indigo-800">
                                {discountText}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            {group.items.map((item: any) => (
                              <div key={item.cartItemId} className="flex gap-4 relative group/item">
                                {/* Xóa khỏi custom combo => sẽ tính lại giá những món còn lại */}
                                <button 
                                  onClick={() => removeOrDowngradeBundleItem(item.cartItemId)}
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                
                                {/* Image */}
                                <div className="w-20 h-28 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden relative shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-center">
                                  <h4 className="text-xs font-bold line-clamp-2 pr-6 text-gray-900 dark:text-gray-100">{item.name}</h4>
                                  
                                  {/* Color Selection for Custom Items */}
                                  {item.availableColors && item.availableColors.length > 1 && (
                                    <div className="mt-2">
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Palette className="w-3 h-3" /> Đổi Màu
                                      </p>
                                      <div className="flex gap-1.5 flex-wrap">
                                        {item.availableColors.map((c: any) => {
                                          const isSelected = item.color?.name === c.name;
                                          return (
                                            <button
                                              key={c.name}
                                              title={c.name}
                                              onClick={() => updateCartItemColor(item.cartItemId, c)}
                                              className={`relative w-4 h-4 rounded-md transition-all ${
                                                isSelected
                                                  ? "ring-2 ring-offset-1 ring-indigo-500 dark:ring-indigo-400 scale-110 shadow-sm"
                                                  : "ring-1 ring-gray-300 dark:ring-zinc-600 hover:scale-110"
                                              }`}
                                              style={{ backgroundColor: c.hex }}
                                            >
                                              {isSelected && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                  <Check className={`w-2.5 h-2.5 ${
                                                    c.hex === '#F9F9F7' || c.hex === '#C9B99A' || c.hex === '#C3B091' || c.hex === '#B2BEB5' || c.hex === '#C0C0C0'
                                                      ? 'text-gray-700'
                                                      : 'text-white'
                                                  }`} />
                                                </span>
                                              )}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Size picker */}
                                  <div className="flex flex-wrap gap-1 mt-2.5">
                                    {(item.availableSizes || ["Free Size"]).map((s: string) => (
                                      <button
                                        key={s}
                                        onClick={() => updateCartItemSize(item.cartItemId, s)}
                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all ${
                                          item.size === s 
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
                                        }`}
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      // Single item
                      const item = group.item;
                      const sizes = item.availableSizes || ["S", "M", "L", "XL"];

                      return (
                        <div key={item.cartItemId} className="flex gap-4 p-4 rounded-3xl border relative bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
                          {/* Image */}
                          <div className="relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200/50 dark:border-zinc-700/50">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start pr-6">
                              <h3 className="font-bold text-xs line-clamp-2 pr-2 text-gray-900 dark:text-gray-100 leading-snug">{item.name}</h3>
                              <p className="font-black text-sm">{item.price.toLocaleString("vi-VN")} ₫</p>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Color Selection for Custom Items */}
                            {item.availableColors && item.availableColors.length > 1 && (
                              <div className="mt-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <Palette className="w-3 h-3" /> Đổi Màu
                                </p>
                                <div className="flex gap-1.5 flex-wrap">
                                  {item.availableColors.map((c: any) => {
                                    const isSelected = item.color?.name === c.name;
                                    return (
                                      <button
                                        key={c.name}
                                        title={c.name}
                                        onClick={() => updateCartItemColor(item.cartItemId, c)}
                                        className={`relative w-5 h-5 rounded-md transition-all ${
                                          isSelected
                                            ? "ring-2 ring-offset-1 ring-black dark:ring-white scale-110 shadow-sm"
                                            : "ring-1 ring-gray-300 dark:ring-zinc-600 hover:scale-110"
                                        }`}
                                        style={{ backgroundColor: c.hex }}
                                      >
                                        {isSelected && (
                                          <span className="absolute inset-0 flex items-center justify-center">
                                            <Check className={`w-3 h-3 ${
                                              c.hex === '#F9F9F7' || c.hex === '#C9B99A' || c.hex === '#C3B091' || c.hex === '#B2BEB5' || c.hex === '#C0C0C0'
                                                ? 'text-gray-700'
                                                : 'text-white'
                                            }`} />
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Size Selection */}
                            <div className="mt-auto pt-3">
                              <div className="flex gap-1.5 flex-wrap">
                                {sizes.map((s: string) => (
                                  <button
                                    key={s}
                                    onClick={() => updateCartItemSize(item.cartItemId, s)}
                                    className={`px-2 h-6 rounded-lg text-[10px] font-black flex items-center justify-center border transition-all ${
                                      item.size === s 
                                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-sm" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700"
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3 mt-3">
                              <button 
                                onClick={() => updateCartItemQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                                className="w-6 h-6 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                                className="w-6 h-6 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Tổng cộng</span>
                  <span className="text-3xl font-black">{totalAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
                <button 
                  onClick={() => {
                    const missingSizes = cart.some(item => !item.size);
                    if (missingSizes) {
                      toast.error("Vui lòng chọn Size cho tất cả sản phẩm.");
                      return;
                    }
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-wider rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-xl"
                >
                  Thanh Toán
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
