"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import ProductCard from "@/components/ProductCard";
import OutfitSwiper from "@/components/OutfitSwiper";
import { useAppStore } from "@/store/useAppStore";
import { ArrowRight, Flame, Sparkles, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function LandingPage() {
  const { t } = useTranslation('landing');
  const { t: tShop } = useTranslation('shop');
  const products = useAppStore(state => state.products);
  const setSelectedCategory = useAppStore(state => state.setSelectedCategory);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Minimalist Monochrome Background */}
        <div className="absolute inset-0 z-0">
           {/* Grayscale image for a subtle, high-fashion editorial texture */}
           <img 
             src="https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=2070&auto=format&fit=crop"
             alt="Youthful Streetwear Fashion"
             className="w-full h-full object-cover object-top grayscale opacity-30 dark:opacity-20 scale-105 transform hover:scale-110 transition-transform duration-[20s]"
           />
           {/* Very soft gradient overlay matching the page background */}
           <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50 dark:from-black/80 dark:via-black/50 dark:to-black" />
        </div>

        {/* Subtle Ambient Light (No bright colors) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-black/5 dark:bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center pt-24 pb-28 px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-5xl sm:text-7xl lg:text-[8rem] font-black tracking-tighter uppercase leading-[0.9] text-gray-900 dark:text-white">
            {t("engineered")} <br />
            <span className="text-transparent [-webkit-text-stroke:1px_#111] sm:[-webkit-text-stroke:2px_#111] dark:[-webkit-text-stroke:1px_#fff] dark:sm:[-webkit-text-stroke:2px_#fff] italic tracking-tight uppercase">
              {t("nextGen")}
            </span>
          </h1>

          <div className="flex items-center justify-center pt-16">
            <Link
              href="/shop"
              className="group flex items-center gap-4 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white hover:opacity-60 transition-all duration-300"
            >
              <span>{t("exploreShop")}</span>
              <div className="relative flex items-center">
                <div className="w-12 h-[1.5px] bg-gray-900 dark:bg-white group-hover:w-24 transition-all duration-500 ease-out" />
                <div className="absolute right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-gray-900 dark:border-white rotate-45 transform translate-x-[1px]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">{t("curatedCollections")}</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">
              {t("shopByCategory")}
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-gray-900 dark:text-white hover:underline flex items-center gap-1 mt-2 md:mt-0">
            {t("viewAllCategories")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: tShop("catMenswear") || "Đồ Nam",
              img: "/donam.jpg",
              cat: "đồ nam",
            },
            {
              title: tShop("catWomenswear") || "Đồ Nữ",
              img: "/donu.jpg",
              cat: "đồ nữ",
            },
            {
              title: tShop("catCoupleswear") || "Đồ Đôi",
              img: "/dodoi.jpg",
              cat: "đồ đôi",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href="/shop"
              onClick={() => setSelectedCategory(item.cat)}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-zinc-800"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TINDER OUTFIT SWIPER TEASER MODULE */}
      <section id="swiper-section" className="py-20 bg-gray-50/50 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              {t("tinderStyle")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300">
                {t("outfitSwiper")}
              </span>
            </h2>


          </div>

          {/* Interactive Card Swiper Demo */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <OutfitSwiper />
            </div>
          </div>

        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">{t("popularRightNow")}</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">
              {t("trendingOutfits")}
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-gray-900 dark:text-white hover:underline flex items-center gap-1">
            {t("viewAllStore")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <ProductQuickViewModal />
    </div>
  );
}
