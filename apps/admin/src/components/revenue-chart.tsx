"use client";

import { TrendingUp } from "lucide-react";

export function RevenueChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [40, 65, 45, 80, 55, 90, 70];
  const max = Math.max(...data);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
          <p className="text-sm text-muted">Weekly revenue performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <TrendingUp className="w-4 h-4" />
          +12.5%
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <span className="text-xs text-muted">{value}%</span>
            <div
              className="w-full rounded-lg bg-gradient-to-t from-primary to-primary-light transition-all hover:opacity-80 cursor-pointer"
              style={{ height: `${(value / max) * 100}%` }}
            />
            <span className="text-xs text-muted">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
