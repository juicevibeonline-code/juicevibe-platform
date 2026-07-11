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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
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

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between pl-3 pr-2 h-10 rounded-md bg-muted-background border border-border hover:border-ring text-sm transition-all duration-200 select-none shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2 text-muted">
          <Search className="w-3.5 h-3.5 text-muted" />
          <span>Search or command...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted shadow-sm font-mono">
          <Command className="w-2.5 h-2.5" /> K
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
              className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted py-2 text-sm"
                  autoFocus
                />
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-muted-background text-muted">
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
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left w-full group",
                          selectedIndex === i ? "bg-muted-background text-foreground" : "hover:bg-muted-background text-muted"
                        )}
                      >
                        <span className={cn("w-5 h-5", selectedIndex === i ? "text-foreground" : "text-muted")}>
                          {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
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
