"use client";

import { useAppStore } from "@/store/useAppStore";
import { PRODUCTS_DATA } from "@/data/productsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import ProductCard from "@/components/ProductCard";
import ShopHero from "@/components/ShopHero";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid, Heart, Flame, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function ShopPage() {
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
  } = useAppStore();

  const categories = [
    { id: "all", label: t("all") },
    { id: "outerwear", label: "Outerwear" },
    { id: "tops", label: "Tops & Hoodies" },
    { id: "bottoms", label: "Bottoms & Utility" },
    { id: "sets", label: "Co-Ord Sets" },
    { id: "accessories", label: "Accessories" },
    { id: "wishlist", label: `${t("wishlist")} (${wishlist.length})`, isWishlist: true },
  ];

  // Filter & Sort Products logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
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

  // Determine grid column class
  const gridClass =
    viewMode === "grid-2"
      ? "grid-cols-1 sm:grid-cols-2"
      : viewMode === "grid-3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner Hero */}
        <ShopHero />

        {/* Catalog Control Header */}
        <div id="catalog" className="scroll-mt-24 space-y-6 mb-8">

          {/* Category Pills Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${selectedCategory === cat.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
              >
                {cat.isWishlist && <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search, Sort, View Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Layout Toggles */}
            <div className="flex items-center gap-3">

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-white dark:bg-zinc-900">{t("featured")}</option>
                  <option value="newest" className="bg-white dark:bg-zinc-900">{t("newest")}</option>
                  <option value="price-low" className="bg-white dark:bg-zinc-900">{t("priceLow")}</option>
                  <option value="price-high" className="bg-white dark:bg-zinc-900">{t("priceHigh")}</option>
                </select>
              </div>

              {/* View Layout Switcher (2, 3, 4 cols) */}
              <div className="hidden md:flex items-center bg-gray-50 dark:bg-zinc-800 p-1 rounded-xl border border-gray-200 dark:border-zinc-700">
                <button
                  onClick={() => setViewMode("grid-2")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid-2" ? "bg-white dark:bg-zinc-700 shadow" : "text-gray-400"}`}
                  title="2 Columns"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid-3")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid-3" ? "bg-white dark:bg-zinc-700 shadow" : "text-gray-400"}`}
                  title="3 Columns"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid-4")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid-4" ? "bg-white dark:bg-zinc-700 shadow" : "text-gray-400"}`}
                  title="4 Columns"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Filter Status Bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
            <span>
              {t("showing")} <strong className="text-gray-900 dark:text-white">{filteredProducts.length}</strong> {t("outfits")}
            </span>

            {(selectedCategory !== "all" || searchQuery !== "") && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-red-500 hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" /> {t("resetFilters")}
              </button>
            )}
          </div>

        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid ${gridClass} gap-6`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 text-center p-6">
            <Search className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t("noProducts")}</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
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
