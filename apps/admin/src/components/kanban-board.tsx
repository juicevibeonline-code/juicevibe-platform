"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Clock, GripVertical } from "lucide-react";
import { cn } from "@juice-vibe/utils";

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: string;
  status: string;
  type: "pickup" | "delivery" | "dine-in";
  time: string;
}

interface KanbanBoardProps {
  orders: Order[];
  onStatusChange: (id: string, status: string) => void;
  onOrderClick?: (order: Order) => void;
}

const columnStyles: Record<string, { header: string; dot: string; badge: string; emptyText: string }> = {
  pending: {
    header: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-300",
    emptyText: "No pending orders",
  },
  preparing: {
    header: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300",
    emptyText: "No orders in preparation",
  },
  ready: {
    header: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300",
    emptyText: "No orders ready yet",
  },
  completed: {
    header: "text-primary-dark dark:text-primary",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary",
    emptyText: "No completed orders",
  },
};

const typeColors: Record<string, string> = {
  pickup: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  delivery: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  "dine-in": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const columnIds = ["pending", "preparing", "ready", "completed"] as const;

export function KanbanBoard({ orders, onStatusChange, onOrderClick }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    onStatusChange(draggableId, destination.droppableId);
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
        {columnIds.map((columnId) => {
          const colOrders = orders.filter((o) => o.status === columnId);
          const style = columnStyles[columnId]!;

          return (
            <div key={columnId} className="min-w-[310px] w-[310px] flex flex-col snap-center">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", style.dot)} />
                  <h3 className={cn("font-bold capitalize text-sm", style.header)}>{columnId}</h3>
                </div>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-black", style.badge)}>
                  {colOrders.length}
                </span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[500px] p-3 rounded-3xl transition-colors duration-300 border border-transparent",
                      snapshot.isDraggingOver
                        ? "bg-primary/[0.04] dark:bg-primary/[0.06] border-dashed border-primary/30"
                        : "bg-gray-50/60 dark:bg-white/[0.02] border-border/30"
                    )}
                  >
                    {colOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <p className="text-xs font-bold text-muted-foreground/60">{style.emptyText}</p>
                        <p className="text-[10px] text-muted-foreground/40 mt-1">Drag and drop here</p>
                      </div>
                    ) : (
                      colOrders.map((order, index) => {
                        const totalQty = order.items.reduce((acc, it) => acc + it.qty, 0);

                        return (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                onClick={() => onOrderClick?.(order)}
                                className={cn(
                                  "bg-white dark:bg-[#121914] p-4.5 rounded-2xl shadow-sm border border-border/50 mb-3 group cursor-pointer",
                                  snapshot.isDragging && "shadow-2xl border-primary/40 rotate-1 scale-[1.02] z-50 bg-white/90 dark:bg-[#162219]/90 backdrop-blur-md",
                                  !snapshot.isDragging && "hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                )}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{order.id}</span>
                                    <span className="font-extrabold text-foreground text-sm mt-0.5 group-hover:text-primary transition-colors">{order.customer}</span>
                                  </div>
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-gray-300 hover:text-gray-500 transition-colors p-1 cursor-grab active:cursor-grabbing shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                </div>

                                {/* Rich Order Product List Tags */}
                                <div className="space-y-1 mb-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                      <span className="text-muted-foreground font-semibold truncate max-w-[170px]">{item.name}</span>
                                      <span className="text-primary-dark dark:text-primary font-bold">x{item.qty}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2 text-xs font-semibold text-muted mb-3.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {order.time}
                                  <span>·</span>
                                  <span>{totalQty} items</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                                  <span className={cn("px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize", typeColors[order.type])}>
                                    {order.type}
                                  </span>
                                  <span className="font-black text-sm text-foreground">{order.total}</span>
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
