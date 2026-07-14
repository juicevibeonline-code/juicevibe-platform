"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "@juice-vibe/services";
import { formatDate, formatPrice } from "@juice-vibe/utils";
import { Tag, Plus, Trash2, Loader2, Percent, DollarSign } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@juice-vibe/ui";

export default function CouponsManagement() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState("");

  // Fetch Coupons
  const { data: coupons = [], isLoading } = useQuery<any[]>({
    queryKey: ["coupons"],
    queryFn: () => couponService.getCoupons(),
    retry: 1,
  });

  // Create Coupon Mutation
  const createCouponMutation = useMutation({
    mutationFn: (input: any) => couponService.createCoupon(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      // Reset Form
      setCode("");
      setValue(0);
      setMinOrderAmount(0);
      setMaxDiscount(0);
      setUsageLimit(100);
      setExpiresAt("");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to create coupon");
    },
  });

  // Delete Coupon Mutation
  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => couponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to delete coupon");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      alert("Please enter a coupon code");
      return;
    }
    if (value <= 0) {
      alert("Please enter a valid coupon value");
      return;
    }

    createCouponMutation.mutate({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || undefined,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: Number(usageLimit) || undefined,
      expiresAt: expiresAt || undefined,
    });
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      deleteCouponMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Coupon Promotions
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            MANAGE CUSTOMER DISCOUNT PROMOTIONS & MARKETING COUPONS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form */}
        <div className="terminal-card bg-card border border-border p-5 h-fit">
          <h3 className="text-sm font-bold text-foreground font-heading mb-4">Create New Coupon</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                Promo Code
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER25"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50 uppercase"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Coupon Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Price (LKR)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Discount Value
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={value || ""}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                  min="0.01"
                  step="any"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Min Order Amount
                </label>
                <input
                  type="number"
                  placeholder="LKR 0"
                  value={minOrderAmount || ""}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Max Discount (LKR)
                </label>
                <input
                  type="number"
                  placeholder="No Limit"
                  value={maxDiscount || ""}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Usage Limit
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={usageLimit || ""}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={createCouponMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-wider h-10 animate-glow"
            >
              {createCouponMutation.isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-3.5 w-3.5" />
              )}
              Create Coupon
            </Button>
          </form>
        </div>

        {/* Coupons Directory */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
              Fetching promotional indices...
            </div>
          ) : coupons.length === 0 ? (
            <div className="terminal-card p-12 text-center border border-border bg-card">
              <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-bold text-foreground font-heading">No Active Coupons</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Deploy your first marketing campaign coupon.
              </p>
            </div>
          ) : (
            <div className="terminal-card bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                      <th className="py-3 px-4 font-semibold">Code</th>
                      <th className="py-3 px-4 font-semibold">Type & Value</th>
                      <th className="py-3 px-4 font-semibold">Limits & Usage</th>
                      <th className="py-3 px-4 font-semibold">Expiry Date</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {coupons.map((coupon: any) => {
                      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                      const limitReached = coupon.usedCount >= coupon.usageLimit;
                      const active = coupon.isActive && !isExpired && !limitReached;

                      return (
                        <tr key={coupon.id} className="hover:bg-ink-dark/20 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-primary text-sm font-mono uppercase tracking-wider">
                            {coupon.code}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="flex items-center gap-1">
                              {coupon.type === "percentage" ? (
                                <>
                                  <Percent className="h-3 w-3 text-emerald-400" />
                                  <span className="text-foreground font-bold">{coupon.value}%</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-emerald-400">LKR</span>
                                  <span className="text-foreground font-bold">{formatPrice(coupon.value)}</span>
                                </>
                              )}
                            </span>
                            <span className="text-[9px] text-muted-foreground block mt-0.5 uppercase">
                              Min order: LKR {coupon.minOrderAmount}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-foreground block">
                              Used: <span className="font-bold">{coupon.usedCount}</span> / {coupon.usageLimit}
                            </span>
                            <div className="w-full bg-ink-dark h-1 rounded-full overflow-hidden mt-1 max-w-[100px]">
                              <div
                                className="bg-primary h-full"
                                style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {coupon.expiresAt ? (
                              <span className={isExpired ? "text-pink font-semibold" : "text-muted-foreground"}>
                                {formatDate(coupon.expiresAt)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60 uppercase">Never Expires</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(coupon.id, coupon.code)}
                              className="h-8 px-2 text-pink hover:bg-pink/10 hover:text-pink font-mono text-[10px]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
