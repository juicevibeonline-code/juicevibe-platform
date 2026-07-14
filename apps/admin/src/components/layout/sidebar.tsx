"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@juice-vibe/services";
import { cn } from "@juice-vibe/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Users,
  Warehouse,
  ChefHat,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Server,
  Leaf,
  QrCode,
  Tag,
  MessageSquare,
  Mail,
  Heart,
  BookOpen
} from "lucide-react";
import { Button } from "@juice-vibe/ui";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const navItems = [
    {
      label: "Mission Control",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Order Desk",
      href: "/dashboard/orders",
      icon: ClipboardList,
    },
    {
      label: "Menu Catalog",
      href: "/dashboard/menu",
      icon: Utensils,
    },
    {
      label: "CRM Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      label: "Inventory Log",
      href: "/dashboard/inventory",
      icon: Warehouse,
    },
    {
      label: "Staff Roster",
      href: "/dashboard/employees",
      icon: ChefHat,
    },
    {
      label: "Tables & QR",
      href: "/dashboard/tables",
      icon: QrCode,
    },
    {
      label: "Coupons",
      href: "/dashboard/coupons",
      icon: Tag,
    },
    {
      label: "Testimonials",
      href: "/dashboard/testimonials",
      icon: Heart,
    },
    {
      label: "Subscribers",
      href: "/dashboard/subscribers",
      icon: Mail,
    },
    {
      label: "Blog Posts",
      href: "/dashboard/blog",
      icon: BookOpen,
    },
    {
      label: "System Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];






  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 relative select-none z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Workspace Switcher */}
      <div className="h-16 flex items-center px-4 border-b border-border gap-3 justify-between overflow-hidden">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-tight">Juice Vibe Bentota</span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Workspace #1</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Leaf className="h-4 w-4" />
          </div>
        )}
        
        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-card border border-border text-muted-foreground hover:text-primary rounded-full p-1 shadow-md cursor-pointer transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative border border-transparent",
                isActive
                  ? "text-primary font-bold text-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-ink-dark/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:scale-105")} />
              {!collapsed && <span className="font-heading">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-14 bg-card border border-border text-foreground text-[10px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-xl font-mono">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Server Status Indicator */}
      {!collapsed && (
        <div className="p-3 mx-3 my-2 bg-ink-dark/50 border border-border/40 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">API Live</span>
          </div>
          <span className="text-[9px] font-mono text-primary/70">v1.12.0</span>
        </div>
      )}

      {/* User Section / Log Out */}
      <div className="p-4 border-t border-border flex flex-col gap-3">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {user?.name?.slice(0, 2) || "AD"}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate leading-none mb-1">{user?.name || "Administrator"}</span>
              <span className="text-[9px] font-mono text-primary truncate uppercase tracking-widest">{user?.role || "admin"}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-pink hover:bg-pink/10 hover:text-pink justify-start gap-3 h-9 px-2 text-xs font-heading border border-transparent",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="uppercase tracking-wider text-[10px]">Log Out</span>}
        </Button>
      </div>
    </aside>
  );
}
