"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { couponService } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";
import type { Coupon } from "@juice-vibe/types";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await couponService.getCoupons();
      setCoupons(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    const prevCoupons = [...coupons];
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await couponService.deleteCoupon(id);
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      setCoupons(prevCoupons);
      toast({ type: "error", title: "Delete failed", message: "Failed to delete coupon from server." });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    const value = Number(formData.get("value"));
    const type = formData.get("type") as "percentage" | "fixed";
    const minOrderAmount = Number(formData.get("minOrder") || 0);
    const usageLimit = Number(formData.get("usageLimit") || 100);
    const expiresAt = formData.get("expires") as string;

    try {
      setSubmitting(true);
      await couponService.createCoupon({
        code: code.toUpperCase(),
        type,
        value,
        minOrderAmount,
        usageLimit,
        expiresAt: expiresAt || undefined,
      });

      await fetchCoupons();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Create failed", message: err.message || "Failed to create coupon." });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "code", label: "Code", render: (item: Coupon) => <span className="font-bold">{item.code}</span> },
    { 
      key: "value", 
      label: "Value",
      render: (item: Coupon) => (
        <span>{item.type === "percentage" ? `${item.value}%` : `LKR ${item.value.toLocaleString()}`}</span>
      )
    },
    { 
      key: "minOrderAmount", 
      label: "Min. Order",
      render: (item: Coupon) => (
        <span>LKR {item.minOrderAmount.toLocaleString()}</span>
      )
    },
    { 
      key: "usage", 
      label: "Usage",
      render: (item: Coupon) => (
        <span>{item.usedCount} / {item.usageLimit}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (item: Coupon) => {
        const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date();
        const active = item.isActive && !isExpired;
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
            active ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-background text-muted border border-border dark:text-muted"
          }`}>
            {active ? "Active" : isExpired ? "Expired" : "Inactive"}
          </span>
        );
      },
    },
    { 
      key: "expiresAt", 
      label: "Expires",
      render: (item: Coupon) => (
        <span>{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}</span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Coupon) => (
        <button 
          onClick={() => handleDelete(item.id)}
          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
          title="Delete Coupon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const createBtn = (
    <button 
      onClick={() => setIsAddModalOpen(true)} 
      className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold text-xs shadow-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      Create Coupon
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader title="Coupons" subtitle="Create and manage promotional coupons" accentColor="pink" action={createBtn} />
      
      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading coupons...</span>
        </div>
      ) : (
        <div>
          <Table columns={columns} data={coupons} searchable />
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Promo Coupon" size="md">
        <form className="space-y-4 text-xs" onSubmit={handleCreateCoupon}>
          <div className="space-y-3">
            <Input label="Coupon Code" name="code" placeholder="e.g. PROMO20" required />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground mb-1">Discount Type</label>
                <select 
                  name="type" 
                  className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (LKR)</option>
                </select>
              </div>
              <Input label="Discount Value" name="value" type="number" placeholder="20" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input label="Min. Order Value (LKR)" name="minOrder" type="number" placeholder="500" />
              <Input label="Usage Limit" name="usageLimit" type="number" placeholder="100" />
              <Input label="Expires On" name="expires" type="date" />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={submitting}>Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
