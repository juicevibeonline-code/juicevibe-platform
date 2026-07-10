"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Table } from "@/components/table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

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
        item.status === "active" ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
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
        <button className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
      </div>
    ),
  },
];

export default function MenuPage() {
  const [items] = useState(initialItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const addBtn = (
    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
      <Plus className="w-5 h-5" />
      Add New Item
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader title="Menu Management" subtitle="Manage your menu items, prices, and categories" accentColor="primary" action={addBtn} />

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap px-2">
        {["All", "Milkshakes", "Fresh Juices", "Smoothies", "Mocktails", "Lassi", "Tea", "Coffee"].map((cat) => (
          <button key={cat} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
            cat === "All" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]" : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-transparent dark:border-white/10 shadow-sm"
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="px-2">
        <Table columns={columns} data={items} searchable />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Item" size="md">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          {/* Image Upload Placeholder */}
          <div className="w-full h-40 rounded-2xl border-2 border-dashed border-border/60 bg-gray-50/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-900/70 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-black/20 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-bold text-muted group-hover:text-primary transition-colors">Upload Image</span>
          </div>

          <div className="space-y-4">
            <Input label="Item Name" placeholder="e.g. Avocado Magic Smoothie" required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (LKR)" type="number" placeholder="450" required />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
                <select className="flex h-12 w-full rounded-xl border border-transparent bg-white/60 dark:bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-300 focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)] appearance-none">
                  <option value="milkshakes">Milkshakes</option>
                  <option value="smoothies">Smoothies</option>
                  <option value="fresh-juices">Fresh Juices</option>
                  <option value="lassi">Lassi</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-xl border border-transparent bg-white/60 dark:bg-white/5 px-4 py-3 text-sm text-foreground shadow-sm transition-all duration-300 focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)] resize-none"
                placeholder="Brief description of the item..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Save Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
