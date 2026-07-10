"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const weeklyData = [
  { day: "Mon", revenue: 12000, orders: 15 },
  { day: "Tue", revenue: 19500, orders: 25 },
  { day: "Wed", revenue: 13500, orders: 18 },
  { day: "Thu", revenue: 24000, orders: 32 },
  { day: "Fri", revenue: 16500, orders: 22 },
  { day: "Sat", revenue: 27000, orders: 36 },
  { day: "Sun", revenue: 21000, orders: 28 },
];

const categoryData = [
  { name: "Milkshakes", value: 45, color: "#22C55E" }, // primary
  { name: "Smoothies", value: 30, color: "#FB923C" }, // orange
  { name: "Fresh Juices", value: 15, color: "#FBBF24" }, // yellow
  { name: "Mocktails/Lassi", value: 10, color: "#F43F5E" }, // pink
];

// Custom Tooltip for Area Chart
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const isRevenue = payload[0].name === "Revenue";
    const value = payload[0].value;
    return (
      <div className="glass-panel rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-xl bg-white/90 dark:bg-[#111813]/90 text-sm">
        <p className="font-bold text-muted-foreground mb-1">{label}</p>
        <p className="font-black text-foreground">
          {isRevenue
            ? `LKR ${value.toLocaleString("en-LK")}`
            : `${value} Orders`}
        </p>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Pie Chart
function PieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-panel rounded-2xl p-3 border border-white/40 dark:border-white/10 shadow-xl bg-white/90 dark:bg-[#111813]/90 text-xs">
        <p className="font-bold text-foreground">{data.name}</p>
        <p className="font-semibold text-muted-foreground mt-0.5">{data.value}% of sales</p>
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const isRevenue = metric === "revenue";

  const totalRevenue = weeklyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = weeklyData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="bg-transparent h-[380px] flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Weekly Overview</h3>
          <p className="text-sm font-medium text-muted mt-0.5">Track your café analytics</p>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-border/50 shrink-0">
          <button
            onClick={() => setMetric("revenue")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              isRevenue
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Revenue
          </button>
          <button
            onClick={() => setMetric("orders")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              !isRevenue
                ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Orders
          </button>
        </div>
      </div>

      {/* Summary Figure */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-wider">
            {isRevenue ? "Total Revenue" : "Total Orders"}
          </p>
          <p className="text-3xl font-black text-foreground mt-0.5">
            {isRevenue
              ? `LKR ${totalRevenue.toLocaleString("en-LK")}`
              : `${totalOrders} Orders`}
          </p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-xs font-bold text-primary-dark">
          <TrendingUp className="w-3.5 h-3.5" />
          +12.5%
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isRevenue ? "#22C55E" : "#FB923C"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isRevenue ? "#22C55E" : "#FB923C"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
              tickFormatter={(v) => (isRevenue ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#22C55E", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey={isRevenue ? "revenue" : "orders"}
              name={isRevenue ? "Revenue" : "Orders"}
              stroke={isRevenue ? "#22C55E" : "#FB923C"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategorySalesChart() {
  return (
    <div className="bg-transparent h-[380px] flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">Sales Distribution</h3>
        <p className="text-sm font-medium text-muted mt-0.5">Top performing categories</p>
      </div>

      <div className="flex-1 w-full min-h-[240px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                  {payload?.map((entry: any, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Total Label Center */}
        <div className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-xs font-extrabold text-muted uppercase tracking-widest">Share</p>
          <p className="text-2xl font-black text-foreground mt-0.5">100%</p>
        </div>
      </div>
    </div>
  );
}
