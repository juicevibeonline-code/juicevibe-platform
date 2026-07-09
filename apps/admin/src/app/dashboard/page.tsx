"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentOrders } from "@/components/recent-orders";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">Welcome back! Here's what's happening today.</p>
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
        <RevenueChart />
        <RecentOrders />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard title="Add Menu Item" description="Create a new product or beverage" href="/menu" color="primary" />
        <QuickActionCard title="View Orders" description="Manage incoming and active orders" href="/orders" color="orange" />
        <QuickActionCard title="Upload Gallery" description="Add new images to the gallery" href="/gallery" color="pink" />
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, href, color }: { title: string; description: string; href: string; color: string }) {
  const colors: Record<string, string> = {
    primary: "bg-primary/5 border-primary/20 hover:bg-primary/10",
    orange: "bg-orange/5 border-orange/20 hover:bg-orange/10",
    pink: "bg-pink/5 border-pink/20 hover:bg-pink/10",
  };

  return (
    <a
      href={href}
      className={`rounded-xl border p-6 transition-all ${colors[color]} group cursor-pointer`}
    >
      <h3 className="font-semibold group-hover:translate-x-1 transition-transform">{title}</h3>
      <p className="text-sm text-muted mt-1">{description}</p>
    </a>
  );
}
