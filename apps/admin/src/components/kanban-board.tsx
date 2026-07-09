"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Clock, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { cn } from "@juice-vibe/utils";

const initialData = {
  columns: {
    pending: {
      id: "pending",
      title: "Pending",
      orderIds: ["#JV-003"],
    },
    preparing: {
      id: "preparing",
      title: "Preparing",
      orderIds: ["#JV-002"],
    },
    ready: {
      id: "ready",
      title: "Ready",
      orderIds: ["#JV-004"],
    },
    completed: {
      id: "completed",
      title: "Completed",
      orderIds: ["#JV-001"],
    }
  },
  orders: {
    "#JV-001": { id: "#JV-001", customer: "Priya Sharma", items: 3, total: "LKR 1,200", status: "completed", type: "pickup", time: "2 min ago" },
    "#JV-002": { id: "#JV-002", customer: "Rahul Verma", items: 2, total: "LKR 850", status: "preparing", type: "delivery", time: "15 min ago" },
    "#JV-003": { id: "#JV-003", customer: "Ananya Patel", items: 1, total: "LKR 350", status: "pending", type: "dine-in", time: "28 min ago" },
    "#JV-004": { id: "#JV-004", customer: "Arjun Nair", items: 4, total: "LKR 2,100", status: "ready", type: "pickup", time: "45 min ago" },
  },
  columnOrder: ["pending", "preparing", "ready", "completed"],
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish = data.columns[destination.droppableId as keyof typeof data.columns];

    // Moving within the same list
    if (start === finish) {
      const newOrderIds = Array.from(start.orderIds);
      newOrderIds.splice(source.index, 1);
      newOrderIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, orderIds: newOrderIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving from one list to another
    const startOrderIds = Array.from(start.orderIds);
    startOrderIds.splice(source.index, 1);
    const newStart = { ...start, orderIds: startOrderIds };

    const finishOrderIds = Array.from(finish.orderIds);
    finishOrderIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, orderIds: finishOrderIds };

    // Update the order's status visually immediately
    const updatedOrders = { ...data.orders };
    (updatedOrders as any)[draggableId].status = finish.id;

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
      orders: updatedOrders,
    });
  };

  if (!mounted) return null; // Prevent SSR hydration mismatch for DND

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId as keyof typeof data.columns];
          const orders = column.orderIds.map((id) => (data.orders as any)[id]);

          return (
            <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col snap-center">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground capitalize">{column.title}</h3>
                  <span className="bg-gray-100 dark:bg-white/10 text-muted px-2 py-0.5 rounded-full text-xs font-bold">
                    {orders.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[500px] p-3 rounded-3xl transition-colors duration-300",
                      snapshot.isDraggingOver ? "bg-gray-100/80 dark:bg-white/5 border-2 border-dashed border-primary/30" : "bg-gray-50/50 dark:bg-transparent"
                    )}
                  >
                    {orders.map((order, index) => (
                      <Draggable key={order.id} draggableId={order.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onOrderClick?.(order)}
                            className={cn(
                              "bg-white dark:bg-[#151515] p-4 rounded-2xl shadow-sm border border-border/50 mb-3 group cursor-grab active:cursor-grabbing",
                              snapshot.isDragging && "shadow-xl border-primary/40 rotate-2 scale-105 z-50",
                              !snapshot.isDragging && "hover:border-primary/20 hover:shadow-md transition-all"
                            )}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-muted mb-1">{order.id}</span>
                                <span className="font-bold text-foreground">{order.customer}</span>
                              </div>
                              <button className="text-gray-400 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-medium text-muted mb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {order.time}
                              </span>
                              <span>•</span>
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
                    ))}
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
