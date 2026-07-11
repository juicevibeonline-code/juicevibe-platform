"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Clock, GripVertical } from "lucide-react";
import { cn } from "@juice-vibe/utils";

import type { Order, OrderStatus } from "@juice-vibe/types";

interface KanbanBoardProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onOrderClick?: (order: Order) => void;
}

const columnStyles: Record<string, { header: string; dot: string; badge: string; emptyText: string }> = {
  pending: {
    header: "text-amber-800 dark:text-amber-400",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20",
    emptyText: "No pending orders",
  },
  confirmed: {
    header: "text-indigo-800 dark:text-indigo-400",
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20",
    emptyText: "No confirmed orders",
  },
  preparing: {
    header: "text-orange-800 dark:text-orange-400",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20",
    emptyText: "No orders in kitchen",
  },
  ready: {
    header: "text-blue-800 dark:text-blue-400",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20",
    emptyText: "No orders ready yet",
  },
  completed: {
    header: "text-emerald-800 dark:text-emerald-400",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20",
    emptyText: "No completed orders",
  },
};

const typeColors: Record<string, string> = {
  pickup: "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  delivery: "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  "dine-in": "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

const columnIds = ["pending", "confirmed", "preparing", "ready", "completed"] as const;

export function KanbanBoard({ orders, onStatusChange, onOrderClick }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    onStatusChange(draggableId, destination.droppableId as OrderStatus);
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
        {columnIds.map((columnId) => {
          const colOrders = orders.filter((o) => o.status === columnId);
          const style = columnStyles[columnId]!;

          return (
            <div key={columnId} className="min-w-[290px] w-[290px] flex flex-col snap-center">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                  <h3 className={cn("font-bold capitalize text-xs tracking-wider", style.header)}>{columnId}</h3>
                </div>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", style.badge)}>
                  {colOrders.length}
                </span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[550px] p-2.5 rounded-lg border flex flex-col gap-2 transition-colors",
                      snapshot.isDraggingOver
                        ? "bg-background border-dashed border-primary/50"
                        : "bg-background/50 border-border"
                    )}
                  >
                    {colOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{style.emptyText}</p>
                        <p className="text-[9px] text-muted mt-1">Drag and drop here</p>
                      </div>
                    ) : (
                      colOrders.map((order, index) => {
                        const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);
                        const displayType = order.type.replace("_", "-");
                        const orderTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const displayTotal = typeof order.total === "number" ? `LKR ${order.total.toLocaleString()}` : order.total;

                        return (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                onClick={() => onOrderClick?.(order)}
                                className={cn(
                                  "bg-card p-3 rounded-lg shadow-sm border border-border group cursor-pointer flex flex-col transition-colors",
                                  snapshot.isDragging 
                                    ? "shadow-md border-primary bg-background scale-[1.01] z-50" 
                                    : "hover:border-border dark:hover:border-border"
                                )}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider">#{order.orderNumber}</span>
                                    <span className="font-bold text-foreground text-xs mt-0.5 group-hover:text-primary transition-colors">{order.customerName}</span>
                                  </div>
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-muted hover:text-foreground transition-colors p-1 cursor-grab active:cursor-grabbing shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                </div>

                                {/* Product List */}
                                <div className="space-y-1 mb-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[10px] bg-background/50 px-2 py-0.5 rounded border border-border/10">
                                      <span className="text-muted-foreground font-medium truncate max-w-[170px]">{item.name}</span>
                                      <span className="text-primary font-bold">x{item.quantity}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted mb-3">
                                  <Clock className="w-3 h-3" />
                                  {orderTime}
                                  <span>·</span>
                                  <span>{totalQty} items</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-2.5 mt-auto">
                                  <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold capitalize border", typeColors[displayType])}>
                                    {displayType}
                                  </span>
                                  <span className="font-bold text-xs text-foreground">{displayTotal}</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
