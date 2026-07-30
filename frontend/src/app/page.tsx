"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import ProductCard from "@/components/ProductCard";
import OutfitSwiper from "@/components/OutfitSwiper";
import { PRODUCTS_DATA } from "@/data/productsData";
import { ArrowRight, Flame, Sparkles, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function LandingPage() {
  const { t } = useTranslation('landing');
  const featuredProducts = PRODUCTS_DATA.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-500/20 via-purple-500/10 to-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-bold tracking-widest text-amber-500 dark:text-amber-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> {t("redefining")}
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight uppercase leading-[1.05]">
            {t("engineered")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 dark:from-white dark:via-gray-300 dark:to-gray-600">
              {t("nextGen")}
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl text-sm"
            >
              {t("exploreShop")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/swipe"
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-black dark:bg-zinc-900 dark:text-white font-extrabold rounded-2xl hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> {t("swipeMatcher")}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Outerwear",
              desc: "Leather & Tech Flight Jackets",
              img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
              cat: "outerwear",
            },
            {
              title: "Heavy Tops",
              desc: "450gsm Hoodies & Acid Washed Tees",
              img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
              cat: "tops",
            },
            {
              title: "Utility Bottoms",
              desc: "Tactical Cargoes & Tailored Pants",
              img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
              cat: "bottoms",
            },
            {
              title: "Co-Ord Sets",
              desc: "Sculpted Blazer & Maxi Sets",
              img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
              cat: "sets",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${item.cat}`}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-zinc-800"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold uppercase">{item.title}</h3>
                <p className="text-xs text-gray-300 mt-1">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  {t("explore")} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TINDER OUTFIT SWIPER TEASER MODULE */}
      <section className="py-20 bg-gray-50/50 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-extrabold">
              <Flame className="w-4 h-4 fill-current" /> {t("interactiveShopping")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              {t("tinderStyle")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 dark:from-orange-400 dark:to-amber-300">
                {t("outfitSwiper")}
              </span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("swiperDesc")}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 mb-2" />
                <h4 className="font-bold text-xs uppercase text-gray-900 dark:text-white">{t("swipeRight")}</h4>
                <p className="text-[11px] text-gray-500">{t("swipeRightDesc")}</p>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mb-2" />
                <h4 className="font-bold text-xs uppercase text-gray-900 dark:text-white">{t("cardStack")}</h4>
                <p className="text-[11px] text-gray-500">{t("cardStackDesc")}</p>
              </div>
            </div>

            <Link
              href="/swipe"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-2xl text-xs hover:scale-105 transition-transform"
            >
              {t("openFullscreen")} <ArrowRight className="w-4 h-4" />
            </Link>
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
