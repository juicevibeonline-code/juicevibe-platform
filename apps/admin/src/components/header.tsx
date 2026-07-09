"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { CommandPalette } from "@/components/ui/command-palette";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <header className="sticky top-4 mx-4 md:mx-8 z-40 bg-white/70 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl mb-8 transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3 w-full max-w-md">
          {/* Mobile Menu Toggle (Placeholder for now, logic to be added if needed) */}
          <button className="md:hidden p-2 bg-white/50 rounded-lg text-gray-600 hover:bg-white hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          
          {/* Search / Command Palette */}
          <div className="relative w-full group">
            <CommandPalette />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-border shadow-lg py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
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
                        "px-4 py-3 hover:bg-gray-50 border-b border-border last:border-0 cursor-pointer transition-colors",
                        n.unread && "bg-primary/5"
                      )}
                    >
                      <p className={cn("text-sm font-medium", n.unread && "font-bold")}>{n.title}</p>
                      <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                      <p className="text-xs text-muted mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border">
                  <button className="text-sm text-primary hover:underline w-full text-left">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-dark">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted">admin@juicevibe.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-medium">Admin</p>
                  <p className="text-xs text-muted">admin@juicevibe.com</p>
                </div>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <hr className="my-2 border-border" />
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-pink hover:bg-pink/5 w-full">
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
