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
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800/80 hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/shop/${product.id}`} className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-zinc-800 overflow-hidden cursor-pointer block">

        {/* Main Image */}
        <Image
          src={getValidImageUrl((isHovered && product.secondaryImageUrl) ? product.secondaryImageUrl : product.imageUrl)}
          alt={product.name || "Product"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge Pill */}
        {product.badge && (
          <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-extrabold tracking-widest rounded-full text-white shadow-md uppercase backdrop-blur-md ${product.badge === 'HOT' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
              product.badge === 'NEW' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                product.badge === 'SALE' ? 'bg-gradient-to-r from-emerald-500 to-teal-700' :
                  'bg-black/80 dark:bg-white/80 dark:text-black'
            }`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-700 dark:text-white hover:scale-110 active:scale-95 transition-all shadow-lg z-10"
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-black dark:text-white text-xs font-bold rounded-2xl shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> {t("viewDetails")}
          </div>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-semibold">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-gray-700 dark:text-gray-300 font-bold text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            href={`/shop/${product.id}`}
            className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors block mt-1"
          >
            {product.name}
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-gray-900 dark:text-white">
              ${(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && !isNaN(product.originalPrice) && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Removed Quick Add interface per user request */}      </div>
    </div>
  );
}
