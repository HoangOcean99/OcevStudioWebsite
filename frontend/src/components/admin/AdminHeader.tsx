"use client";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export default function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-gray-500 hover:text-black dark:hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        {/* Search */}
        <div className="relative w-48 sm:w-64 md:w-96 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 transition-colors"
        >
          <Sun className="w-4 h-4 hidden dark:block" />
          <Moon className="w-4 h-4 block dark:hidden" />
        </button>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1 sm:mx-2 hidden sm:block"></div>
        {user && (
          <div className="flex items-center gap-3 ml-2 sm:ml-0">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-[10px] font-semibold text-blue-500 uppercase">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-800">
              <Image src={user.avatar} alt={user.name} width={32} height={32} className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
