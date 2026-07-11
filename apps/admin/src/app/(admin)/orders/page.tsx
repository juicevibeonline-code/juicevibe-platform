"use client";

import { Search, Eye, Clock, CheckCircle, XCircle, LayoutList, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

import { Table } from "@/components/table";
import { KanbanBoard } from "@/components/kanban-board";
import { Drawer } from "@/components/ui/drawer";
import { PageHeader } from "@/components/PageHeader";
import { ActionMenu } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared";
import { SectionCard, SectionTitle, KeyValueRow } from "@/components/shared";
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
      setOrders(response.orders ?? []);
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
    { key: "orderNumber", label: "Order ID", sortable: true, render: (item: Order) => <span className="font-bold">#{item.orderNumber}</span> },
    { key: "customerName", label: "Customer", sortable: true },
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
      sortable: true,
      render: (item: Order) => <span>LKR {item.total.toLocaleString()}</span>
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Order) => {
        const statusLabels: Record<string, string> = {
          completed: "Completed",
          pending: "Pending",
          preparing: "Preparing",
          confirmed: "Confirmed",
          ready: "Ready",
          cancelled: "Cancelled",
        };
        return (
          <Badge variant={item.status === "completed" ? "success" : item.status === "cancelled" ? "danger" : item.status === "ready" ? "info" : "warning"} className="font-bold text-xs uppercase tracking-wider">
            {statusLabels[item.status] || item.status}
          </Badge>
        );
      },
    },
    { 
      key: "paymentStatus", 
      label: "Payment",
      sortable: true,
      render: (item: Order) => (
        <Badge variant={item.paymentStatus === "paid" ? "success" : "warning"} className="capitalize text-xs font-semibold">
          {item.paymentStatus}
        </Badge>
      )
    },
    { key: "type", label: "Type", render: (item: Order) => <span className="capitalize">{item.type.replace("_", "-")}</span> },
    { 
      key: "createdAt", 
      label: "Time",
      sortable: true,
      render: (item: Order) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (item: Order) => {
        const actions = [
          {
            label: "View Details",
            onClick: () => setSelectedOrder(item),
            icon: <Eye className="w-3.5 h-3.5 text-primary" />,
          },
        ];
        return <ActionMenu items={actions} />;
      },
    },
  ];

  const filters = ["all", "pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

  const filterActiveColors: Record<string, string> = {
    all: "bg-foreground text-background",
    pending: "bg-amber-500 text-white",
    confirmed: "bg-indigo-500 text-white",
    preparing: "bg-orange-500 text-white",
    ready: "bg-blue-500 text-white",
    completed: "bg-emerald-500 text-white",
    cancelled: "bg-rose-500 text-white",
  };

  const filterCountBg: Record<string, string> = {
    all: "bg-foreground/20 text-background",
    pending: "bg-amber-500/20 text-amber-100",
    confirmed: "bg-indigo-500/20 text-indigo-100",
    preparing: "bg-orange-500/20 text-orange-100",
    ready: "bg-blue-500/20 text-blue-100",
    completed: "bg-emerald-500/20 text-emerald-100",
    cancelled: "bg-rose-500/20 text-rose-100",
  };
  
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track customer orders in real-time"
        action={viewToggle}
      />

      {/* Status Filters Control Bar */}
      <div className="bg-card border border-border/80 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-full shrink-0 shadow-sm">
        {filters.map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? `${filterActiveColors[f]} shadow-sm`
                  : "text-muted hover:text-foreground hover:bg-background/50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : filterDots[f]}`} />
              {f}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                isActive 
                  ? filterCountBg[f]
                  : "bg-muted/15 text-muted-foreground"
              }`}>
                {countByStatus(f)}
              </span>
            </button>
          );
        })}
      </div>



      {loading ? (
        <LoadingState label="Loading orders..." />
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
            <SectionCard>
              <SectionTitle>Customer Info</SectionTitle>
              <KeyValueRow label="Name">{selectedOrder.customerName}</KeyValueRow>
              <KeyValueRow label="Phone">{selectedOrder.customerPhone}</KeyValueRow>
              {selectedOrder.customerEmail && (
                <KeyValueRow label="Email">{selectedOrder.customerEmail}</KeyValueRow>
              )}
              <KeyValueRow label="Time">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </KeyValueRow>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Order Items</SectionTitle>
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
            </SectionCard>

            <SectionCard>
              <SectionTitle>Order Info</SectionTitle>
              <KeyValueRow label="Status">
                {(() => {
                  const statusLabels: Record<string, string> = {
                    completed: "Completed", pending: "Pending", preparing: "Preparing",
                    confirmed: "Confirmed", ready: "Ready", cancelled: "Cancelled",
                  };
                  return statusLabels[selectedOrder.status] || selectedOrder.status;
                })()}
              </KeyValueRow>
              <KeyValueRow label="Type">
                <span className="capitalize">{selectedOrder.type.replace("_", "-")}</span>
              </KeyValueRow>
              <KeyValueRow label="Payment">
                <Badge variant={selectedOrder.paymentStatus === "paid" ? "success" : "warning"} className="capitalize font-bold text-[10px]">
                  {selectedOrder.paymentStatus}
                </Badge>
              </KeyValueRow>
            </SectionCard>

            <SectionCard className="border-l-4 border-l-primary">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total ({selectedOrder.items.reduce((acc: number, it: { quantity: number }) => acc + it.quantity, 0)} items)</span>
                <span className="text-base font-bold text-primary">LKR {selectedOrder.total.toLocaleString()}</span>
              </div>
            </SectionCard>

            <div className="pt-4 flex gap-2">
              <Button variant="secondary" className="flex-1 text-xs" onClick={() => window.print()}>Print Receipt</Button>
              <Button variant="primary" className="flex-1 text-xs" onClick={handleUpdateStatus}>Update Status</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
