"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  variant?: "primary" | "orange" | "pink" | "yellow";
}

const variants = {
  primary: { bg: "bg-primary/10", icon: "text-primary", ring: "ring-primary/20" },
  orange: { bg: "bg-orange/10", icon: "text-orange", ring: "ring-orange/20" },
  pink: { bg: "bg-pink/10", icon: "text-pink", ring: "ring-pink/20" },
  yellow: { bg: "bg-yellow/10", icon: "text-yellow", ring: "ring-yellow/20" },
};

export function StatsCard({ title, value, change, icon: Icon, variant = "primary" }: StatsCardProps) {
  const isPositive = change >= 0;
  const v = variants[variant];

  return (
    <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center ${v.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-primary" : "text-pink"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm text-muted mt-1">{title}</p>
    </div>
  );
}
