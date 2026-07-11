"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, User, Settings, Sun, Moon, Menu, Search } from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { CommandPalette } from "@/components/ui/command-palette";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@juice-vibe/services";

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
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border w-full transition-colors">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuClick}
            className="md:hidden p-2 bg-muted-background rounded-md text-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Breadcrumb */}
          <span className="hidden md:flex items-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase text-muted shrink-0">
            {currentPage}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3.5 ml-3">
          {/* Search / Command Palette */}
          <div className="relative w-48 sm:w-56 group shrink-0">
            <CommandPalette />
          </div>

          <span className="h-4 w-[1px] bg-border hidden sm:block" />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-muted-background text-muted hover:text-foreground transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <span className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-orange transition-transform duration-500 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-500 hover:-rotate-12" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-md hover:bg-muted-background transition-colors cursor-pointer"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg border border-border shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm font-display">Notifications</h3>
                  <button className="text-xs text-primary hover:underline font-bold">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-4 py-3 hover:bg-muted-background transition-colors border-b border-border last:border-0 cursor-pointer",
                        n.unread && "bg-muted-background/50"
                      )}
                    >
                      <p className={cn("text-xs font-semibold text-foreground", n.unread && "font-bold")}>{n.title}</p>
                      <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-muted mt-1 font-mono">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border">
                  <button className="text-xs text-primary hover:underline w-full text-left font-bold">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md hover:bg-muted-background transition-colors cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-primary-foreground tracking-wider">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-foreground leading-none">Admin</p>
                <p className="text-[10px] text-muted mt-0.5 leading-none font-mono">admin@juicevibe.com</p>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted transition-transform duration-200", userMenuOpen && "rotate-180")} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg border border-border shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-foreground text-xs">Admin</p>
                  <p className="text-[10px] text-muted mt-0.5 font-mono">admin@juicevibe.com</p>
                </div>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-xs text-foreground hover:bg-muted-background transition-colors">
                  <Settings className="w-3.5 h-3.5 text-muted" />
                  Settings
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-xs text-foreground hover:bg-muted-background transition-colors">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Profile
                </Link>
                <hr className="my-1 border-border" />
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-danger hover:bg-danger/10 w-full cursor-pointer transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
