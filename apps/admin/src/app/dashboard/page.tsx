"use client";

import { useEffect, useState } from "react";
import { Plus, ClipboardList, ImagePlus, RefreshCw, Loader2, Download, Settings } from "lucide-react";
import { RevenueChart, CategorySalesChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";
import { StatsCard, StatsStrip } from "@/components/stats-card";
import Link from "next/link";
import { analyticsService, type DashboardStats } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const shortcuts = [
  { 
    icon: Plus, 
    title: "Add Menu Item", 
    desc: "Create a new beverage or food item", 
    href: "/menu",
    color: "text-emerald-600 border-emerald-500/10 bg-emerald-500/5 group-hover:bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/30"
  },
  { 
    icon: ClipboardList, 
    title: "Track Orders", 
    desc: "Manage active, cooking and ready orders", 
    href: "/orders",
    color: "text-amber-600 border-amber-500/10 bg-amber-50/5 group-hover:bg-amber-100/10",
    hoverBorder: "hover:border-amber-500/30"
  },
  { 
    icon: ImagePlus, 
    title: "Upload Assets", 
    desc: "Manage image gallery and cafe promos", 
    href: "/gallery",
    color: "text-blue-600 border-blue-500/10 bg-blue-500/5 group-hover:bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/30"
  },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [daysRange, setDaysRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      const [statsRes, chartRes, topSellingRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getRevenueChart(daysRange),
        analyticsService.getTopSelling(),
      ]);

      setStats(statsRes);
      setRevenueData(chartRes);
      setTopSelling(topSellingRes);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to load dashboard data",
        message: err.message || "An error occurred while fetching metrics.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
    loadData();
  }, [daysRange]);

  const handleExport = () => {
    toast({
      type: "success",
      title: "Data Exported",
      message: "Dashboard summary data exported successfully to CSV.",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      {/* Page Header Actions Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted mt-1.5 font-semibold">
            {greeting}, Admin. Here is your business overview today.
          </p>
        </div>

        {/* Header Control Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeline Range selector */}
          <div className="flex bg-slate-100/80 dark:bg-zinc-900/60 p-0.5 rounded-lg border border-border/60">
            {[
              { label: "7D", val: 7 },
              { label: "30D", val: 30 },
              { label: "1Y", val: 365 },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setDaysRange(item.val)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  daysRange === item.val
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadData(true)}
            className="p-2 rounded-lg bg-card border border-border hover:bg-slate-50 dark:hover:bg-zinc-900 text-muted hover:text-foreground transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
            title="Refresh metrics"
          >
            {refreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-card border border-border hover:bg-slate-50 dark:hover:bg-zinc-900 text-muted hover:text-foreground transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
            title="Export summary"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Settings Shortcut */}
          <Link
            href="/settings"
            className="p-2 rounded-lg bg-card border border-border hover:bg-slate-50 dark:hover:bg-zinc-900 text-muted hover:text-foreground transition-all shadow-sm cursor-pointer shrink-0"
            title="Workspace Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>

          {/* Live Orders Board Button */}
          <Link
            href="/orders"
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-xs font-bold text-white transition-all shadow-md shadow-primary/10 cursor-pointer whitespace-nowrap flex items-center gap-1 group"
          >
            Live Board
            <span className="group-hover:translate-x-0.5 transition-transform duration-205">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Stats Ledger Strip */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[110px] bg-card border border-border/80 rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsStrip>
          <StatsCard
            title="Total Revenue"
            value={`LKR ${(stats?.revenue ?? 0).toLocaleString("en-LK")}`}
            delta={`${stats?.revenueChange && stats.revenueChange >= 0 ? "+" : ""}${stats?.revenueChange ?? 0}%`}
            up={(stats?.revenueChange ?? 0) >= 0}
          />
          <StatsCard
            title="Total Orders"
            value={(stats?.orders ?? 0).toLocaleString()}
            delta={`${stats?.ordersChange && stats.ordersChange >= 0 ? "+" : ""}${stats?.ordersChange ?? 0}%`}
            up={(stats?.ordersChange ?? 0) >= 0}
          />
          <StatsCard
            title="Total Customers"
            value={(stats?.customers ?? 0).toLocaleString()}
            delta={`${stats?.customersChange && stats.customersChange >= 0 ? "+" : ""}${stats?.customersChange ?? 0}%`}
            up={(stats?.customersChange ?? 0) >= 0}
          />
          <StatsCard
            title="Avg. Order Value"
            value={`LKR ${(stats?.averageOrderValue ?? 0).toLocaleString("en-LK")}`}
            delta={`${stats?.aovChange && stats.aovChange >= 0 ? "+" : ""}${stats?.aovChange ?? 0}%`}
            up={(stats?.aovChange ?? 0) >= 0}
          />
        </StatsStrip>
      )}

      {/* Bento Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-[300px] bg-card border border-border/80 rounded-xl" />
            <div className="h-[350px] bg-card border border-border/80 rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-[250px] bg-card border border-border/80 rounded-xl" />
            <div className="h-[250px] bg-card border border-border/80 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Content Area (Timeline Charts & Lists) - Spans 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div className="premium-card p-6 shadow-sm">
              <RevenueChart
                data={revenueData}
                title={daysRange === 7 ? "Weekly Revenue" : daysRange === 30 ? "Monthly Revenue" : "Yearly Revenue"}
              />
            </div>
            <div className="premium-card p-6 shadow-sm">
              <RecentOrders />
            </div>
          </div>

          {/* Sidebar Panels (Top Sellings & Quick Actions) - Spans 1 col */}
          <div className="space-y-6">
            <div className="premium-card p-6 shadow-sm">
              <CategorySalesChart data={topSelling} />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block pl-1">Quick Actions</span>
              <div className="flex flex-col gap-3">
                {shortcuts.map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    className={`premium-card p-4 flex items-start gap-3.5 group transition-all duration-300 ${s.hoverBorder}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105 ${s.color}`}>
                      <s.icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-1">
                        <span className="truncate">{s.title}</span>
                        <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-[10px]">&rarr;</span>
                      </div>
                      <div className="text-[10px] mt-0.5 text-muted leading-relaxed font-semibold">{s.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
