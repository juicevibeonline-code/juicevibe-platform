"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart3, PieChart } from "lucide-react";

function ChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/85 backdrop-blur-md border border-border/80 rounded-xl px-3.5 py-2.5 shadow-xl shadow-foreground/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        <p className="text-[10px] font-data font-black text-muted uppercase tracking-widest pl-1">{label}</p>
        <p className="text-xs font-data font-black text-foreground mt-1 pl-1">
          LKR {payload[0].value.toLocaleString("en-LK")}
        </p>
      </div>
    );
  }
  return null;
}

interface RevenueChartProps {
  data: { date: string; revenue: number; orders: number }[];
  title?: string;
}

export function RevenueChart({ data, title = "Revenue Chart" }: RevenueChartProps) {
  const chartData = (data || []).map((d) => {
    const dateObj = new Date(d.date);
    const label = isNaN(dateObj.getTime())
      ? d.date
      : dateObj.toLocaleDateString([], { month: "short", day: "numeric" });
    return {
      day: label,
      revenue: d.revenue,
    };
  });

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const maxVal = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-display font-bold text-sm text-foreground">{title}</div>
          <div className="text-xs text-muted mt-0.5 font-medium">Revenue details over the selected period</div>
        </div>
        {chartData.length > 0 && (
          <div className="font-data text-base font-black text-foreground">
            LKR {totalRevenue.toLocaleString("en-LK")}
          </div>
        )}
      </div>
      <div className="flex-1 w-full min-h-[220px] flex flex-col justify-center">
        {chartData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-slate-50/50 dark:bg-zinc-900/10 rounded-xl border border-dashed border-border/80">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted mb-3 border border-border">
              <BarChart3 className="w-5 h-5 text-muted" />
            </div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Awaiting Checkout Sales</p>
            <p className="text-[10px] text-muted max-w-xs mt-1 leading-relaxed px-4">
              We couldn't find any order transactions in the selected period. Publish menu items and start checking out.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--primary-dark)" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--orange)" stopOpacity={1} />
                  <stop offset="100%" stopColor="#C47D34" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-data)", fontWeight: "bold" }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "var(--border)", opacity: 0.2 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.revenue === maxVal ? "url(#orangeGradient)" : "url(#primaryGradient)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface CategorySalesProps {
  data: { name: string; revenue: number }[];
}

export function CategorySalesChart({ data }: CategorySalesProps) {
  const total = (data || []).reduce((sum, d) => sum + d.revenue, 0);
  const colors = ["var(--primary)", "var(--orange)", "var(--primary-light)", "var(--pink)", "var(--muted)"];

  const categoryData = (data || [])
    .map((d, i) => ({
      name: d.name,
      pct: total ? Math.round((d.revenue / total) * 100) : 0,
      color: colors[i % colors.length] || "var(--muted)",
    }))
    .slice(0, 5); // display top 5

  return (
    <div className="flex flex-col h-full">
      <div className="font-display font-bold text-sm text-foreground mb-0.5">Top Selling Share</div>
      <div className="text-xs text-muted mb-4 font-medium">Revenue split of top items</div>

      {categoryData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-slate-50/50 dark:bg-zinc-900/10 rounded-xl border border-dashed border-border/80">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted mb-3 border border-border">
            <PieChart className="w-5 h-5 text-muted" />
          </div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider">No Sales Records</p>
          <p className="text-[10px] text-muted max-w-[200px] mt-1 leading-relaxed">
            Once orders are processed, the product sales distribution will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Horizontal stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-6 border border-border/20">
            {categoryData.map((c) => (
              <div
                key={c.name}
                className="border-r border-background last:border-r-0"
                style={{ width: `${c.pct}%`, background: c.color }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs group hover:bg-primary/[0.02] p-1 -mx-1 rounded transition-colors duration-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/10" style={{ background: c.color }} />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors truncate max-w-[130px]">{c.name}</span>
                </div>
                <span className="font-data font-bold text-foreground">{c.pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
