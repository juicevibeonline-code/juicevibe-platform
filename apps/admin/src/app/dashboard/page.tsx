"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-500 font-medium mt-2">Welcome back to Juice Vibe! Here's what's happening today.</p>
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
      <p className="text-sm font-medium text-gray-500 mt-2">{description}</p>
    </a>
  );
}
