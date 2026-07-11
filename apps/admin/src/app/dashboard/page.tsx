"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsService, orderService, type DashboardStats, type RevenueChartData } from "@juice-vibe/services";
import { formatPrice, cn } from "@juice-vibe/utils";
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Heart, 
  AlertTriangle, 
  UtensilsCrossed, 
  UserCheck,
  RotateCw,
  ShoppingBag
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Badge } from "@juice-vibe/ui";

export default function MissionControlDashboard() {
  const [days, setDays] = useState(30);

  // Fetch Stats from service layer
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: () => analyticsService.getDashboardStats(),
    // Keep retry low for clean dev experience
    retry: 1,
  });

  // Fetch Chart Data
  const { data: chartData, isLoading: chartLoading } = useQuery<RevenueChartData[]>({
    queryKey: ["revenueChart", days],
    queryFn: () => analyticsService.getRevenueChart(days),
    retry: 1,
  });

  // Fetch top items
  const { data: topSelling } = useQuery({
    queryKey: ["topSelling"],
    queryFn: () => analyticsService.getTopSelling(5),
    retry: 1,
  });

  // Fetch live orders
  const { data: ordersData } = useQuery({
    queryKey: ["dashboardOrders"],
    queryFn: () => orderService.getOrders({ limit: 4 }),
    retry: 1,
  });

  // Fallbacks if backend is missing / seeding only
  const fallbackStats: DashboardStats = {
    revenue: 125430,
    revenueChange: 14.2,
    orders: 342,
    ordersChange: 8.5,
    customers: 87,
    customersChange: 12.3,
    averageOrderValue: 366,
    aovChange: 5.2,
  };

  const fallbackChartData: RevenueChartData[] = [
    { date: "Jul 05", revenue: 12000, orders: 32 },
    { date: "Jul 06", revenue: 15400, orders: 41 },
    { date: "Jul 07", revenue: 14200, orders: 38 },
    { date: "Jul 08", revenue: 19800, orders: 50 },
    { date: "Jul 09", revenue: 18100, orders: 48 },
    { date: "Jul 10", revenue: 22400, orders: 60 },
    { date: "Jul 11", revenue: 23530, orders: 73 },
  ];

  const currentStats = stats || fallbackStats;
  const currentChart = chartData || fallbackChartData;

  const handleRefreshAll = () => {
    refetchStats();
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Mission Control
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            // OPERATIONAL LOGS AND DISPATCH PANEL
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-card border border-border text-foreground font-mono text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-primary/50"
          >
            <option value={7}>L7D (7 Days)</option>
            <option value={30}>L30D (30 Days)</option>
            <option value={90}>L90D (90 Days)</option>
          </select>
          <button
            onClick={handleRefreshAll}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>SYNC LOGS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Revenue */}
        <div className="terminal-card p-5 relative overflow-hidden bg-card border-primary/30 glow-border citrus-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Gross Revenue</span>
            <TrendingUp className="h-4 w-4 text-primary text-glow" />
          </div>
          <div className="font-numeral text-2xl font-bold text-foreground">
            {formatPrice(currentStats.revenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-primary">
            <span>+{currentStats.revenueChange}%</span>
            <span className="text-muted-foreground/60">vs last segment</span>
          </div>
        </div>

        {/* KPI: Orders */}
        <div className="terminal-card p-5 relative overflow-hidden bg-card border-orange/30 glow-border-orange orange-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Orders Count</span>
            <ShoppingBag className="h-4 w-4 text-orange text-glow-orange" />
          </div>
          <div className="font-numeral text-2xl font-bold text-foreground">
            {currentStats.orders}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-orange">
            <span>+{currentStats.ordersChange}%</span>
            <span className="text-muted-foreground/60">completed dispatch</span>
          </div>
        </div>

        {/* KPI: Active Members */}
        <div className="terminal-card p-5 relative overflow-hidden bg-card border-yellow/30 glow-border-yellow sunlight-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">CRM Customers</span>
            <UserCheck className="h-4 w-4 text-yellow text-glow-yellow" />
          </div>
          <div className="font-numeral text-2xl font-bold text-foreground">
            {currentStats.customers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-yellow">
            <span>+{currentStats.customersChange}%</span>
            <span className="text-muted-foreground/60">loyalty acquisitions</span>
          </div>
        </div>

        {/* KPI: AOV */}
        <div className="terminal-card p-5 relative overflow-hidden bg-card border-primary/30 glow-border citrus-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Avg Order Value</span>
            <Clock className="h-4 w-4 text-primary text-glow" />
          </div>
          <div className="font-numeral text-2xl font-bold text-foreground">
            {formatPrice(currentStats.averageOrderValue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-primary">
            <span>+{currentStats.aovChange}%</span>
            <span className="text-muted-foreground/60">ticket average size</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recharts Trend */}
        <div className="lg:col-span-2 terminal-card p-6 bg-card space-y-4 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground font-heading">
                Operational Sales Trend
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Hourly transaction logs aggregated across workspaces
              </p>
            </div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>

          <div className="h-80 w-full font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#163B29" opacity={0.3} />
                <XAxis dataKey="date" stroke="#4B6B58" />
                <YAxis yAxisId="left" stroke="#10B981" />
                <YAxis yAxisId="right" orientation="right" stroke="#FB923C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2E24",
                    borderColor: "#163B29",
                    color: "#ECFDF5",
                    fontSize: "11px",
                    fontFamily: "IBM Plex Mono",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#FB923C"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Alerts & Status summary */}
        <div className="space-y-6">
          {/* Inventory warning panel */}
          <div className="terminal-card p-5 bg-card border border-border space-y-3 border-pink/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-pink" />
              <span>Inventory Threshold Alarms</span>
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-2.5 bg-pink/5 border border-pink/20 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-semibold text-pink">Mango Pulp</span>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">Alert Level: &lt; 5kg</span>
                </div>
                <span className="font-numeral text-pink font-semibold bg-pink/10 px-2 py-0.5 rounded">4.2kg</span>
              </div>
              
              <div className="p-2.5 bg-primary/5 border border-border/60 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground">Avocado Pulp</span>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">Alert Level: &lt; 3kg</span>
                </div>
                <span className="font-numeral text-foreground bg-ink-dark px-2 py-0.5 rounded">6.5kg</span>
              </div>
            </div>
          </div>

          {/* Refrigerator & Dispenser Telemetry Counter */}
          <div className="terminal-card p-5 bg-card border border-yellow/30 glow-border-yellow sunlight-card-hover space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <Activity className="h-4 w-4 text-yellow text-glow-yellow animate-pulse" />
              <span>Juicebar Vibe Telemetry</span>
            </h3>
            
            <div className="space-y-2.5 font-mono text-[9px]">
              <div className="flex justify-between items-center bg-ink-dark/40 p-2 rounded-lg border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Chiller #1 (Citrus Chest)
                </span>
                <span className="font-numeral text-primary font-bold">2.4 °C</span>
              </div>
              
              <div className="flex justify-between items-center bg-ink-dark/40 p-2 rounded-lg border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Chiller #2 (Pulp Vault)
                </span>
                <span className="font-numeral text-primary font-bold">1.8 °C</span>
              </div>

              <div className="flex justify-between items-center bg-ink-dark/40 p-2 rounded-lg border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  CO2 Carbonator Tank
                </span>
                <span className="font-numeral text-orange font-bold">48 PSI</span>
              </div>

              <div className="flex justify-between items-center bg-ink-dark/40 p-2 rounded-lg border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Puree Dispenser Flow
                </span>
                <span className="font-numeral text-yellow font-bold">1.4 GPM</span>
              </div>
            </div>
          </div>

          {/* Popular/Top products listing */}
          <div className="terminal-card p-5 bg-card border border-border space-y-3 border-primary/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
              <span>Top Operational Items</span>
            </h3>
            <div className="divide-y divide-border/40 font-mono text-[10px]">
              {(topSelling || [
                { name: "Strawberry Milkshake", quantity: 34, revenue: 11900 },
                { name: "Chocolate Milkshake", quantity: 28, revenue: 8400 },
                { name: "Mango Milkshake", quantity: 22, revenue: 7700 }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">0{idx + 1}.</span>
                    <span className="font-medium text-foreground font-sans">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{item.quantity} orders</span>
                    <span className="font-numeral text-primary">{formatPrice(item.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live active orders queue */}
      <div className="terminal-card p-6 bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground font-heading">
              Active Operations Desk Feed
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Live orders processing pipelines matching database models
            </p>
          </div>
          <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Price total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {(ordersData?.orders?.slice(0, 4) || [
                { orderNumber: "ORD-8947", customerName: "Arjun Nair", type: "pickup", total: 1250, status: "preparing", createdAt: "2026-07-12T00:01:00Z" },
                { orderNumber: "ORD-8946", customerName: "Neha Gupta", type: "delivery", total: 3450, status: "pending", createdAt: "2026-07-11T23:45:00Z" },
                { orderNumber: "ORD-8945", customerName: "Priya Sharma", type: "pickup", total: 900, status: "ready", createdAt: "2026-07-11T23:30:00Z" }
              ]).map((order: any) => (
                <tr key={order.orderNumber} className="hover:bg-ink-dark/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{order.orderNumber}</td>
                  <td className="py-3.5 px-4">{order.customerName}</td>
                  <td className="py-3.5 px-4">
                    <span className="uppercase text-[9px] tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                      {order.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-numeral text-primary">{formatPrice(order.total)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold",
                        order.status === "pending" && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                        order.status === "preparing" && "bg-primary/10 text-primary border border-primary/20",
                        order.status === "ready" && "bg-primary/20 text-primary-light border border-primary/30",
                        order.status === "completed" && "bg-ink-dark text-muted-foreground border border-border"
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[10px] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
