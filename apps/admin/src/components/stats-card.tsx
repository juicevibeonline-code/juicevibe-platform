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
  primary: { bg: "bg-gradient-to-br from-primary to-primary-dark", icon: "text-white", shadow: "shadow-[0_8px_20px_rgba(34,197,94,0.3)]", glow: "from-primary/20" },
  orange: { bg: "bg-gradient-to-br from-orange to-[#EA580C]", icon: "text-white", shadow: "shadow-[0_8px_20px_rgba(249,115,22,0.3)]", glow: "from-orange/20" },
  pink: { bg: "bg-gradient-to-br from-pink to-[#BE123C]", icon: "text-white", shadow: "shadow-[0_8px_20px_rgba(225,29,72,0.3)]", glow: "from-pink/20" },
  yellow: { bg: "bg-gradient-to-br from-yellow to-[#B45309]", icon: "text-white", shadow: "shadow-[0_8px_20px_rgba(217,119,6,0.3)]", glow: "from-yellow/20" },
};

export function StatsCard({ title, value, change, icon: Icon, variant = "primary" }: StatsCardProps) {
  const isPositive = change >= 0;
  const v = variants[variant];

  return (
    <div className="relative glass-panel rounded-3xl p-6 group hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      {/* Decorative ambient glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-50 bg-gradient-to-br ${v.glow} to-transparent pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center ${v.icon} ${v.shadow} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-7 h-7" />
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isPositive ? "bg-primary/10 text-primary-dark" : "bg-pink/10 text-pink"}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-muted mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
}
