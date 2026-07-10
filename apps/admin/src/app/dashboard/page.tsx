"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowRight } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";
import { PageHeader } from "@/components/PageHeader";
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
      {/* Page Header */}
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">{greeting} 👋</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Overview Dashboard</h1>
            <p className="text-muted font-medium mt-1">{dateStr}</p>
          </div>
          <Link
            href="/orders"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold text-sm w-fit"
          >
            View All Orders
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

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <RevenueChart />
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <RecentOrders />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4 px-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard title="Add Menu Item" description="Create a new product or beverage" href="/menu" color="primary" />
          <QuickActionCard title="View Orders" description="Manage incoming and active orders" href="/orders" color="orange" />
          <QuickActionCard title="Upload Gallery" description="Add new images to the gallery" href="/gallery" color="pink" />
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
    <a
      href={href}
      className={`rounded-3xl border bg-gradient-to-br p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${colors[color]} group cursor-pointer block backdrop-blur-sm`}
    >
      <h3 className="font-bold text-lg transition-colors">{title}</h3>
      <p className="text-sm font-medium text-muted mt-2">{description}</p>
      <div className="flex items-center gap-1 mt-4 text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity">
        Go to page <ArrowRight className="w-3 h-3" />
      </div>
    </a>
  );
}
