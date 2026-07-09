"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Table } from "@/components/table";

const initialItems = [
  { id: "1", name: "Chocolate Milkshake", category: "Milkshakes", price: "LKR 300", status: "active", popular: true, stock: "In Stock" },
  { id: "2", name: "Mango Smoothie", category: "Smoothies", price: "LKR 350", status: "active", popular: true, stock: "In Stock" },
  { id: "3", name: "Fresh Orange Juice", category: "Fresh Juices", price: "LKR 250", status: "active", popular: false, stock: "In Stock" },
  { id: "4", name: "Classic Lassi", category: "Lassi", price: "LKR 200", status: "inactive", popular: false, stock: "Out of Stock" },
  { id: "5", name: "Virgin Mojito", category: "Mocktails", price: "LKR 400", status: "active", popular: true, stock: "In Stock" },
];

const columns = [
  { key: "name", label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        item.status === "active" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
      }`}>
        {item.status === "active" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        {item.status}
      </span>
    ),
  },
  {
    key: "popular",
    label: "Popular",
    render: (item: any) => item.popular ? <Star className="w-4 h-4 text-yellow fill-yellow" /> : null,
  },
  { key: "stock", label: "Stock" },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    ),
  },
];

export default function MenuPage() {
  const [items] = useState(initialItems);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Menu Management</h1>
            <p className="text-gray-500 font-medium mt-2">Manage your menu items, prices, and categories</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold">
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap px-2">
        {["All", "Milkshakes", "Fresh Juices", "Smoothies", "Mocktails", "Lassi", "Tea", "Coffee"].map((cat) => (
          <button key={cat} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
            cat === "All" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]" : "bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 border border-white/80 shadow-sm"
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={items} searchable />
      </div>
    </div>
  );
}
