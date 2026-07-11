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
        color: "text-orange",
        bgColor: "bg-orange/10",
        borderColor: "border-orange/20",
        borderLeft: "border-l-orange",
        glow: "bg-orange"
      };
    }
    if (t.includes("orders")) {
      return {
        icon: ShoppingBag,
        color: "text-blue",
        bgColor: "bg-blue/10",
        borderColor: "border-blue/20",
        borderLeft: "border-l-blue",
        glow: "bg-blue"
      };
    }
    if (t.includes("customers")) {
      return {
        icon: Users,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/20",
        borderLeft: "border-l-primary",
        glow: "bg-primary"
      };
    }
    return {
      icon: CreditCard,
      color: "text-pink",
      bgColor: "bg-pink/10",
      borderColor: "border-pink/20",
      borderLeft: "border-l-pink",
      glow: "bg-pink"
    };
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className={`premium-card p-5 flex items-center justify-between relative overflow-hidden group border-l-4 ${style.borderLeft}`}>
      {/* Background soft color glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[35px] opacity-15 pointer-events-none transition-all duration-500 group-hover:scale-150 ${style.glow}`} />

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-muted block group-hover:text-foreground transition-colors duration-300">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-data text-2xl font-black text-foreground">{value}</span>
          <span
            className={`flex items-center text-[10px] font-bold font-data px-1.5 py-0.5 rounded-full ${
              up 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {delta}
          </span>
        </div>
      </div>

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center relative z-10 shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-110 ${style.bgColor} ${style.color} border ${style.borderColor}`}>
        <Icon className="w-5 h-5" />
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

