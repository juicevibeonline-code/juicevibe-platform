"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, tableService } from "@juice-vibe/services";
import type { Order } from "@juice-vibe/types";
import { LoadingSpinner } from "@juice-vibe/ui";
import { formatPrice, formatDate } from "@juice-vibe/utils";
import { 
  Kanban as KanbanIcon, 
  List as ListIcon, 
  Filter, 
  RefreshCw, 
  ChevronRight, 
  MapPin, 
  Phone,
  User,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
  Coffee,
  Calendar,
  Bell,
  QrCode,
} from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { useOrdersSocket } from "@/hooks/use-orders-socket";

type ViewMode = "kanban" | "list" | "table_map";

export default function OrderDesk() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [liveAlert, setLiveAlert] = useState<{ orderNumber: string; table?: number; total: number } | null>(null);

  const { data: tables = [] } = useQuery<any[]>({
    queryKey: ["tables"],
    queryFn: () => tableService.getTables(),
    enabled: viewMode === "table_map",
  });


  // ─── Real-time WebSocket ─────────────────────────────────────────────────
  const handleNewOrder = useCallback((order: any) => {
    // Invalidate React Query cache so list/kanban updates instantly
    queryClient.invalidateQueries({ queryKey: ["ordersDesk"] });
    queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] });
    // Show live alert banner
    setLiveAlert({
      orderNumber: order.orderNumber,
      table: order.table?.number,
      total: order.total,
    });
    // Auto-dismiss after 6 seconds
    setTimeout(() => setLiveAlert(null), 6000);
  }, [queryClient]);

  useOrdersSocket(handleNewOrder);

  // Fetch orders (shared state source)
  const { data: ordersResponse, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["ordersDesk", statusFilter, typeFilter],
    queryFn: () => orderService.getOrders({ 
      status: statusFilter === "all" ? undefined : statusFilter, 
      limit: 100 
    }),
    retry: 1,
  });

  const orders: Order[] = ordersResponse?.orders || [];

  // Update Status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordersDesk"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardOrders"] });
    },
  });

  // Handle local status transition
  const handleStatusTransition = (orderId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "completed",
    };
    const next = nextStatusMap[currentStatus];
    if (next) {
      updateStatusMutation.mutate({ id: orderId, status: next });
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      updateStatusMutation.mutate({ id: orderId, status: "cancelled" });
    }
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export");
      return;
    }

    const headers = [
      "Order Number",
      "Customer Name",
      "Phone",
      "Email",
      "Type",
      "Status",
      "Payment Method",
      "Subtotal",
      "Tax",
      "Discount",
      "Total",
      "Created At"
    ];

    const rows = filteredOrders.map(order => [
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      order.customerEmail || "",
      order.type,
      order.status,
      order.paymentMethod,
      order.subtotal,
      order.tax,
      order.discount,
      order.total,
      order.createdAt
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Filter type client-side to enforce same state source
  const filteredOrders = orders.filter((order: Order) => {
    if (typeFilter === "all") return true;
    return order.type === typeFilter;
  });

  // Kanban statuses list
  const kanbanStatuses = ["pending", "confirmed", "preparing", "ready", "completed"];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pending Approval",
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Live Order Alert Banner */}
      {liveAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary animate-pulse shadow-sm">
          <Bell className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-mono font-semibold">NEW ORDER</span>
          <span className="font-mono text-foreground/70">#{liveAlert.orderNumber}</span>
          {liveAlert.table && (
            <span className="flex items-center gap-1 text-foreground/70 font-mono">
              <QrCode className="h-3.5 w-3.5" />
              Table {liveAlert.table}
            </span>
          )}
          <span className="ml-auto font-mono font-bold text-primary">
            LKR {liveAlert.total?.toLocaleString()}
          </span>
          <button
            onClick={() => setLiveAlert(null)}
            className="ml-2 text-primary/60 hover:text-primary text-xs"
          >
            ✕
          </button>
        </div>
      )}
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Order Desk
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            SHARED DISPATCH QUEUE // REAL-TIME KANBAN & OPERATIONAL GRID
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle */}
          <div className="bg-ink-dark border border-border p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all",
                viewMode === "kanban" ? "bg-primary/20 text-primary border border-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <KanbanIcon className="h-3.5 w-3.5" />
              <span>KANBAN</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all",
                viewMode === "list" ? "bg-primary/20 text-primary border border-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span>GRID LIST</span>
            </button>
            <button
              onClick={() => setViewMode("table_map")}
              className={cn(
                "p-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all",
                viewMode === "table_map" ? "bg-primary/20 text-primary border border-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>TABLE MAP</span>
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-card border border-border text-foreground font-mono text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-primary/50"
          >
            <option value="all">All Types</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
            <option value="dine_in">Dine-in</option>
          </select>

          {/* Status Filter (Grid only) */}
          {viewMode === "list" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-card border border-border text-foreground font-mono text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-ink-dark border border-border hover:border-primary/40 hover:text-foreground transition-colors text-muted-foreground cursor-pointer text-xs font-mono font-bold uppercase tracking-wider"
          >
            Export CSV
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg bg-ink-dark border border-border hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-50 text-muted-foreground cursor-pointer"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Main content based on View Mode */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center font-mono text-xs text-muted-foreground uppercase">
          <LoadingSpinner className="h-6 w-6 text-primary mr-2" />
          Loading pipeline orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">No Orders in System</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Live operations grid has no transactions matching query filter variables.
          </p>
        </div>
      ) : viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {kanbanStatuses.map((status) => {
            const columnOrders = filteredOrders.filter(o => o.status === status);
            return (
              <div key={status} className="terminal-card bg-card border border-border/80 flex flex-col max-h-[80vh] overflow-hidden">
                {/* Column header */}
                <div className="p-3 border-b border-border/60 bg-ink-dark flex items-center justify-between shrink-0">
                  <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider truncate">
                    {getStatusLabel(status)}
                  </span>
                  <span className="font-numeral text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded-full shrink-0">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Column scrollable cards list */}
                <div className="p-2 space-y-2 overflow-y-auto min-h-[150px] scrollbar-hide">
                  {columnOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-ink-dark border border-border/60 rounded-lg p-3 hover:border-primary/40 transition-colors space-y-2.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-numeral text-xs font-bold text-foreground">{order.orderNumber}</span>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono bg-card px-1.5 py-0.5 rounded border border-border/40">
                          {order.type}
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate text-foreground font-sans">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{order.customerPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] font-mono">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-numeral text-primary font-semibold">{formatPrice(order.total)}</span>
                      </div>

                      {/* Operations buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {status !== "completed" && (
                          <button
                            onClick={() => handleStatusTransition(order.id, order.status)}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-[9px] font-mono font-semibold rounded uppercase tracking-wider cursor-pointer"
                          >
                            <span>Advance</span>
                            <ChevronRight className="h-2.5 w-2.5" />
                          </button>
                        )}
                        {status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-1 px-2 border border-pink/30 hover:bg-pink/15 text-pink text-[9px] font-mono font-semibold rounded uppercase tracking-wider cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="text-center py-8 text-[10px] font-mono text-muted-foreground/50 uppercase border border-dashed border-border/30 rounded-lg">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "list" ? (
        /* GRID LIST VIEW */
        <div className="terminal-card bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Price total</th>
                  <th className="py-3 px-4 font-semibold">Date Registered</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-dark/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{order.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground font-sans">{order.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[9px] tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                        {order.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold",
                          order.status === "pending" && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                          order.status === "confirmed" && "bg-primary/10 text-primary border border-primary/20",
                          order.status === "preparing" && "bg-primary/10 text-primary border border-primary/20",
                          order.status === "ready" && "bg-primary/20 text-primary-light border border-primary/30",
                          order.status === "completed" && "bg-ink-dark text-muted-foreground border border-border",
                          order.status === "cancelled" && "bg-pink/10 text-pink border border-pink/20"
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-numeral text-primary font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-4 text-[10px] text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status !== "completed" && order.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusTransition(order.id, order.status)}
                            className="inline-flex items-center gap-1 py-1 px-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-[10px] rounded uppercase font-semibold cursor-pointer"
                          >
                            Advance
                          </button>
                        )}
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="inline-flex items-center gap-1 py-1 px-2 border border-pink/30 hover:bg-pink/15 text-pink text-[10px] rounded uppercase font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TABLE MAP VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table: any) => {
            const activeStatuses = ["pending", "confirmed", "preparing", "ready"];
            const tableOrders = filteredOrders.filter(
              (o: any) => o.tableId === table.id && activeStatuses.includes(o.status)
            );
            const hasActiveOrders = tableOrders.length > 0;

            return (
              <div 
                key={table.id} 
                className={cn(
                  "terminal-card bg-card border p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all",
                  hasActiveOrders ? "border-primary/50 shadow-md" : "border-border/60"
                )}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                      Table Record
                    </span>
                    <span className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      hasActiveOrders ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                    )} />
                  </div>

                  <div className="py-4 text-center">
                    <h2 className="text-4xl font-bold font-mono text-primary tracking-tight">
                      {table.number}
                    </h2>
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block mt-1">
                      {hasActiveOrders ? `${tableOrders.length} active orders` : "table empty"}
                    </span>
                  </div>

                  {hasActiveOrders && (
                    <div className="space-y-2 border-t border-border/40 pt-3">
                      {tableOrders.map((order: any) => (
                        <div key={order.id} className="p-2 bg-ink-dark/30 rounded border border-border/40 flex items-center justify-between text-[10px] font-mono">
                          <div>
                            <span className="text-foreground font-semibold">#{order.orderNumber}</span>
                            <span className="text-[8px] text-muted-foreground block uppercase mt-0.5">
                              {order.status}
                            </span>
                          </div>
                          <button
                            onClick={() => handleStatusTransition(order.id, order.status)}
                            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all"
                          >
                            Next
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
