"use client";

import Link from "next/link";
import { Sparkles, Flame, ArrowRight } from "lucide-react";

export default function ShopHero() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white p-8 sm:p-12 border border-zinc-800 shadow-2xl mb-12">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-400 mb-4 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" /> NEW SEASON DROP 2026
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mb-4 uppercase">
          CYBER MINIMALISM <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
            COLLECTION
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
          Discover high-density heavyweight street apparel, tactical utility trousers, and minimalist tailored silhouettes designed for the modern fashion vanguard.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/swipe"
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-orange-500/25"
          >
            <Flame className="w-4 h-4 fill-white" /> Try Outfit Matcher Swiper
          </Link>

          <a
            href="#catalog"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md transition-colors flex items-center gap-2 border border-white/10"
          >
            Browse All Items <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
