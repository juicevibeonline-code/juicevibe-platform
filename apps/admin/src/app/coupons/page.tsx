"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialCoupons = [
  { id: "1", code: "WELCOME10", type: "percentage", value: "10%", minOrder: "LKR 500", usage: "45/100", status: "active", expires: "Dec 31, 2024" },
  { id: "2", code: "FREESHIP", type: "fixed", value: "LKR 150", minOrder: "LKR 1,000", usage: "23/50", status: "active", expires: "Mar 15, 2024" },
  { id: "3", code: "HAPPYHOUR", type: "percentage", value: "20%", minOrder: "LKR 300", usage: "67/200", status: "active", expires: "Jun 30, 2024" },
  { id: "4", code: "SUMMER20", type: "percentage", value: "20%", minOrder: "LKR 0", usage: "100/100", status: "expired", expires: "Feb 1, 2024" },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    const value = formData.get("value") as string;
    const type = formData.get("type") as string;
    const minOrder = formData.get("minOrder") as string;
    const expires = formData.get("expires") as string;

    const formattedValue = type === "percentage" ? `${value}%` : `LKR ${value}`;

    const newCoupon = {
      id: String(coupons.length + 1),
      code: code.toUpperCase(),
      type,
      value: formattedValue,
      minOrder: minOrder ? `LKR ${minOrder}` : "LKR 0",
      usage: "0/100",
      status: "active",
      expires: expires || "Dec 31, 2024",
    };

    setCoupons([newCoupon, ...coupons]);
    setIsAddModalOpen(false);
  };

  const columns = [
    { key: "code", label: "Code" },
    { key: "value", label: "Value" },
    { key: "minOrder", label: "Min. Order" },
    { key: "usage", label: "Usage" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          item.status === "active" ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
        }`}>
          {item.status}
        </span>
      ),
    },
    { key: "expires", label: "Expires" },
    {
      key: "actions",
      label: "",
      render: (item: any) => (
        <button 
          onClick={() => handleDelete(item.id)}
          className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer"
          title="Delete Coupon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const createBtn = (
    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
      <Plus className="w-5 h-5" />
      Create Coupon
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader title="Coupons" subtitle="Create and manage promotional coupons" accentColor="pink" action={createBtn} />
      
      <div className="px-2">
        <Table columns={columns} data={coupons} searchable />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Promo Coupon" size="md">
        <form className="space-y-6" onSubmit={handleCreateCoupon}>
          <div className="space-y-4">
            <Input label="Coupon Code" name="code" placeholder="e.g. PROMO20" required />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Discount Type</label>
                <select name="type" className="flex h-12 w-full rounded-xl border border-transparent bg-white/60 dark:bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-300 focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (LKR)</option>
                </select>
              </div>
              <Input label="Discount Value" name="value" type="number" placeholder="20" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Min. Order Value (LKR)" name="minOrder" type="number" placeholder="500" />
              <Input label="Expires On" name="expires" type="date" required />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
