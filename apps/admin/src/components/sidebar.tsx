"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Image as ImageIcon,
  Tag,
  Mail,
  Settings,
  LogOut,
  Star,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@juice-vibe/services";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/menu", label: "Menu", icon: ShoppingBag },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/testimonials", label: "Testimonials", icon: Star },
  { href: "/coupons", label: "Coupons", icon: Tag },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="h-full w-full bg-sidebar flex flex-col overflow-hidden rounded-2xl border border-white/5 shadow-2xl relative">
      {/* Decorative background blur */}
      <div className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] bg-primary/10 rounded-full blur-[40px] pointer-events-none" />

      {/* Logo */}
      <div className="p-6 pb-6 border-b border-white/10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-350">
            <span className="text-sm font-black text-white tracking-wider font-display">JV</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white font-display group-hover:text-primary-light transition-colors">Juice Vibe</h1>
            <p className="text-[9px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#8FA695" }}>
              Admin Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/15"
                  : "text-[#B7C4BB] hover:bg-white/5 hover:text-white"
              }`}
            >
              {/* Inner active glow effect */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-orange" />
              )}
              
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 duration-200 ${isActive ? "text-white" : "text-[#8FA695] group-hover:text-white"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <button 
          onClick={handleSignOut} 
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#B7C4BB] hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full cursor-pointer group"
        >
          <LogOut className="w-4 h-4 text-[#8FA695] group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
