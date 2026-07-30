"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-950 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-900 pt-16 pb-12 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Promises */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-200 dark:border-zinc-900 text-center md:text-left transition-colors">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Express Global Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Free standard shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">30-Day Hassle Free Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">Seamless exchange & instant store credit</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Authentic Craftsmanship</h4>
              <p className="text-xs text-gray-500 mt-0.5">100% certified organic & sustainable fabrics</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Col 1 & 2: Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-widest text-gray-900 dark:text-white uppercase transition-colors">
                OCEV<span className="text-gray-400 dark:text-gray-500 font-light">STUDIO</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm transition-colors">
              Engineering the next era of high-street aesthetic fashion. Blending minimalist cyber architecture with organic comfort for everyday visionaries.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 transition-colors">Join the Inner Circle</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-black dark:focus:border-white w-full transition-colors"
                />
                <button
                  type="submit"
                  className="bg-black text-white dark:bg-white dark:text-black p-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/shop?category=outerwear" className="hover:text-black dark:hover:text-white transition-colors">Outerwear & Jackets</Link></li>
              <li><Link href="/shop?category=tops" className="hover:text-black dark:hover:text-white transition-colors">Hoodies & Tees</Link></li>
              <li><Link href="/shop?category=bottoms" className="hover:text-black dark:hover:text-white transition-colors">Utility Pants & Denim</Link></li>
              <li><Link href="/shop?category=sets" className="hover:text-black dark:hover:text-white transition-colors">Co-Ord Sets & Dresses</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-black dark:hover:text-white transition-colors">Bags & Accessories</Link></li>
            </ul>
          </div>

          {/* Col 4: Experience */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Experience</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/swipe" className="hover:text-black dark:hover:text-white transition-colors font-medium text-amber-500 dark:text-amber-400">🔥 Tinder Outfit Matcher</Link></li>
              <li><Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Digital Lookbook 2026</Link></li>
              <li><Link href="/login" className="hover:text-black dark:hover:text-white transition-colors">Member Account</Link></li>
              <li><Link href="/register" className="hover:text-black dark:hover:text-white transition-colors">Size Personalization</Link></li>
            </ul>
          </div>

          {/* Col 5: Social & Help */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Connect</h5>
            <div className="flex gap-3 mb-6">
              <a href="#" className="p-2.5 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" title="Global Store">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" title="Community Chat">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" title="Share Outfit">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-gray-500">Support 24/7:</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5 transition-colors">care@ocevstudio.com</p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 transition-colors">
          <p>© 2026 OCEV STUDIO Inc. All rights reserved.</p>
          <div className="flex gap-6 text-[11px]">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Shipping Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
