"use client";

import Link from "next/link";
import { Sparkles, Flame } from "lucide-react";

export default function ShopHero() {
  return (
    <div className="relative w-full overflow-hidden bg-gray-950 dark:bg-zinc-900 text-white dark:text-white border-b border-gray-900 dark:border-zinc-800 shadow-xl">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent dark:from-black/40 dark:to-transparent z-0" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 dark:bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Inner centered container - same max-w as main content below */}
      <div className="relative z-10 max-w-7xl mx-auto px-20 sm:px-28 py-7 flex flex-row items-center justify-between gap-4">
        {/* Left: Badge + Title (stacked vertically) */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-full text-[10px] font-semibold text-gray-200 dark:text-gray-300 tracking-widest uppercase border border-white/10 dark:border-white/10 w-fit">
            <Sparkles className="w-3 h-3" /> BỘ SƯU TẬP TƯƠNG LAI
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-white leading-tight">
            <span className="font-bold">Cửa Hàng</span>{" "}
            <span className="font-light text-gray-400 dark:text-gray-400">OcevStudio</span>
          </h1>
        </div>

        {/* Right: CTA Button */}
        <div className="shrink-0">
          <Link
            href="/#swiper-section"
            className="group px-6 py-3 bg-white text-black dark:bg-white dark:text-black font-extrabold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-100 transition-all flex items-center gap-2 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 group-hover:animate-pulse" /> Thử Phối Đồ Nhanh
          </Link>
        </div>
      </div>
    </div>
  );
}
