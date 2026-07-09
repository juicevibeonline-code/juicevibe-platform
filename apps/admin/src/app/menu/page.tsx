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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted mt-1">Manage your menu items and categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Milkshakes", "Fresh Juices", "Smoothies", "Mocktails", "Lassi", "Tea", "Coffee"].map((cat) => (
          <button key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            cat === "All" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-border"
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <Table columns={columns} data={items} searchable />
    </div>
  );
}
