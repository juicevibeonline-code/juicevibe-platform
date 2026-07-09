"use client";

import { useState } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import { Table } from "@/components/table";

const initialCustomers = [
  { id: "1", name: "Priya Sharma", email: "priya@example.com", phone: "+94 71 234 5678", orders: 12, spent: "LKR 8,500", joined: "Jan 2024" },
  { id: "2", name: "Rahul Verma", email: "rahul@example.com", phone: "+94 72 345 6789", orders: 8, spent: "LKR 5,200", joined: "Mar 2024" },
  { id: "3", name: "Ananya Patel", email: "ananya@example.com", phone: "+94 77 456 7890", orders: 5, spent: "LKR 3,100", joined: "Jun 2024" },
  { id: "4", name: "Arjun Nair", email: "arjun@example.com", phone: "+94 76 567 8901", orders: 3, spent: "LKR 2,400", joined: "Aug 2024" },
  { id: "5", name: "Neha Gupta", email: "neha@example.com", phone: "+94 71 678 9012", orders: 15, spent: "LKR 12,000", joined: "Feb 2024" },
];

const columns = [
  {
    key: "name",
    label: "Customer",
    render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-dark">{item.name[0]}</span>
        </div>
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    label: "Contact",
    render: (item: any) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs"><Mail className="w-3 h-3 text-muted" />{item.email}</div>
        <div className="flex items-center gap-1.5 text-xs"><Phone className="w-3 h-3 text-muted" />{item.phone}</div>
      </div>
    ),
  },
  {
    key: "orders",
    label: "Orders",
    render: (item: any) => (
      <div className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-muted" />{item.orders}</div>
    ),
  },
  { key: "spent", label: "Total Spent" },
  { key: "joined", label: "Joined" },
];

export default function CustomersPage() {
  const [customers] = useState(initialCustomers);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-pink/20 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Customers</h1>
          <p className="text-muted font-medium mt-2">View and manage your customer base</p>
        </div>
      </div>
      <div className="px-2">
        <Table columns={columns} data={customers} searchable />
      </div>
    </div>
  );
}
