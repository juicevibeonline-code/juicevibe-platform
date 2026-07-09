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
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-pink/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Coupons</h1>
            <p className="text-gray-500 font-medium mt-2">Create and manage promotional coupons</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold">
            <Plus className="w-5 h-5" />
            Create Coupon
          </button>
        </div>
      </div>
      <div className="px-2">
        <Table columns={columns} data={coupons} searchable />
      </div>
    </div>
  );
}
