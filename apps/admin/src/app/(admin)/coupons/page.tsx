"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { ActionMenu } from "@/components/ui";
import { LoadingState, ErrorAlert, FormFooter } from "@/components/shared";
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
      setCoupons(data ?? []);
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
    { key: "code", label: "Code", sortable: true, render: (item: Coupon) => <span className="font-bold">{item.code}</span> },
    { 
      key: "value", 
      label: "Value",
      sortable: true,
      render: (item: Coupon) => (
        <span>{item.type === "percentage" ? `${item.value}%` : `LKR ${item.value.toLocaleString()}`}</span>
      )
    },
    { 
      key: "minOrderAmount", 
      label: "Min. Order",
      sortable: true,
      render: (item: Coupon) => (
        <span>LKR {item.minOrderAmount.toLocaleString()}</span>
      )
    },
    { 
      key: "usage", 
      label: "Usage",
      sortable: true,
      render: (item: Coupon) => (
        <span>{item.usedCount} / {item.usageLimit}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Coupon) => {
        const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date();
        const active = item.isActive && !isExpired;
        return (
          <Badge variant={active ? "success" : isExpired ? "danger" : "default"} className="font-bold text-xs uppercase tracking-wider">
            {active ? "Active" : isExpired ? "Expired" : "Inactive"}
          </Badge>
        );
      },
    },
    { 
      key: "expiresAt", 
      label: "Expires",
      sortable: true,
      render: (item: Coupon) => (
        <span>{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}</span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (item: Coupon) => {
        const actions = [
          {
            label: "Delete Coupon",
            onClick: () => handleDelete(item.id),
            icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
            destructive: true,
          },
        ];
        return <ActionMenu items={actions} />;
      },
    },
  ];

  const createBtn = (
    <Button variant="primary" className="text-xs" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4" />
      Create Coupon
    </Button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader title="Coupons" subtitle="Create and manage promotional coupons" action={createBtn} />
      
      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState label="Loading coupons..." />
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
              <Select
                label="Discount Type"
                name="type"
                options={[
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (LKR)" },
                ]}
              />
              <Input label="Discount Value" name="value" type="number" placeholder="20" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input label="Min. Order Value (LKR)" name="minOrder" type="number" placeholder="500" />
              <Input label="Usage Limit" name="usageLimit" type="number" placeholder="100" />
              <Input label="Expires On" name="expires" type="date" />
            </div>
          </div>

            <FormFooter onCancel={() => setIsAddModalOpen(false)} onSubmitLabel="Create Coupon" isLoading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
