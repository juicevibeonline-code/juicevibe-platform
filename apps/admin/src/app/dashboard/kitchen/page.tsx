"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posService } from "@juice-vibe/services";
import type { Order } from "@juice-vibe/types";
import { Button, Badge, LoadingSpinner } from "@juice-vibe/ui";
import { io } from "socket.io-client";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw,
  Coffee,
  Check,
  Flame,
  BellRing,
} from "lucide-react";

// Web Audio API Chime Generator (Zero external MP3 dependencies)
function playKdsChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Audio context may be restricted by browser policy before user interaction
  }
}

export default function KitchenDisplayPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"active" | "preparing" | "ready" | "all">("active");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [recalledOrders, setRecalledOrders] = useState<Order[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // 1. Tick every second for live aging timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Active KDS Orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["kds-orders"],
    queryFn: async () => {
      return await posService.getKdsOrders();
    },
    refetchInterval: 10000, // Fallback poll every 10s
  });

  // 3. WebSockets Real-time Listener
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.juicevibe.lk";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("newOrder", (order: Order) => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      if (soundEnabled) playKdsChime();
    });

    socket.on("kdsStatusChanged", () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    });

    socket.on("orderUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, soundEnabled]);

  // 4. Status Advance Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, nextStatus }: { orderId: string; nextStatus: string }) => {
      return await posService.updateKdsStatus(orderId, nextStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const handleBump = (order: Order, nextStatus: string) => {
    setRecalledOrders((prev) => [order, ...prev.slice(0, 4)]);
    updateStatusMutation.mutate({ orderId: order.id, nextStatus });
  };

  const handleRecall = (order: Order) => {
    const previousStatus = order.kitchenStatus === "ready" ? "preparing" : "new";
    updateStatusMutation.mutate({ orderId: order.id, nextStatus: previousStatus });
    setRecalledOrders((prev) => prev.filter((o) => o.id !== order.id));
  };

  const toggleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order: Order) => {
      const kStatus = order.kitchenStatus || "new";
      if (filter === "active") return kStatus === "new" || kStatus === "accepted" || kStatus === "preparing";
      if (filter === "preparing") return kStatus === "preparing";
      if (filter === "ready") return kStatus === "ready";
      return true;
    });
  }, [orders, filter]);

  // Timer helper
  const getElapsedSeconds = (createdAtStr: string) => {
    const createdTime = new Date(createdAtStr).getTime();
    return Math.max(0, Math.floor((now - createdTime) / 1000));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 overflow-hidden font-body select-none">
      {/* 1. TOP KITCHEN TOOLBAR */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Kitchen Display System (KDS)
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-zinc-400">Live Order Queue & Preparation Timers</p>
          </div>
        </div>

        {/* Filter Controls & Sound Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-800/80 p-1 rounded-xl border border-zinc-700">
            {[
              { id: "active", label: "Active Queue" },
              { id: "preparing", label: "In Prep" },
              { id: "ready", label: "Ready" },
              { id: "all", label: "All Tickets" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab.id
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-500"
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>

          {recalledOrders.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRecall(recalledOrders[0])}
              className="h-9 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recall Last (#{recalledOrders[0].orderNumber})
            </Button>
          )}
        </div>
      </header>

      {/* 2. MAIN TICKET CANVAS */}
      <main className="flex-1 p-6 overflow-y-auto bg-zinc-950">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-zinc-500 text-center">
            <Coffee className="h-16 w-16 mb-4 stroke-1 opacity-50 text-emerald-500" />
            <h3 className="text-lg font-bold text-zinc-300">Kitchen Queue is Clear!</h3>
            <p className="text-xs text-zinc-500 mt-1">All tickets have been prepped and completed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max">
            {filteredOrders.map((order: Order) => {
              const elapsedSec = getElapsedSeconds(order.createdAt);
              const isOverdue = elapsedSec >= 15 * 60; // > 15 mins
              const isWarning = elapsedSec >= 8 * 60 && !isOverdue; // 8 - 14 mins
              const kStatus = order.kitchenStatus || "new";

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                    isOverdue
                      ? "bg-red-950/20 border-red-500/60 shadow-red-900/20 ring-1 ring-red-500/40 animate-pulse"
                      : isWarning
                      ? "bg-amber-950/20 border-amber-500/40 shadow-amber-900/10"
                      : "bg-zinc-900/90 border-zinc-800"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`p-4 border-b flex items-start justify-between ${
                      isOverdue
                        ? "bg-red-500/10 border-red-500/30"
                        : isWarning
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-zinc-800/40 border-zinc-800"
                    }`}
                  >
                    <div>
                      <span className="font-mono text-base font-bold tracking-tight text-white block">
                        #{order.orderNumber}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.type === "dine_in"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : order.type === "delivery"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          }`}
                        >
                          {order.type === "dine_in" && order.table
                            ? `Table #${order.table.number}`
                            : order.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {order.customerName || "Guest"}
                        </span>
                      </div>
                    </div>

                    {/* Aging Timer Pill */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs font-bold ${
                        isOverdue
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                          : isWarning
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTimer(elapsedSec)}</span>
                    </div>
                  </div>

                  {/* Card Line Items */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-72">
                    {order.items?.map((item) => {
                      const isChecked = checkedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheckItem(item.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isChecked
                              ? "bg-zinc-800/20 border-zinc-800 opacity-40 line-through"
                              : "bg-zinc-800/40 border-zinc-700/60 hover:border-zinc-500"
                          }`}
                        >
                          <div
                            className={`h-7 w-7 rounded-lg font-mono text-sm font-bold flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "bg-zinc-700 text-zinc-400"
                                : "bg-emerald-500 text-zinc-950"
                            }`}
                          >
                            {item.quantity}x
                          </div>

                          <div className="flex-1">
                            <span className="text-sm font-bold text-white block">
                              {item.name}
                            </span>
                            {item.variant && (
                              <span className="text-[11px] text-zinc-400 block">
                                Size: {item.variant}
                              </span>
                            )}
                            {item.addOns && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(Array.isArray(item.addOns) ? item.addOns : []).map((addon: any, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700"
                                  >
                                    + {typeof addon === "string" ? addon : addon.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.notes && (
                              <p className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg mt-1.5 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {order.notes && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                        <span className="font-bold block">Order Note:</span>
                        {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center gap-2">
                    {kStatus === "new" || kStatus === "accepted" ? (
                      <Button
                        onClick={() => handleBump(order, "preparing")}
                        disabled={updateStatusMutation.isPending}
                        className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Flame className="h-4 w-4" />
                        Start Preparation
                      </Button>
                    ) : kStatus === "preparing" ? (
                      <Button
                        onClick={() => handleBump(order, "ready")}
                        disabled={updateStatusMutation.isPending}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Ready
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBump(order, "completed")}
                        disabled={updateStatusMutation.isPending}
                        className="w-full h-11 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Complete Ticket
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
