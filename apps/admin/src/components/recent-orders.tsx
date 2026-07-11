"use client";

import Link from "next/link";

const orders = [
  { id: "JV-001", name: "Priya Sharma", items: 3, time: "2 min ago", amount: "1,200", status: "Completed" as const },
  { id: "JV-002", name: "Rahul Verma", items: 2, time: "15 min ago", amount: "850", status: "Preparing" as const },
  { id: "JV-003", name: "Ananya Patel", items: 1, time: "28 min ago", amount: "350", status: "Pending" as const },
  { id: "JV-004", name: "Arjun Nair", items: 4, time: "45 min ago", amount: "2,100", status: "Ready" as const },
  { id: "JV-005", name: "Neha Gupta", items: 2, time: "1 hr ago", amount: "950", status: "Completed" as const },
];

const statusColor: Record<string, string> = {
  Completed: "text-primary bg-primary/10 border-primary/20",
  Preparing: "text-orange bg-orange/10 border-orange/20",
  Pending: "text-pink bg-pink/10 border-pink/20",
  Ready: "text-blue bg-blue/10 border-blue/20",
};

const statusDotColor: Record<string, string> = {
  Completed: "bg-primary",
  Preparing: "bg-orange",
  Pending: "bg-pink",
  Ready: "bg-blue",
};

export function RecentOrders() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-2">
        <h3 className="font-display font-bold text-sm text-foreground">Recent Orders</h3>
        <Link href="/orders" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-0.5 group">
          View All 
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 divide-y divide-border/60">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between py-3.5 gap-4 hover:bg-primary/[0.02] -mx-4 px-4 rounded-xl transition-colors duration-200"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-[10px] font-black text-foreground font-data">{o.id.split("-")[1]}</span>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">{o.name}</div>
                <div className="text-[10px] font-semibold text-muted mt-0.5 flex items-center gap-1.5 font-data">
                  <span>{o.items} {o.items === 1 ? "item" : "items"}</span>
                  <span className="text-border">&middot;</span>
                  <span>{o.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="font-data text-xs font-black text-foreground">LKR {o.amount}</div>
                <div className="text-[9px] font-bold text-muted mt-0.5 tracking-wider uppercase font-data">Amount</div>
              </div>
              <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold font-data flex items-center gap-1 shrink-0 ${statusColor[o.status]}`}>
                <span className={`w-1 h-1 rounded-full ${statusDotColor[o.status]} ${o.status === "Preparing" || o.status === "Pending" ? "animate-pulse" : ""}`} />
                {o.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
