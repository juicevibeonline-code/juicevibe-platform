"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Image,
  MessageSquare,
  Tag,
  Mail,
  Settings,
  LogOut,
  Star,
  Leaf,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/menu", label: "Menu", icon: ShoppingBag },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/testimonials", label: "Testimonials", icon: Star },
  { href: "/coupons", label: "Coupons", icon: Tag },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-full bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] flex flex-col overflow-hidden animate-slide-in">
      {/* Logo */}
      <div className="p-6 pb-4 mb-2">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-transform duration-300">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 group-hover:text-primary transition-colors">Juice Vibe</h1>
            <p className="text-xs font-bold text-gray-400">Admin Workspace</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] translate-x-1"
                  : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-gray-100 bg-white/40">
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-pink hover:bg-pink hover:text-white transition-all duration-300 w-full group shadow-sm bg-white hover:shadow-md">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
