"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Monitor, Moon, Sun, LayoutDashboard, ShoppingBag, ClipboardList,
  Users, ImageIcon, FileText, Star, Tag, Mail, Settings, X, Command
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@juice-vibe/utils";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const { setTheme } = useTheme();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Prevent background scroll
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const items = [
    { label: "Dashboard", icon: <LayoutDashboard />, action: () => router.push("/dashboard"), category: "Navigation" },
    { label: "Menu", icon: <ShoppingBag />, action: () => router.push("/menu"), category: "Navigation" },
    { label: "Orders", icon: <ClipboardList />, action: () => router.push("/orders"), category: "Navigation" },
    { label: "Customers", icon: <Users />, action: () => router.push("/customers"), category: "Navigation" },
    { label: "Gallery", icon: <ImageIcon />, action: () => router.push("/gallery"), category: "Navigation" },
    { label: "Blog", icon: <FileText />, action: () => router.push("/blog"), category: "Navigation" },
    { label: "Testimonials", icon: <Star />, action: () => router.push("/testimonials"), category: "Navigation" },
    { label: "Coupons", icon: <Tag />, action: () => router.push("/coupons"), category: "Navigation" },
    { label: "Messages", icon: <Mail />, action: () => router.push("/messages"), category: "Navigation" },
    { label: "Settings", icon: <Settings />, action: () => router.push("/settings"), category: "Navigation" },
    { label: "Light Theme", icon: <Sun />, action: () => setTheme("light"), category: "Preferences" },
    { label: "Dark Theme", icon: <Moon />, action: () => setTheme("dark"), category: "Preferences" },
    { label: "System Theme", icon: <Monitor />, action: () => setTheme("system"), category: "Preferences" },
  ];

  const filteredItems = search
    ? items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between pl-4 pr-3 py-2 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/10 text-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-muted">
          <Search className="w-4 h-4" />
          <span>Search or command...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-200/50 dark:bg-white/10 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl glass-panel shadow-2xl rounded-2xl overflow-hidden flex flex-col bg-white/90 dark:bg-black/90"
            >
              <div className="flex items-center px-4 py-3 border-b border-border/50">
                <Search className="w-5 h-5 text-primary mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted py-2"
                  autoFocus
                />
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <p>No results found for "{search}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {filteredItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left w-full group"
                      >
                        <span className="text-gray-400 group-hover:text-primary w-5 h-5">
                          {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                        </span>
                        <span className="font-medium text-sm text-foreground">{item.label}</span>
                        <span className="ml-auto text-xs text-muted">{item.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
