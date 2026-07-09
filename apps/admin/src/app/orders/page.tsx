"use client";

import { useState } from "react";
import { Search, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { Table } from "@/components/table";

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

const columns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[item.status]}`}>
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
    render: () => (
      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <Eye className="w-4 h-4 text-muted" />
      </button>
    ),
  },
];

export default function OrdersPage() {
  const [orders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");

  const filters = ["all", "pending", "preparing", "ready", "completed", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Orders Management</h1>
            <p className="text-gray-500 font-medium mt-2">Manage and track customer orders in real-time</p>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap px-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 ${
              filter === f ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]" : "bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 border border-white/80 shadow-sm"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={filtered} searchable />
      </div>
    </div>
  );
}
