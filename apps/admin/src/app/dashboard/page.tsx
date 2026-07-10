"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart, CategorySalesChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";
import { useEffect, useState } from "react";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [dateStr, setDateStr] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setDateStr(getFormattedDate());
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      {/* Hero Greeting Section */}
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-primary/20 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-orange/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-[0_8px_20px_rgba(34,197,94,0.35)] shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">{greeting} 👋</p>
              <h1 className="text-3xl font-black text-foreground tracking-tight mt-1">Workspace Overview</h1>
              <p className="text-muted-foreground font-semibold text-sm mt-1">{dateStr}</p>
            </div>
          </div>
          
          <Link
            href="/orders"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 font-extrabold text-sm w-fit"
          >
            Live Orders Board
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value="LKR 48,500" change={12.5} icon={DollarSign} variant="primary" />
        <StatsCard title="Total Orders" value="156" change={8.2} icon={ShoppingCart} variant="orange" />
        <StatsCard title="New Customers" value="42" change={-3.1} icon={Users} variant="pink" />
        <StatsCard title="Avg. Order Value" value="LKR 850" change={5.7} icon={TrendingUp} variant="yellow" />
      </div>

      {/* Main Charts & Side Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm">
            <RevenueChart />
          </div>
          <div className="glass-panel rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm">
            <CategorySalesChart />
          </div>
        </div>

        {/* Right column: Orders list */}
        <div className="glass-panel rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-sm">
          <RecentOrders />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-black mb-5 px-2 text-foreground">Quick Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard title="Add Menu Item" description="Create a new beverage or food item" href="/menu" color="primary" />
          <QuickActionCard title="Track Orders" description="Manage active, cooking and ready orders" href="/orders" color="orange" />
          <QuickActionCard title="Upload Assets" description="Manage image gallery and cafe promos" href="/gallery" color="pink" />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, href, color }: { title: string; description: string; href: string; color: string }) {
  const colors: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 text-primary-dark group-hover:text-primary",
    orange: "from-orange/10 to-orange/5 border-orange/20 hover:border-orange/40 text-orange group-hover:text-[#EA580C]",
    pink: "from-pink/10 to-pink/5 border-pink/20 hover:border-pink/40 text-pink group-hover:text-[#BE123C]",
  };

  return (
    <Link
      href={href}
      className={`rounded-3xl border bg-gradient-to-br p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${colors[color]} group cursor-pointer block backdrop-blur-sm`}
    >
      <h3 className="font-extrabold text-lg transition-colors">{title}</h3>
      <p className="text-sm font-semibold text-muted-foreground mt-2">{description}</p>
      <div className="flex items-center gap-1 mt-4 text-xs font-bold opacity-75 group-hover:opacity-100 transition-opacity">
        Open manager <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
