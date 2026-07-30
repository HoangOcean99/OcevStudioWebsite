"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OutfitSwiper from "@/components/OutfitSwiper";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import { Flame, Sparkles, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function SwipePage() {
  const { t } = useTranslation('swipe');
  const { cart, toggleCart } = useAppStore();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 w-full relative">
        
        {/* Header Title Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-500 rounded-full text-xs font-extrabold border border-orange-500/20">
            <Flame className="w-4 h-4 fill-orange-500" /> TINDER OUTFIT MATCHER
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Swiper Module */}
        <div className="w-full max-w-md">
          <OutfitSwiper />
        </div>

        {/* Floating Quick Action Footer */}
        <div className="mt-8 flex items-center justify-between gap-4 w-full max-w-md bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("goToShop")}
          </Link>

          <button
            onClick={toggleCart}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> {t("cart")} ({totalCartItems})
          </button>
        </div>

      </main>

      <Footer />
      <CartDrawer />
      <ProductQuickViewModal />
    </div>
  );
}
