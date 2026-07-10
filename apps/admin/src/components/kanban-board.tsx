"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Clock, GripVertical } from "lucide-react";
import { cn } from "@juice-vibe/utils";

const initialData = {
  columns: {
    pending: { id: "pending", title: "Pending", orderIds: ["#JV-003"] },
    preparing: { id: "preparing", title: "Preparing", orderIds: ["#JV-002"] },
    ready: { id: "ready", title: "Ready", orderIds: ["#JV-004"] },
    completed: { id: "completed", title: "Completed", orderIds: ["#JV-001"] },
  },
  orders: {
    "#JV-001": { id: "#JV-001", customer: "Priya Sharma", items: 3, total: "LKR 1,200", status: "completed", type: "pickup", time: "2 min ago" },
    "#JV-002": { id: "#JV-002", customer: "Rahul Verma", items: 2, total: "LKR 850", status: "preparing", type: "delivery", time: "15 min ago" },
    "#JV-003": { id: "#JV-003", customer: "Ananya Patel", items: 1, total: "LKR 350", status: "pending", type: "dine-in", time: "28 min ago" },
    "#JV-004": { id: "#JV-004", customer: "Arjun Nair", items: 4, total: "LKR 2,100", status: "ready", type: "pickup", time: "45 min ago" },
  },
  columnOrder: ["pending", "preparing", "ready", "completed"] as const,
};

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

interface KanbanBoardProps {
  onOrderClick?: (order: any) => void;
}

export function KanbanBoard({ onOrderClick }: KanbanBoardProps) {
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish = data.columns[destination.droppableId as keyof typeof data.columns];

    if (start === finish) {
      const newOrderIds = Array.from(start.orderIds);
      newOrderIds.splice(source.index, 1);
      newOrderIds.splice(destination.index, 0, draggableId);
      setData({ ...data, columns: { ...data.columns, [start.id]: { ...start, orderIds: newOrderIds } } });
      return;
    }

    const startOrderIds = Array.from(start.orderIds);
    startOrderIds.splice(source.index, 1);
    const finishOrderIds = Array.from(finish.orderIds);
    finishOrderIds.splice(destination.index, 0, draggableId);

    const updatedOrders = { ...data.orders };
    (updatedOrders as any)[draggableId].status = finish.id;

    setData({
      ...data,
      columns: {
        ...data.columns,
        [start.id]: { ...start, orderIds: startOrderIds },
        [finish.id]: { ...finish, orderIds: finishOrderIds },
      },
      orders: updatedOrders,
    });
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const orders = column.orderIds.map((id) => (data.orders as any)[id]);
          const style = columnStyles[column.id];

          return (
            <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col snap-center">
              {/* Color-coded column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  <h3 className={`font-bold capitalize text-sm ${style.header}`}>{column.title}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${style.badge}`}>
                  {orders.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[460px] p-3 rounded-3xl transition-colors duration-300",
                      snapshot.isDraggingOver
                        ? "bg-gray-100/80 dark:bg-white/5 border-2 border-dashed border-primary/30"
                        : "bg-gray-50/60 dark:bg-white/[0.02] border border-border/30"
                    )}
                  >
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-xs font-semibold text-muted/60">{style.emptyText}</p>
                        <p className="text-xs text-muted/40 mt-1">Drag cards here</p>
                      </div>
                    ) : (
                      orders.map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              onClick={() => onOrderClick?.(order)}
                              className={cn(
                                "bg-white dark:bg-[#151515] p-4 rounded-2xl shadow-sm border border-border/50 mb-3 group cursor-grab active:cursor-grabbing",
                                snapshot.isDragging && "shadow-2xl border-primary/40 rotate-1 scale-[1.02] z-50",
                                !snapshot.isDragging && "hover:border-primary/20 hover:shadow-md transition-all"
                              )}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-muted mb-0.5">{order.id}</span>
                                  <span className="font-bold text-foreground text-sm">{order.customer}</span>
                                </div>
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-300 hover:text-gray-500 transition-colors p-0.5 cursor-grab"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-medium text-muted mb-3">
                                <Clock className="w-3.5 h-3.5" />
                                {order.time}
                                <span>·</span>
                                <span>{order.items} items</span>
                              </div>

                              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold capitalize", typeColors[order.type])}>
                                  {order.type}
                                </span>
                                <span className="font-black text-sm text-foreground">{order.total}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
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
