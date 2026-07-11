"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { orderService } from "@juice-vibe/services";
import type { Order } from "@juice-vibe/types";
import { ShoppingBag, Loader2 } from "lucide-react";

const statusColor: Record<string, string> = {
  completed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  preparing: "text-orange bg-orange/10 border-orange/20",
  pending: "text-pink bg-pink/10 border-pink/20",
  ready: "text-blue bg-blue/10 border-blue/20",
  confirmed: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  cancelled: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const statusDotColor: Record<string, string> = {
  completed: "bg-emerald-500",
  preparing: "bg-orange",
  pending: "bg-pink",
  ready: "bg-blue",
  confirmed: "bg-indigo-500",
  cancelled: "bg-rose-500",
};

function formatOrderTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrders({ limit: 5 });
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load recent orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-2">
        <h3 className="font-display font-bold text-sm text-foreground">Recent Orders</h3>
        <Link href="/orders" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-0.5 group">
          View All 
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider animate-pulse">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted mb-3 border border-border">
            <ShoppingBag className="w-5 h-5 text-muted" />
          </div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider">No active orders</p>
          <p className="text-[10px] text-muted max-w-[200px] mt-1 leading-relaxed">
            No customer orders have been received yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 divide-y divide-border/60">
          {orders.map((o) => {
            const itemCount = o.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <div
                key={o.id}
                className="flex items-center justify-between py-3.5 gap-4 hover:bg-primary/[0.02] -mx-4 px-4 rounded-xl transition-colors duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[10px] font-black text-foreground font-data">#{o.orderNumber.slice(-3)}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{o.customerName}</div>
                    <div className="text-[10px] font-semibold text-muted mt-0.5 flex items-center gap-1.5 font-data">
                      <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                      <span className="text-border">&middot;</span>
                      <span>{formatOrderTime(o.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-data text-xs font-black text-foreground">LKR {o.total.toLocaleString()}</div>
                    <div className="text-[9px] font-bold text-muted mt-0.5 tracking-wider uppercase font-data">Amount</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold font-data flex items-center gap-1 shrink-0 ${statusColor[o.status] || ""}`}>
                    <span className={`w-1 h-1 rounded-full ${statusDotColor[o.status] || "bg-muted"} ${o.status === "preparing" || o.status === "pending" ? "animate-pulse" : ""}`} />
                    <span className="capitalize">{o.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
