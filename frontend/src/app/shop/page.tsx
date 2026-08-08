"use client";

import { useAppStore } from "@/store/useAppStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import ProductCard from "@/components/ProductCard";
import ShopHero from "@/components/ShopHero";
import { useState, useMemo, useEffect, Suspense } from "react";
import { Search, SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid, Heart, Flame, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import LookbookView from "@/components/LookbookView";

function ShopContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const { t } = useTranslation('shop');
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    wishlist,
    products,
    isLoadingProducts,
  } = useAppStore();

  const categories = [
    { id: "all", label: t("all") },
    { id: "streetwear", label: t("catStreetwear") },
    { id: "cyberpunk", label: t("catCyberpunk") },
    { id: "minimalist", label: t("catMinimalist") },
    { id: "techwear", label: t("catTechwear") },
    { id: "wishlist", label: `${t("wishlist")} (${wishlist.length})`, isWishlist: true },
  ];

  useEffect(() => {
    if (filterParam === "wishlist") {
      setSelectedCategory("wishlist");
    }
  }, [filterParam, setSelectedCategory]);

  // Filter & Sort Products logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory === "wishlist") {
        if (!wishlist.includes(product.id)) return false;
      } else if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.badge === "NEW" ? 1 : -1;
      return 0; // featured
    });
  }, [selectedCategory, searchQuery, sortBy, wishlist]);

  // Determine grid column class - fewer columns for larger, more premium cards
  const gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      {/* Banner Hero - Full Width */}
      <ShopHero />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 py-8 w-full">

        {/* Catalog Control Header */}
        <div id="catalog" className="scroll-mt-24 space-y-5 mb-8">

          <div className="flex flex-col gap-6 pb-6 border-b border-gray-100 dark:border-zinc-900">
            {/* Category Pills */}
            <div className="flex items-center justify-start overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${selectedCategory === cat.id
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]"
                      : "bg-transparent text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  {cat.isWishlist && <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Controls (Search & Sort & View Toggle) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
              {/* Left Side: Search */}
              <div className="relative group w-full flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 rounded-full text-xs text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-zinc-800 focus:border-gray-300 dark:focus:border-zinc-700 transition-all w-full shadow-sm"
                />
              </div>

              {/* Right Side: View Toggle & Sort */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto lg:justify-end">
                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm">
                <button
                  onClick={() => setViewMode("grid-2")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase ${
                    viewMode.startsWith("grid") ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Grid View
                </button>
                <div className="w-10 h-5 bg-gray-300 dark:bg-zinc-600 rounded-full relative cursor-pointer" onClick={() => setViewMode(viewMode === "lookbook" ? "grid-2" : "lookbook")}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${viewMode === "lookbook" ? "translate-x-5" : ""}`} />
                </div>
                <button
                  onClick={() => setViewMode("lookbook")}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase ${
                    viewMode === "lookbook" ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Lookbook View
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-zinc-900 text-xs font-semibold text-gray-600 dark:text-gray-300 rounded-full px-4 py-2.5 outline-none cursor-pointer border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 focus:ring-0 shadow-sm w-40 sm:w-48"
                >
                  <option value="featured" className="bg-white dark:bg-zinc-900">{t("featured")}</option>
                  <option value="newest" className="bg-white dark:bg-zinc-900">{t("newest")}</option>
                  <option value="price-low" className="bg-white dark:bg-zinc-900">{t("priceLow")}</option>
                  <option value="price-high" className="bg-white dark:bg-zinc-900">{t("priceHigh")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

          {(selectedCategory !== "all" || searchQuery !== "") && (
            <div className="flex justify-between items-center text-xs text-gray-500 font-medium px-2">
              <span>
                {t("showing")} <strong className="text-gray-900 dark:text-white">{filteredProducts.length}</strong> {t("outfits")}
              </span>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-red-500 hover:underline flex items-center gap-1 font-bold"
              >
                {t("clearAllFilters")}
              </button>
            </div>
          )}
        </div>

        {/* Products Grid / Lookbook / Loading State */}
        {isLoadingProducts ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          viewMode === "lookbook" ? (
             <LookbookView outfit={filteredProducts.find(p => p.bundleItems && p.bundleItems.length > 0) || filteredProducts[0]} />
          ) : (
            <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 p-6">
            <Search className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t("noProducts")}</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6 mx-auto">
              {t("noProductsDesc")}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-bold text-xs rounded-full hover:scale-105 transition-transform"
            >
              {t("clearAllFilters")}
            </button>
          </div>
        )}

      </main>

      <Footer />
      <CartDrawer />
      <ProductQuickViewModal />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
