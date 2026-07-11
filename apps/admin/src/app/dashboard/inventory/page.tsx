"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@juice-vibe/utils";
import { 
  Warehouse, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  RotateCw,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { Badge } from "@juice-vibe/ui";

// Mock local inventory client mutations since backend inventory REST endpoint is not predefined in services package
export default function InventoryLog() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("kg");
  const [minStockLevel, setMinStockLevel] = useState(0);
  const [supplier, setSupplier] = useState("");

  const [items, setItems] = useState<any[]>([
    { id: "inv-1", name: "Mango Pulp", quantity: 4.2, unit: "kg", minStockLevel: 5.0, supplier: "Ceylon Fruits Ltd", expiryDate: "2026-08-10" },
    { id: "inv-2", name: "Avocado Pulp", quantity: 6.5, unit: "kg", minStockLevel: 3.0, supplier: "Galle Organic Farms", expiryDate: "2026-08-15" },
    { id: "inv-3", name: "Fresh Strawberries", quantity: 12.0, unit: "kg", minStockLevel: 4.0, supplier: "Ceylon Fruits Ltd", expiryDate: "2026-07-20" },
    { id: "inv-4", name: "Full Cream Milk", quantity: 18.0, unit: "L", minStockLevel: 10.0, supplier: "Richlife Dairies", expiryDate: "2026-07-25" },
    { id: "inv-5", name: "Passion Fruit Extract", quantity: 1.8, unit: "L", minStockLevel: 2.0, supplier: "Galle Organic Farms", expiryDate: "2026-09-01" },
  ]);

  const filtered = items.filter((i: any) => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setQuantity(0);
    setUnit("kg");
    setMinStockLevel(0);
    setSupplier("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setMinStockLevel(item.minStockLevel);
    setSupplier(item.supplier);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      setItems((prev: any[]) => prev.map((i: any) => i.id === editingItem.id ? {
        ...i, name, quantity: Number(quantity), unit, minStockLevel: Number(minStockLevel), supplier
      } : i));
    } else {
      setItems((prev: any[]) => [...prev, {
        id: `inv-${Date.now()}`,
        name,
        quantity: Number(quantity),
        unit,
        minStockLevel: Number(minStockLevel),
        supplier,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      }]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to flag and delete this inventory item?")) {
      setItems((prev: any[]) => prev.filter((i: any) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Inventory Log
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            STOCK VOLUME INDEX & WAREHOUSE INVENTORY WATCHDOG
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs flex items-center">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search warehouse stock..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:border-primary/50"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
          >
            <Plus className="h-4 w-4 text-ink-dark" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Grid stock list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 terminal-card bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                  <th className="py-3 px-4 font-semibold">Stock Name</th>
                  <th className="py-3 px-4 font-semibold">Volume Count</th>
                  <th className="py-3 px-4 font-semibold">Safety Level</th>
                  <th className="py-3 px-4 font-semibold">Partner supplier</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((item: any) => {
                  const isLow = item.quantity <= item.minStockLevel;
                  return (
                    <tr key={item.id} className="hover:bg-ink-dark/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                        {item.name}
                        {isLow && (
                          <span className="h-2 w-2 rounded-full bg-pink animate-pulse" />
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-numeral">
                        <span className={cn("font-bold", isLow ? "text-pink" : "text-primary")}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-numeral text-muted-foreground">
                        Min {item.minStockLevel} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{item.supplier}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 border border-border hover:border-pink/40 text-muted-foreground hover:text-pink rounded cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alarm Side Panel */}
        <div className="space-y-6">
          <div className="terminal-card p-5 bg-card border border-border space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <AlertTriangle className="h-4 w-4 text-pink animate-pulse" />
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">
                Urgent Replenish Alarms
              </h2>
            </div>
            
            <div className="space-y-3 font-mono text-[10px]">
              {items.filter((i: any) => i.quantity <= i.minStockLevel).map((item: any) => (
                <div key={item.id} className="p-3 bg-pink/5 border border-pink/20 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-pink">{item.name}</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Supplier: {item.supplier}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-numeral text-pink font-semibold bg-pink/10 px-2 py-0.5 rounded">{item.quantity} {item.unit}</span>
                    <span className="text-[8px] text-muted-foreground block mt-1">Min threshold {item.minStockLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-ink-dark/30">
              <h2 className="text-sm font-bold text-foreground font-heading uppercase tracking-wider">
                {editingItem ? `Edit item // ${editingItem.name}` : "Create Stock Item"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Product Label</label>
                <input
                  type="text"
                  placeholder="Mango Pulp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Volume Count</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Unit bounds</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="L">L (Liters)</option>
                    <option value="pcs">pcs (Pieces)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Alert threshold (Minimum Level)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="5"
                  value={minStockLevel}
                  onChange={(e) => setMinStockLevel(Number(e.target.value))}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Supplier Partner</label>
                <input
                  type="text"
                  placeholder="Ceylon Fruits Ltd"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-ink-dark/30 text-muted-foreground text-xs font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
