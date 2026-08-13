"use client";

import Image from "next/image";
import { Star, Check, Search, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/data/productsData";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductCardProps {
  product: Product;
}

const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return "https://placehold.co/400x500/eeeeee/999999?text=No+Image";
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return "https://placehold.co/400x500/eeeeee/999999?text=Invalid+URL";
};

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation('common');
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] || "M");
  const [isHovered, setIsHovered] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
      },
      selectedSize
    );

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/shop/${product.id}`} className="relative w-full aspect-[4/5] bg-gray-50 dark:bg-zinc-950 overflow-hidden cursor-pointer block">

        {/* Main Image */}
        <Image
          src={getValidImageUrl((isHovered && product.secondaryImageUrl) ? product.secondaryImageUrl : product.imageUrl)}
          alt={product.name || "Product"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider bg-black/90 text-white dark:bg-white/90 dark:text-black rounded uppercase backdrop-blur-sm shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/80 rounded-full text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-all z-10 shadow-sm backdrop-blur-sm hover:scale-110 active:scale-95"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Bundle Indicator */}
        {product.bundleItems && product.bundleItems.length > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded text-[10px] font-bold tracking-widest text-black dark:text-white uppercase shadow-sm z-10 flex items-center gap-1.5">
            <ShoppingBag className="w-3 h-3" /> {product.bundleItems.length} MÓN
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10">
          <div
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-black dark:text-white text-xs font-bold rounded-xl shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" /> Xem Chi Tiết
          </div>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest font-semibold">
            {(product.category as string) === 'streetwear' || (product.category as string) === 'techwear' ? 'đồ nam' : (product.category as string) === 'cyberpunk' ? 'đồ nữ' : (product.category as string) === 'minimalist' ? 'đồ đôi' : product.category}
          </div>

          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/shop/${product.id}`}
              className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400 transition-colors block flex-1 leading-snug line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {(product.price || 0).toLocaleString("vi-VN")} ₫
            </span>
            {product.originalPrice && !isNaN(product.originalPrice) && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {Number(product.originalPrice).toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
