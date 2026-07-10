"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, User, Settings, Sun, Moon, Menu } from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { CommandPalette } from "@/components/ui/command-palette";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/menu": "Menu",
  "/orders": "Orders",
  "/customers": "Customers",
  "/gallery": "Gallery",
  "/blog": "Blog",
  "/testimonials": "Testimonials",
  "/coupons": "Coupons",
  "/messages": "Messages",
  "/settings": "Settings",
};

const notifications = [
  { title: "New order received", desc: "Order #JV-001 from Priya Sharma", time: "2 min ago", unread: true },
  { title: "Low stock alert", desc: "Mango Smoothie is running low", time: "1 hour ago", unread: true },
  { title: "Customer message", desc: "Sarah Johnson sent a message", time: "3 hours ago", unread: false },
];

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Get the current page title from the path
  const currentPage =
    Object.entries(pageTitles).find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] ?? "Dashboard";

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-4 mx-4 md:mx-8 z-40 bg-white/70 dark:bg-[#111813]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl mb-8 transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3 w-full max-w-md">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuClick}
            className="md:hidden p-2 bg-white/50 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white hover:text-primary transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Breadcrumb — desktop only */}
          <span className="hidden md:block text-sm font-semibold text-muted shrink-0">
            {currentPage}
          </span>
          <span className="hidden md:block text-muted/40 shrink-0">/</span>

          {/* Search / Command Palette */}
          <div className="relative w-full group">
            <CommandPalette />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 ml-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-muted hover:text-foreground transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <span className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500 animate-fade-in" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 animate-fade-in" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111813] rounded-xl border border-border dark:border-white/10 shadow-lg py-2 animate-slide-down z-50">
                <div className="px-4 py-3 border-b border-border dark:border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <button className="text-sm text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-border/50 dark:border-white/5 last:border-0 cursor-pointer transition-colors",
                        n.unread && "bg-primary/5 dark:bg-primary/10"
                      )}
                    >
                      <p className={cn("text-sm font-medium text-foreground", n.unread && "font-bold")}>{n.title}</p>
                      <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                      <p className="text-xs text-muted mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border dark:border-white/10">
                  <button className="text-sm text-primary hover:underline w-full text-left">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
                <span className="text-xs font-black text-white tracking-wider">JV</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-foreground leading-none">Admin</p>
                <p className="text-xs text-muted mt-0.5 leading-none">admin@juicevibe.com</p>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted transition-transform duration-200", userMenuOpen && "rotate-180")} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111813] rounded-xl border border-border dark:border-white/10 shadow-lg py-2 animate-slide-down z-50">
                <div className="px-4 py-3 border-b border-border dark:border-white/10">
                  <p className="font-semibold text-foreground text-sm">Admin</p>
                  <p className="text-xs text-muted mt-0.5">admin@juicevibe.com</p>
                </div>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <hr className="my-1 border-border dark:border-white/10" />
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-pink hover:bg-pink/5 w-full cursor-pointer transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
