import { ArrowUpRight, ArrowDownRight, TrendingUp, ShoppingBag, Users, CreditCard } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  delta: string;
  up: boolean;
}

export function StatsCard({ title, value, delta, up }: StatsCardProps) {
  const getStyle = () => {
    const t = title.toLowerCase();
    if (t.includes("revenue")) {
      return {
        icon: TrendingUp,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glow: "bg-emerald-500"
      };
    }
    if (t.includes("orders")) {
      return {
        icon: ShoppingBag,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        glow: "bg-blue-500"
      };
    }
    if (t.includes("customers")) {
      return {
        icon: Users,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        glow: "bg-amber-500"
      };
    }
    return {
      icon: CreditCard,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      glow: "bg-pink-500"
    };
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="premium-card p-5 relative overflow-hidden group border border-border/80 transition-all duration-300">
      {/* Background soft color glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[35px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-all duration-500 group-hover:scale-150 ${style.glow}`} />

      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted block group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${style.bgColor} ${style.color} ${style.borderColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="font-data text-2xl font-black text-foreground">{value}</div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center text-[9px] font-bold font-data px-1.5 py-0.5 rounded-md ${
              up 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            {up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {delta}
          </span>
          <span className="text-[9px] text-muted font-medium">vs last month</span>
        </div>
      </div>
    </div>
  );
}

export function StatsStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {children}
    </div>
  );
}

