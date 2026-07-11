"use client";

import Link from "next/link";
import { cn } from "@juice-vibe/utils";
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
    <aside className="h-full w-full bg-sidebar flex flex-col overflow-hidden rounded-xl border border-border shadow-sm relative">
      {/* Logo Section */}
      <div className="p-6 border-b border-border relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200">
            <span className="text-xs font-bold text-primary-foreground">JV</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-sidebar-foreground-hover transition-colors">Juice Vibe</h1>
            <p className="text-[10px] font-medium tracking-wider uppercase text-muted">
              Admin Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar relative z-10 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <span className="text-[10px] font-semibold text-muted tracking-wider block px-2 uppercase">
              {group.title}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative",
                      isActive
                        ? "bg-sidebar-hover text-sidebar-foreground-hover font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground-hover"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                    )}
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-sidebar-foreground-hover" : "text-muted group-hover:text-sidebar-foreground-hover")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Info & Sign Out Footer */}
      <div className="p-4 border-t border-border relative z-10 shrink-0 bg-sidebar">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground-hover leading-none truncate">Admin</p>
              <p className="text-[10px] text-muted mt-1 leading-none truncate">admin@juicevibe.com</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut} 
            className="p-2 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
