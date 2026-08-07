"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductQuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, toggleCart } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!quickViewProduct) return null;

  const currentImage = activeImage || quickViewProduct.imageUrl;
  const isFavorite = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(
        {
          id: quickViewProduct.id,
          name: quickViewProduct.name,
          price: quickViewProduct.price || 0,
          imageUrl: quickViewProduct.imageUrl,
          description: quickViewProduct.description,
        },
        selectedSize
      );
    }
    setQuickViewProduct(null);
    toggleCart();
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-zinc-800"
          >
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50 dark:bg-zinc-950/50 flex flex-col items-center justify-between">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner">
                <Image
                  src={currentImage}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {quickViewProduct.secondaryImageUrl && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setActiveImage(quickViewProduct.imageUrl)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === quickViewProduct.imageUrl
                        ? "border-black dark:border-white scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={quickViewProduct.imageUrl} alt="Thumbnail 1" fill className="object-cover" />
                  </button>
                  <button
                    onClick={() => setActiveImage(quickViewProduct.secondaryImageUrl!)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === quickViewProduct.secondaryImageUrl
                        ? "border-black dark:border-white scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={quickViewProduct.secondaryImageUrl} alt="Thumbnail 2" fill className="object-cover" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Information & Controls */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {quickViewProduct.category}
                  </span>
                  {quickViewProduct.badge && (
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-black text-white dark:bg-white dark:text-black rounded-full uppercase">
                      {quickViewProduct.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                  {quickViewProduct.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{quickViewProduct.rating}</span>
                  <span>({quickViewProduct.reviewsCount} đánh giá)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {(quickViewProduct.price || 0).toLocaleString("vi-VN")} ₫
                  </span>
                  {quickViewProduct.originalPrice && !isNaN(Number(quickViewProduct.originalPrice)) && (
                    <span className="text-lg text-gray-400 line-through">
                      {Number(quickViewProduct.originalPrice).toLocaleString("vi-VN")} ₫
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {quickViewProduct.description}
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                      Chọn kích cỡ
                    </label>
                    <span className="text-xs text-gray-400 underline cursor-pointer">Bảng size</span>
                  </div>
                  <div className="flex gap-2">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-11 h-11 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${
                          selectedSize === s
                            ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white scale-105 shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 hover:border-gray-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white block mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-bold text-sm text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions: Add to Bag & Wishlist */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" /> Thêm vào giỏ • {((quickViewProduct.price || 0) * quantity).toLocaleString("vi-VN")} ₫
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFavorite
                      ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-950/40"
                      : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-[10px] text-gray-400 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                  <span>Giao hàng hỏa tốc</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                  <span>30 Ngày đổi trả</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                  <span>100% Chính hãng</span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
