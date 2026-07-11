"use client";

import { Search, Eye, Clock, CheckCircle, XCircle, LayoutList, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

import { Table } from "@/components/table";
import { KanbanBoard } from "@/components/kanban-board";
import { Drawer } from "@/components/ui/drawer";
import { PageHeader } from "@/components/PageHeader";
import { orderService } from "@juice-vibe/services";
import type { Order, OrderItem, OrderStatus } from "@juice-vibe/types";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20",
  preparing: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20",
  confirmed: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20",
  ready: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20",
  cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20",
};

const filterDots: Record<string, string> = {
  all: "bg-muted",
  pending: "bg-amber-400",
  confirmed: "bg-indigo-400",
  preparing: "bg-orange-400",
  ready: "bg-blue-400",
  completed: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"list" | "board">("board");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const response = await orderService.getOrders({ limit: 100 });
      setOrders(response.orders);
    } catch (err: any) {
      console.error(err);
      if (!silent) setError(err.message || "Failed to load orders from server.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);

    const timer = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic Update
    const prevOrders = [...orders];
    setOrders((prev: Order[]) =>
      prev.map((o: Order) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : prev));
    }

    try {
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update status on server:", err);
      // Revert on failure
      setOrders(prevOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prevOrders.find(o => o.id === orderId) || null);
      }
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    const statusCycle: Partial<Record<OrderStatus, OrderStatus>> = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "completed",
      completed: "pending",
    };
    const nextStatus = (statusCycle[selectedOrder.status] ?? "pending") as OrderStatus;
    handleStatusChange(selectedOrder.id, nextStatus);
  };

  const columns = [
    { key: "orderNumber", label: "Order ID", render: (item: Order) => <span className="font-bold">#{item.orderNumber}</span> },
    { key: "customerName", label: "Customer" },
    { 
      key: "items", 
      label: "Items",
      render: (item: Order) => (
        <span>{item.items.reduce((acc: number, it: { quantity: number }) => acc + it.quantity, 0)} items</span>
      )
    },
    { 
      key: "total", 
      label: "Total",
      render: (item: Order) => <span>LKR {item.total.toLocaleString()}</span>
    },
    {
      key: "status",
      label: "Status",
      render: (item: Order) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${statusColors[item.status]}`}>
          {item.status === "pending" && <Clock className="w-3 h-3" />}
          {item.status === "completed" && <CheckCircle className="w-3 h-3" />}
          {item.status === "cancelled" && <XCircle className="w-3 h-3" />}
          {item.status}
        </span>
      ),
    },
    { 
      key: "paymentStatus", 
      label: "Payment",
      render: (item: Order) => (
        <span className="capitalize text-xs font-semibold">{item.paymentStatus}</span>
      )
    },
    { key: "type", label: "Type", render: (item: Order) => <span className="capitalize">{item.type.replace("_", "-")}</span> },
    { 
      key: "createdAt", 
      label: "Time",
      render: (item: Order) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Order) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="p-1 rounded hover:bg-background transition-colors text-muted hover:text-primary cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const filters = ["all", "pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
  
  // Table respects filter, Kanban Board displays all columns
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  
  const countByStatus = (s: string) => s === "all" ? orders.length : orders.filter((o) => o.status === s).length;

  const viewToggle = (
    <div className="flex bg-background p-1 rounded-lg border border-border">
      <button
        onClick={() => setView("board")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
          view === "board" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" /> Board
      </button>
      <button
        onClick={() => setView("list")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
          view === "list" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
        }`}
      >
        <LayoutList className="w-3.5 h-3.5" /> List
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track customer orders in real-time"
        accentColor="orange"
        action={viewToggle}
      />

      {/* Status Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-colors cursor-pointer ${
              filter === f
                ? "bg-background border-border text-primary"
                : "bg-card hover:bg-background text-muted hover:text-foreground border-border"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filterDots[f]}`} />
            {f}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${filter === f ? "bg-primary/10 text-primary-dark" : "bg-background text-muted"}`}>
              {countByStatus(f)}
            </span>
          </button>
        ))}
      </div>



      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading orders...</span>
        </div>
      ) : (
        <div>
          {view === "board" ? (
            <KanbanBoard 
              orders={orders} 
              onStatusChange={handleStatusChange} 
              onOrderClick={(order) => setSelectedOrder(order)} 
            />
          ) : (
            <Table columns={columns} data={filtered} searchable />
          )}
        </div>
      )}

      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details — #${selectedOrder.orderNumber}` : "Order Details"}
        position="right"
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-muted mb-3 uppercase tracking-wider">Customer Info</h3>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-muted">Name</span>
                <span className="font-bold text-foreground">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-muted">Phone</span>
                <span className="font-bold text-foreground">{selectedOrder.customerPhone}</span>
              </div>
              {selectedOrder.customerEmail && (
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-muted">Email</span>
                  <span className="font-bold text-foreground">{selectedOrder.customerEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted">Time</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-muted mb-3 uppercase tracking-wider">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                    <div>
                      <span className="font-bold text-foreground">{item.name}</span>
                      {item.variant && <span className="text-[10px] text-muted ml-1.5">({item.variant})</span>}
                    </div>
                    <span className="font-bold text-primary">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-muted mb-3 uppercase tracking-wider">Order Info</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted">Status</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted">Type</span>
                <span className="font-bold text-foreground capitalize">{selectedOrder.type.replace("_", "-")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Payment</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${selectedOrder.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 shadow-sm border-l-4 border-l-primary">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total ({selectedOrder.items.reduce((acc: number, it: { quantity: number }) => acc + it.quantity, 0)} items)</span>
                <span className="text-base font-bold text-primary">LKR {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button className="flex-1 bg-card border border-border hover:bg-background rounded-lg py-2.5 font-semibold text-foreground cursor-pointer transition-colors shadow-sm text-center">
                Print Receipt
              </button>
              <button 
                onClick={handleUpdateStatus}
                className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 font-semibold cursor-pointer transition-colors shadow-sm text-center"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
