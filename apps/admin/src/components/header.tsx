"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronDown, LogOut, User, Settings, Sun, Moon } from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { CommandPalette } from "@/components/ui/command-palette";
import { useTheme } from "next-themes";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
          <button className="md:hidden p-2 bg-white/50 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          
          {/* Search / Command Palette */}
          <div className="relative w-full group">
            <CommandPalette />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
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
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111813] rounded-xl border border-border dark:border-white/10 shadow-lg py-2 animate-slide-down z-50">
                <div className="px-4 py-3 border-b border-border dark:border-white/10 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <button className="text-sm text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    { title: "New order received", desc: "Order #JV-001 from Priya Sharma", time: "2 min ago", unread: true },
                    { title: "Low stock alert", desc: "Mango Smoothie is running low", time: "1 hour ago", unread: true },
                    { title: "Customer message", desc: "Sarah Johnson sent a message", time: "3 hours ago", unread: false },
                  ].map((n, i) => (
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
              className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-dark">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground leading-none">Admin</p>
                <p className="text-xs text-muted mt-1 leading-none">admin@juicevibe.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111813] rounded-xl border border-border dark:border-white/10 shadow-lg py-2 animate-slide-down z-50">
                <div className="px-4 py-3 border-b border-border dark:border-white/10">
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted">admin@juicevibe.com</p>
                </div>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <hr className="my-2 border-border dark:border-white/10" />
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-pink hover:bg-pink/5 w-full cursor-pointer">
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

function Link({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={href} className={className} {...props}>{children}</a>;
}
