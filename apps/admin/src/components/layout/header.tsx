"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Bell, Search, Terminal, Menu, ShieldAlert, Sun, Moon } from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { Badge } from "@juice-vibe/ui";
import { useTheme } from "@/app/theme-provider";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
  onOpenCommandPalette: () => void;
  onToggleAiPanel: () => void;
  aiPanelOpen: boolean;
  notificationCount: number;
  onOpenNotifications: () => void;
}

export function Header({
  sidebarCollapsed,
  onMenuClick,
  onOpenCommandPalette,
  onToggleAiPanel,
  aiPanelOpen,
  notificationCount,
  onOpenNotifications,
}: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Simple breadcrumbs map
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Home", href: "/" }];

    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      // Title-ize path segment
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      if (seg === "dashboard") label = "Mission Control";
      if (seg === "orders") label = "Order Desk";
      if (seg === "menu") label = "Menu Catalog";
      if (seg === "customers") label = "CRM Customers";
      if (seg === "inventory") label = "Inventory Log";
      if (seg === "employees") label = "Staff Roster";
      if (seg === "settings") label = "System Settings";
      return { label, href };
    });
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground/60">SYSTEM:</span>
          {crumbs.map((crumb, idx) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-muted-foreground/40 font-sans">/</span>}
              <span
                className={cn(
                  idx === crumbs.length - 1 ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground transition-colors"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-dark border border-border text-[11px] font-mono text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick command...</span>
          <kbd className="bg-card px-1.5 py-0.5 rounded border border-border text-[9px] font-sans">Ctrl+K</kbd>
        </button>

        {/* Notifications badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-ink-dark/60 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-ink-dark/60 rounded-lg transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Floating AI Panel button */}
        <button
          onClick={onToggleAiPanel}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer font-heading",
            aiPanelOpen
              ? "bg-primary text-ink-dark border-primary hover:bg-primary-dark"
              : "bg-ink-dark text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          )}
        >
          <Sparkles className={cn("h-3.5 w-3.5", aiPanelOpen ? "text-ink-dark" : "text-primary animate-pulse")} />
          <span className="hidden sm:inline">AI Insights</span>
        </button>
      </div>
    </header>
  );
}
