"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { orderService } from "@juice-vibe/services";
import { Search, Loader2, MapPin, Clock, Coffee, QrCode } from "lucide-react";
import { formatPrice } from "@juice-vibe/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await orderService.trackOrder(orderNumber.trim().toUpperCase());
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ["pending", "confirmed", "preparing", "ready"];
    return steps.indexOf(status);
  };

  const getStepStatus = (currentStatus: string, stepIndex: number) => {
    const currentStepIndex = getStatusStep(currentStatus);
    if (currentStatus === "cancelled") return "cancelled";
    if (currentStatus === "completed") return "completed";
    if (currentStepIndex === stepIndex) return "active";
    if (currentStepIndex > stepIndex) return "completed";
    return "pending";
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-light-bg py-12 px-4">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Tracking Search Input Card */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-heading text-3xl font-bold text-dark-green">Track Your Order</h1>
              <p className="text-sm text-gray-500">
                Enter your order identifier number to view real-time status indices.
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. JV-XXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase font-mono"
                required
              />
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Track
              </button>
            </form>

            {error && (
              <p className="text-center text-xs font-mono text-pink bg-pink/5 border border-pink/10 rounded-xl p-3">
                {error}
              </p>
            )}
          </div>

          {/* Tracking Result Card */}
          {order && (
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Order Registered
                  </span>
                  <h2 className="font-mono text-2xl font-bold text-dark-green tracking-wide">
                    #{order.orderNumber}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Status
                  </span>
                  <div className="font-mono text-xs font-bold uppercase text-primary tracking-wide">
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== "cancelled" && order.status !== "completed" && (
                <div className="grid grid-cols-4 gap-2 relative pt-6">
                  {/* Progress Line */}
                  <div className="absolute left-1/8 right-1/8 top-3 h-0.5 bg-gray-100 z-0">
                    <div 
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                    />
                  </div>

                  {["Placed", "Confirmed", "Preparing", "Ready"].map((label, idx) => {
                    const stepStatus = getStepStatus(order.status, idx);
                    return (
                      <div key={label} className="flex flex-col items-center text-center space-y-2 relative z-10">
                        <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                          stepStatus === "completed" 
                            ? "bg-primary text-white border-primary" 
                            : stepStatus === "active" 
                            ? "bg-white text-primary border-primary ring-4 ring-primary/10" 
                            : "bg-white text-gray-400 border-gray-200"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wide ${
                          stepStatus === "active" ? "text-primary" : "text-gray-500"
                        }`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {order.status === "completed" && (
                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 text-center space-y-2">
                  <h3 className="font-heading text-lg font-bold text-dark-green">Order Delivered!</h3>
                  <p className="text-xs text-gray-500">
                    Thank you for dining with Juice Vibe. We hope you enjoyed your vibes!
                  </p>
                </div>
              )}

              {order.status === "cancelled" && (
                <div className="rounded-2xl bg-pink/5 border border-pink/10 p-5 text-center space-y-2">
                  <h3 className="font-heading text-lg font-bold text-pink">Order Cancelled</h3>
                  <p className="text-xs text-gray-500">
                    This transaction order has been cancelled. Please contact staff for details.
                  </p>
                </div>
              )}

              {/* Order Info & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-gray-100">
                <div className="space-y-4">
                  <h3 className="font-heading text-sm font-bold text-dark-green uppercase tracking-wide">
                    Delivery Details
                  </h3>
                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold">Type:</span>
                      <span className="uppercase">{order.type}</span>
                    </div>
                    {order.table && (
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold">Table:</span>
                        <span>Table {order.table.number}</span>
                      </div>
                    )}
                    {order.deliveryAddress && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold">Address:</span>
                        <span>{(order.deliveryAddress as any).address}</span>
                      </div>
                    )}
                    {order.estimatedReadyTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold">Est. Ready:</span>
                        <span>{new Date(order.estimatedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading text-sm font-bold text-dark-green uppercase tracking-wide">
                    Summary Items
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-xs text-gray-600">
                        <span>{item.name} <span className="font-mono font-bold text-primary">x{item.quantity}</span></span>
                        <span className="font-mono">LKR {formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-2 flex justify-between font-mono font-bold text-dark-green text-sm">
                      <span>Total Paid</span>
                      <span className="text-primary">LKR {formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
