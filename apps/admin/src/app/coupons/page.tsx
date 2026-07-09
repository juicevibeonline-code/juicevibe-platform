"use client";

import { useState } from "react";
import { Plus, Trash2, Gift } from "lucide-react";
import { Table } from "@/components/table";

const initialCoupons = [
  { id: "1", code: "WELCOME10", type: "percentage", value: "10%", minOrder: "LKR 500", usage: "45/100", status: "active", expires: "Dec 31, 2024" },
  { id: "2", code: "FREESHIP", type: "fixed", value: "LKR 150", minOrder: "LKR 1,000", usage: "23/50", status: "active", expires: "Mar 15, 2024" },
  { id: "3", code: "HAPPYHOUR", type: "percentage", value: "20%", minOrder: "LKR 300", usage: "67/200", status: "active", expires: "Jun 30, 2024" },
  { id: "4", code: "SUMMER20", type: "percentage", value: "20%", minOrder: "LKR 0", usage: "100/100", status: "expired", expires: "Feb 1, 2024" },
];

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
        item.status === "active" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
      }`}>
        {item.status}
      </span>
    ),
  },
  { key: "expires", label: "Expires" },
  {
    key: "actions",
    label: "",
    render: () => (
      <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    ),
  },
];

export default function CouponsPage() {
  const [coupons] = useState(initialCoupons);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-muted mt-1">Create and manage promotional coupons</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>
      <Table columns={columns} data={coupons} searchable />
    </div>
  );
}
