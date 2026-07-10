"use client";

import { TrendingUp } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const data = [40, 65, 45, 80, 55, 90, 70];
const values = [12000, 19500, 13500, 24000, 16500, 27000, 21000];
const max = Math.max(...data);
const totalRevenue = "LKR 133,500";

export function RevenueChart() {
  const yLabels = [100, 75, 50, 25, 0];

  return (
    <div className="bg-transparent h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Revenue Overview</h3>
          <p className="text-sm font-medium text-muted mt-0.5">Weekly performance</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-bold text-primary-dark">
          <TrendingUp className="w-3.5 h-3.5" />
          +12.5%
        </div>
      </div>

      {/* Total Revenue */}
      <div className="mb-6 px-1">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total This Week</p>
        <p className="text-2xl font-black text-foreground mt-0.5">{totalRevenue}</p>
      </div>

      {/* Chart */}
      <div className="flex gap-2 flex-1 min-h-[200px]">
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-right pr-2 shrink-0 pb-7">
          {yLabels.map((label) => (
            <span key={label} className="text-[10px] font-semibold text-muted leading-none">{label}%</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-2">
          {data.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
                <div className="bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                  {values[i].toLocaleString("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 })}
                </div>
              </div>
              <div
                className="w-full rounded-xl bg-gradient-to-t from-primary/80 to-primary-light transition-all duration-500 group-hover:from-primary group-hover:to-primary-light group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer origin-bottom"
                style={{ height: `${(value / max) * 100}%` }}
              />
              <span className="text-[10px] font-semibold text-muted group-hover:text-primary-dark transition-colors">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
