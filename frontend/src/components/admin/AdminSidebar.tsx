"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const links = [
    { name: "Tổng quan", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Sản phẩm", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
    { name: "Đơn hàng", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Khách hàng", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Cài đặt", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 h-screen flex flex-col transition-colors sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-widest text-gray-900 dark:text-white uppercase leading-none">
            OCEV<span className="text-gray-400 font-light">ADMIN</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          &larr; Về Cửa hàng
        </Link>
      </div>
    </aside>
  );
}
