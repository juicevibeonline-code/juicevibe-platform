"use client";

import { useEffect, useState } from "react";
import { Plus, ClipboardList, ImagePlus, RefreshCw, Loader2 } from "lucide-react";
import { RevenueChart, CategorySalesChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";
import { StatsCard, StatsStrip } from "@/components/stats-card";
import Link from "next/link";
import { analyticsService, type DashboardStats } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const shortcuts = [
  { 
    icon: Plus, 
    title: "Add Menu Item", 
    desc: "Create a new beverage or food item", 
    href: "/menu",
    color: "text-primary border-primary/10 bg-primary/5 group-hover:bg-primary/10",
    hoverBorder: "hover:border-primary/30"
  },
  { 
    icon: ClipboardList, 
    title: "Track Orders", 
    desc: "Manage active, cooking and ready orders", 
    href: "/orders",
    color: "text-orange border-orange/10 bg-orange/5 group-hover:bg-orange/10",
    hoverBorder: "hover:border-orange/30"
  },
  { 
    icon: ImagePlus, 
    title: "Upload Assets", 
    desc: "Manage image gallery and cafe promos", 
    href: "/gallery",
    color: "text-blue border-blue/10 bg-blue/5 group-hover:bg-blue/10",
    hoverBorder: "hover:border-blue/30"
  },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [dateStr, setDateStr] = useState("");
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
    setDateStr(getFormattedDate());
    setGreeting(getGreeting());
    loadData();
  }, [daysRange]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-md p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dynamic decorative backdrop circles */}
        <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-primary/10 rounded-full blur-[20px] pointer-events-none" />
        <div className="absolute bottom-[-30px] right-[-30px] w-32 h-32 bg-orange/10 rounded-full blur-[30px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase font-data">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {greeting}
          </div>
          <h1 className="font-display text-2xl font-black text-foreground mt-2.5 tracking-tight flex items-center gap-3">
            Workspace Overview
            <button
              onClick={() => loadData(true)}
              className="p-1 rounded-md text-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
              title="Refresh metrics"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
          </h1>
          <p className="text-xs text-muted mt-1 font-medium flex items-center gap-1.5">
            <span>{dateStr}</span>
            <span className="text-border">|</span>
            <span className="text-primary font-semibold">Bentota Outlet active</span>
          </p>
        </div>
        
        <Link
          href="/orders"
          className="relative z-10 self-start md:self-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary hover:scale-[1.02] shadow-md shadow-primary/10 transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
        >
          Live Orders Board
          <span className="group-hover:translate-x-0.5 transition-transform duration-205">&rarr;</span>
        </Link>
      </div>

      {/* Stats Ledger Strip */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-xl" />
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
            value={(stats?.orders ?? 0).toString()}
            delta={`${stats?.ordersChange && stats.ordersChange >= 0 ? "+" : ""}${stats?.ordersChange ?? 0}%`}
            up={(stats?.ordersChange ?? 0) >= 0}
          />
          <StatsCard
            title="Total Customers"
            value={(stats?.customers ?? 0).toString()}
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

      {/* Date Range & Chart Header */}
      <div className="flex justify-between items-center bg-card border border-border/80 px-4 py-2 rounded-xl">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">Timeline Chart Settings</span>
        <div className="flex gap-1.5">
          {[
            { label: "Week", val: 7 },
            { label: "Month", val: 30 },
            { label: "Year", val: 365 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDaysRange(item.val)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                daysRange === item.val
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted border-border hover:bg-card hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="col-span-1 lg:col-span-2 h-[300px] bg-card border border-border rounded-xl" />
          <div className="h-[300px] bg-card border border-border rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 premium-card p-6">
            <RevenueChart
              data={revenueData}
              title={daysRange === 7 ? "Weekly Overview" : daysRange === 30 ? "Monthly Overview" : "Yearly Overview"}
            />
          </div>
          <div className="premium-card p-6">
            <CategorySalesChart data={topSelling} />
          </div>
        </div>
      )}

      {/* Orders + Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 premium-card p-6">
          <RecentOrders />
        </div>

        <div className="flex flex-col gap-4">
          {shortcuts.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className={`premium-card p-5 flex items-start gap-4 group transition-all duration-300 ${s.hoverBorder}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 ${s.color}`}>
                <s.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-1">
                  {s.title}
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[10px]">&rarr;</span>
                </div>
                <div className="text-[11px] mt-1 text-muted leading-relaxed font-medium">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
