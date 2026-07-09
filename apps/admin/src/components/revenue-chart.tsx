"use client";

import { TrendingUp } from "lucide-react";

export function RevenueChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [40, 65, 45, 80, 55, 90, 70];
  const max = Math.max(...data);

  return (
    <div className="bg-transparent h-full flex flex-col">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-800">Revenue Overview</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Weekly revenue performance</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-bold text-primary-dark">
          <TrendingUp className="w-3.5 h-3.5" />
          +12.5%
        </div>
      </div>

      <div className="flex-1 flex items-end gap-3 h-[250px] mt-auto">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
            <span className="text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">{value}%</span>
            <div
              className="w-full rounded-xl bg-gradient-to-t from-primary/80 to-primary-light transition-all duration-500 group-hover:scale-y-105 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer origin-bottom"
              style={{ height: `${(value / max) * 100}%` }}
            />
            <span className="text-xs font-semibold text-gray-500 group-hover:text-primary-dark transition-colors">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
