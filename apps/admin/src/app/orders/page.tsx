"use client";

import { useState } from "react";
import { Search, Eye, Clock, CheckCircle, XCircle, LayoutList, LayoutGrid } from "lucide-react";
import { Table } from "@/components/table";
import { KanbanBoard } from "@/components/kanban-board";
import { Drawer } from "@/components/ui/drawer";
import { PageHeader } from "@/components/PageHeader";

const initialOrders = [
  { id: "#JV-001", customer: "Priya Sharma", items: 3, total: "LKR 1,200", status: "completed", payment: "paid", type: "pickup", time: "2 min ago" },
  { id: "#JV-002", customer: "Rahul Verma", items: 2, total: "LKR 850", status: "preparing", payment: "paid", type: "delivery", time: "15 min ago" },
  { id: "#JV-003", customer: "Ananya Patel", items: 1, total: "LKR 350", status: "pending", payment: "pending", type: "dine-in", time: "28 min ago" },
  { id: "#JV-004", customer: "Arjun Nair", items: 4, total: "LKR 2,100", status: "ready", payment: "paid", type: "pickup", time: "45 min ago" },
  { id: "#JV-005", customer: "Neha Gupta", items: 2, total: "LKR 950", status: "cancelled", payment: "refunded", type: "delivery", time: "1 hr ago" },
];

const statusColors: Record<string, string> = {
  completed: "bg-primary/10 text-primary",
  preparing: "bg-orange/10 text-orange",
  pending: "bg-yellow/10 text-yellow",
  ready: "bg-blue-100 text-blue-600",
  cancelled: "bg-pink/10 text-pink",
};

const filterDots: Record<string, string> = {
  all: "bg-gray-400",
  pending: "bg-yellow-400",
  preparing: "bg-orange-400",
  ready: "bg-blue-400",
  completed: "bg-primary",
  cancelled: "bg-pink",
};

export default function OrdersPage() {
  const [orders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"list" | "board">("board");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full capitalize ${statusColors[item.status]}`}>
          {item.status === "pending" && <Clock className="w-3 h-3" />}
          {item.status === "completed" && <CheckCircle className="w-3 h-3" />}
          {item.status === "cancelled" && <XCircle className="w-3 h-3" />}
          {item.status}
        </span>
      ),
    },
    { key: "payment", label: "Payment" },
    { key: "type", label: "Type" },
    { key: "time", label: "Time" },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <Eye className="w-4 h-4 text-muted hover:text-primary transition-colors" />
        </button>
      ),
    },
  ];

  const filters = ["all", "pending", "preparing", "ready", "completed", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const countByStatus = (s: string) => s === "all" ? orders.length : orders.filter((o) => o.status === s).length;

  const viewToggle = (
    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-border/50 shadow-inner">
      <button
        onClick={() => setView("board")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
          view === "board" ? "bg-white dark:bg-white/10 text-primary shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <LayoutGrid className="w-4 h-4" /> Board
      </button>
      <button
        onClick={() => setView("list")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
          view === "list" ? "bg-white dark:bg-white/10 text-primary shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <LayoutList className="w-4 h-4" /> List
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track customer orders in real-time"
        accentColor="orange"
        action={viewToggle}
      />

      {/* Status Filters — visible in both views */}
      <div className="flex gap-2 flex-wrap px-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 ${
              filter === f
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
                : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-transparent dark:border-white/10 shadow-sm"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filter === f ? "bg-white" : filterDots[f]}`} />
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${filter === f ? "bg-white/20" : "bg-gray-100 dark:bg-white/10"}`}>
              {countByStatus(f)}
            </span>
          </button>
        ))}
      </div>

      <div className="px-2">
        {view === "board" ? (
          <KanbanBoard onOrderClick={(order) => setSelectedOrder(order)} />
        ) : (
          <Table columns={columns} data={filtered} searchable />
        )}
      </div>

      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details — ${selectedOrder.id}` : "Order Details"}
        position="right"
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5 border-border/50">
              <h3 className="text-xs font-bold text-muted mb-4 uppercase tracking-wider">Customer Info</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">Name</span>
                <span className="text-sm font-bold text-foreground">{selectedOrder.customer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">Time</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1"><Clock className="w-4 h-4" />{selectedOrder.time}</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5 border-border/50">
              <h3 className="text-xs font-bold text-muted mb-4 uppercase tracking-wider">Order Info</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">Status</span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full capitalize ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">Type</span>
                <span className="text-sm font-bold text-foreground capitalize">{selectedOrder.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">Payment</span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full capitalize ${selectedOrder.payment === "paid" ? "bg-primary/10 text-primary-dark" : "bg-yellow/10 text-yellow-600"}`}>
                  {selectedOrder.payment}
                </span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total ({selectedOrder.items} items)</span>
                <span className="text-2xl font-black text-primary-dark">{selectedOrder.total}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button className="flex-1 bg-white dark:bg-black border border-border rounded-xl py-3 text-sm font-bold text-foreground hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Print Receipt
              </button>
              <button className="flex-1 bg-gradient-to-r from-primary to-primary-dark rounded-xl py-3 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 transition-all">
                Update Status
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
