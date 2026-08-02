"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ShoppingBag, Heart, Search, User, Flame, LogOut, Sun, Moon, Globe, Bot, Scissors, Menu, X, Shield } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, toggleCart, wishlist, searchQuery, setSearchQuery } = useAppStore();
  const { t } = useTranslation('navbar');
  const { language, toggleLanguage } = useLanguageStore();
  const { theme, setTheme } = useTheme();
  
  const { user, isLoggedIn, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("shopStore"), href: "/shop" },
    { 
      name: t("outfitMatcher"), 
      href: "/swipe", 
      badge: "HOT", 
      icon: <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" /> 
    },
    { 
      name: t("studio") || "Phòng Thử Đồ", 
      href: "/studio", 
      icon: <Scissors className="w-4 h-4 text-purple-500" /> 
    },
    { 
      name: t("aiStylist") || "AI Stylist", 
      href: "/ai-stylist", 
      badge: "NEW", 
      icon: <Bot className="w-4 h-4 text-blue-500" /> 
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Brand Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -ml-2 text-gray-700 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black font-black text-xl flex items-center justify-center rounded-xl tracking-tighter group-hover:scale-105 transition-transform">
              O
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-widest text-gray-900 dark:text-white uppercase leading-none">
                OCEV<span className="text-gray-400 font-light">STUDIO</span>
              </span>
              <span className="text-[9px] font-medium tracking-widest text-gray-400 uppercase">
                Future Fashion
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded-full ${
                    isActive
                      ? "text-black dark:text-white bg-gray-100/50 dark:bg-zinc-800/50"
                      : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  {link.icon}
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-md shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Search, Wishlist, Profile, Cart */}
        <div className="flex items-center gap-3">
          
          {/* Search input toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full px-3 py-1.5 w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t("searchOutfits")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-semibold px-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:block p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors"
            title="Toggle Theme"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors items-center gap-1 font-bold text-xs"
            title="Toggle Language"
          >
            <Globe className="w-5 h-5" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Wishlist Icon */}
          <Link
            href="/shop?filter=wishlist"
            className="hidden sm:flex relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors"
            title="Cart Drawer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold flex items-center justify-center rounded-full">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-zinc-800 hover:border-gray-400 transition-all"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-zinc-700">
                  <Image
                    src={user.avatar || "/default-avatar.svg"}
                    alt={user.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl mb-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  
                  <div className="px-1 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      {t("myProfile")}
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      {t("myOrders")}
                    </Link>
                  </div>
                  
                  {user.role === 'admin' && (
                    <div className="px-1 mt-1 border-t border-gray-100 dark:border-zinc-800 pt-1">
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full p-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Trang Quản Trị
                      </Link>
                    </div>
                  )}
                  
                  <div className="px-1 mt-1 border-t border-gray-100 dark:border-zinc-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              {t("signIn")}
            </Link>
          )}

        </div>
      </div>
    </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-4/5 max-w-sm h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left">
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
              <span className="font-extrabold text-lg tracking-widest text-gray-900 dark:text-white uppercase">
                OCEV<span className="text-gray-400 font-light">STUDIO</span>
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-4 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white" 
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-md shadow-sm ml-auto">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Extra Controls (Theme, Lang, Wishlist) */}
            <div className="mt-auto p-4 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-2">
              <button
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setIsMobileMenuOpen(false); }}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
              >
                <Sun className="w-5 h-5 hidden dark:block" />
                <Moon className="w-5 h-5 block dark:hidden" />
                <span className="text-[10px] font-bold uppercase">Giao diện</span>
              </button>

              <button
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
              >
                <Globe className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">{language}</span>
              </button>

              <Link
                href="/shop?filter=wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 relative"
              >
                <Heart className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Yêu thích</span>
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
