"use client";

import Link from "next/link";
import { ShoppingBag, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F3F4F6] dark:bg-[#121212] text-gray-600 dark:text-gray-400 border-t border-gray-200/50 dark:border-zinc-900 py-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">

          {/* Brand Info */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-widest text-gray-900 dark:text-white uppercase transition-colors">
                OCEV<span className="text-gray-400 dark:text-gray-500 font-light">STUDIO</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm transition-colors">
              Engineering the next era of high-street aesthetic fashion.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center text-center">
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Khám phá</h5>
            <ul className="space-y-2.5 text-xs flex flex-col items-center">
              <li><Link href="/" className="hover:text-black dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400">Trang chủ</Link></li>
              <li><Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400">Cửa hàng</Link></li>
              <li><Link href="/studio" className="hover:text-black dark:hover:text-white transition-colors text-gray-500 dark:text-gray-400">Phòng thử đồ</Link></li>
            </ul>
          </div>

          {/* Social & Help */}
          <div className="flex flex-col items-center text-center">
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Kết nối</h5>
            <div className="flex gap-3 mb-4 justify-center">
              <a href="https://www.facebook.com/profile.php?id=61592672079788" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-500 transition-colors" title="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/ocev_studio/?hl=en" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-500 transition-colors" title="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@ocean_reviewww" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors" title="TikTok">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-orange-500 dark:hover:text-orange-400 transition-colors" title="Shopee">
                <ShoppingBag className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">care@ocevstudio.com</p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-900 pt-6 flex flex-col items-center justify-center text-[11px] text-gray-400 transition-colors">
          <p>© 2026 OCEV STUDIO. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
