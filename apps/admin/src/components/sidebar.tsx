"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const navigationGroups = [
  {
    title: "MAIN",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/orders", label: "Orders", icon: ClipboardList },
      { href: "/menu", label: "Menu", icon: ShoppingBag },
      { href: "/customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { href: "/blog", label: "Blog", icon: FileText },
      { href: "/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/testimonials", label: "Testimonials", icon: Star },
      { href: "/coupons", label: "Coupons", icon: Tag },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/messages", label: "Messages", icon: Mail },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
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
    <aside className="h-full w-full bg-sidebar flex flex-col overflow-hidden rounded-2xl border border-border/10 shadow-xl relative">
      {/* Subtle top background ambient green glow */}
      <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-primary/10 rounded-full blur-[30px] pointer-events-none" />

      {/* Logo Section */}
      <div className="p-5 pb-5 border-b border-border/10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center shrink-0 shadow-md shadow-primary/20 group-hover:scale-[1.03] transition-transform duration-200">
            <span className="text-xs font-black text-white tracking-wider font-display">JV</span>
          </div>
          <div>
            <h1 className="text-xs font-extrabold tracking-tight text-[#f8fafc] font-display group-hover:text-primary transition-colors">Juice Vibe</h1>
            <p className="text-[8px] font-bold tracking-widest uppercase mt-0.5 text-slate-400">
              Admin Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 overflow-y-auto custom-scrollbar relative z-10 space-y-5">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <span className="text-[9px] font-extrabold text-slate-500 tracking-wider block px-3.5 uppercase">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all group overflow-hidden ${
                      isActive
                        ? "bg-primary/20 text-[#10b981] border border-primary/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Info & Sign Out Footer */}
      <div className="p-4 border-t border-border/10 relative z-10 shrink-0 bg-slate-950/20">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <span className="text-[10px] font-bold text-[#10b981] tracking-wider font-display">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 leading-none truncate">Admin</p>
              <p className="text-[9px] text-slate-400 mt-1 leading-none font-data truncate">admin@juicevibe.com</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
