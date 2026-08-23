"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService, menuService } from "@juice-vibe/services";
import type { InventoryItem, MenuItem, Recipe, InventoryTransaction } from "@juice-vibe/types";
import { Button, Input, Modal, LoadingSpinner, Badge } from "@juice-vibe/ui";
import { 
  Warehouse, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Scale,
  Sparkles,
  Check
} from "lucide-react";

export default function InventoryDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"items" | "recipes" | "inward" | "ledger">("items");
  const [search, setSearch] = useState("");

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [recipeIngredients, setRecipeIngredients] = useState<{ inventoryItemId: string; quantity: number; wastageFactor: number }[]>([]);
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);

  // Inward / Stock Movement Form State
  const [inwardItemId, setInwardItemId] = useState("");
  const [inwardType, setInwardType] = useState<"PURCHASE" | "WASTAGE" | "ADJUSTMENT" | "RETURN">("PURCHASE");
  const [inwardQty, setInwardQty] = useState(1);
  const [inwardUnitCost, setInwardUnitCost] = useState(0);
  const [inwardRef, setInwardRef] = useState("");
  const [inwardNotes, setInwardNotes] = useState("");

  // Item Form State
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("kg");
  const [minStockLevel, setMinStockLevel] = useState(5);
  const [supplier, setSupplier] = useState("");

  // 1. Fetch Inventory Items
  const { data: items = [], isLoading: isItemsLoading } = useQuery<InventoryItem[]>({
    queryKey: ["inventory-items"],
    queryFn: () => inventoryService.getItems(),
  });

  // 2. Fetch Menu Items (for recipes)
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["menu-items-for-recipes"],
    queryFn: () => menuService.getMenuItems(),
  });

  // 3. Fetch Recipes
  const { data: recipes = [], isLoading: isRecipesLoading } = useQuery<Recipe[]>({
    queryKey: ["inventory-recipes"],
    queryFn: () => inventoryService.getRecipes(),
  });

  // 4. Fetch Transactions
  const { data: transactions = [], isLoading: isTxLoading } = useQuery<InventoryTransaction[]>({
    queryKey: ["inventory-transactions"],
    queryFn: () => inventoryService.getTransactions(),
  });

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: (input: any) => inventoryService.createItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setIsItemModalOpen(false);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => inventoryService.updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setIsItemModalOpen(false);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    },
  });

  const saveRecipeMutation = useMutation({
    mutationFn: (input: any) => inventoryService.saveRecipe(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-recipes"] });
      setIsRecipeModalOpen(false);
    },
  });

  const stockMovementMutation = useMutation({
    mutationFn: (input: any) => inventoryService.recordStockMovement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-transactions"] });
      setIsInwardModalOpen(false);
      setInwardQty(1);
      setInwardUnitCost(0);
      setInwardRef("");
      setInwardNotes("");
    },
  });

  // Handlers
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setName("");
    setQuantity(0);
    setUnit("kg");
    setMinStockLevel(5);
    setSupplier("");
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setMinStockLevel(item.minStockLevel);
    setSupplier(item.supplier || "");
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateItemMutation.mutate({
        id: editingItem.id,
        input: { name, quantity, unit, minStockLevel, supplier },
      });
    } else {
      createItemMutation.mutate({ name, quantity, unit, minStockLevel, supplier });
    }
  };

  const handleOpenRecipeModal = (menuItemId?: string) => {
    const targetId = menuItemId || (menuItems[0]?.id || "");
    setSelectedMenuItemId(targetId);

    const existingRecipe = recipes.find((r) => r.menuItemId === targetId);
    if (existingRecipe && existingRecipe.ingredients) {
      setRecipeIngredients(
        existingRecipe.ingredients.map((ing) => ({
          inventoryItemId: ing.inventoryItemId,
          quantity: ing.quantity,
          wastageFactor: ing.wastageFactor || 0,
        }))
      );
    } else {
      setRecipeIngredients([]);
    }
    setIsRecipeModalOpen(true);
  };

  const handleAddIngredientRow = () => {
    if (items.length === 0) return;
    setRecipeIngredients((prev) => [
      ...prev,
      { inventoryItemId: items[0].id, quantity: 0.1, wastageFactor: 0.05 },
    ]);
  };

  const handleSaveRecipe = () => {
    if (!selectedMenuItemId || recipeIngredients.length === 0) return;
    saveRecipeMutation.mutate({
      menuItemId: selectedMenuItemId,
      yieldServings: 1.0,
      ingredients: recipeIngredients,
    });
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.supplier && i.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-body">
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display flex items-center gap-2.5">
            <Warehouse className="h-7 w-7 text-primary" />
            Inventory & Recipe Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Raw material tracking, automated recipe deductions, purchase orders & ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (items.length > 0) setInwardItemId(items[0].id);
              setIsInwardModalOpen(true);
            }}
            className="text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
          >
            <ArrowDownRight className="h-4 w-4" />
            Stock Inward / PO
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreateItem}
            className="text-xs bg-primary text-primary-foreground font-bold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Raw Material
          </Button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-border gap-2">
        {[
          { id: "items", label: "Stock Items", count: items.length, icon: Scale },
          { id: "recipes", label: "Recipe Engine (BOM)", count: recipes.length, icon: BookOpen },
          { id: "ledger", label: "Transaction Ledger", count: transactions.length, icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RAW INVENTORY ITEMS */}
      {activeTab === "items" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search raw material or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>Low Stock Alerts: </span>
              <span className="font-bold text-amber-500">
                {items.filter((i) => i.quantity <= i.minStockLevel).length} items
              </span>
            </div>
          </div>

          {isItemsLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5">Raw Material</th>
                    <th className="p-3.5 font-mono">Current Stock</th>
                    <th className="p-3.5 font-mono">Min Threshold</th>
                    <th className="p-3.5">Health Status</th>
                    <th className="p-3.5">Supplier</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-semibold text-foreground">
                          {item.name}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-sm">
                          {item.quantity} <span className="text-xs text-muted-foreground">{item.unit}</span>
                        </td>
                        <td className="p-3.5 font-mono text-muted-foreground">
                          {item.minStockLevel} {item.unit}
                        </td>
                        <td className="p-3.5">
                          {isLow ? (
                            <Badge variant="default" className="bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit py-0.5">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1 w-fit py-0.5">
                              <Check className="h-3 w-3" />
                              Optimal
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5 text-muted-foreground">{item.supplier || "—"}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditItem(item)}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${item.name}?`)) deleteItemMutation.mutate(item.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECIPE ENGINE (BILL OF MATERIALS) */}
      {activeTab === "recipes" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Define raw ingredients per menu item for automated inventory deductions on order confirmation.
            </p>
            <Button
              size="sm"
              onClick={() => handleOpenRecipeModal()}
              className="text-xs bg-primary text-primary-foreground font-bold gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              Configure Item Recipe
            </Button>
          </div>

          {isRecipesLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : recipes.length === 0 ? (
            <div className="p-12 rounded-xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-primary/50" />
              <p className="font-semibold text-sm">No Recipes Configured Yet</p>
              <p className="text-xs mt-1">Tap "Configure Item Recipe" to link raw materials to menu items.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {recipe.menuItem?.name || "Menu Item"}
                      </h3>
                      <span className="font-mono text-xs text-primary font-bold">
                        LKR {recipe.menuItem?.price?.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenRecipeModal(recipe.menuItemId)}
                      className="h-7 text-[11px] px-2"
                    >
                      Edit BOM
                    </Button>
                  </div>

                  <div className="space-y-1.5 border-t border-border pt-2">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Ingredients ({recipe.ingredients?.length || 0}):
                    </span>
                    {recipe.ingredients?.map((ing) => (
                      <div key={ing.id} className="flex justify-between text-xs font-mono">
                        <span className="text-foreground">{ing.inventoryItem?.name}</span>
                        <span className="text-muted-foreground">
                          {ing.quantity} {ing.inventoryItem?.unit} (+{(ing.wastageFactor * 100).toFixed(0)}% waste)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRANSACTION LEDGER */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Immutable double-entry transaction history of all stock additions, sales depletions, and wastage.
          </p>

          {isTxLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Movement Type</th>
                    <th className="p-3.5">Item</th>
                    <th className="p-3.5 font-mono">Quantity Change</th>
                    <th className="p-3.5">Notes / Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {transactions.map((tx) => {
                    const isPositive = tx.quantity > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-muted/30">
                        <td className="p-3.5 text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tx.type === "PURCHASE"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                : tx.type === "SALE"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : "bg-red-500/10 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-foreground font-body">
                          {tx.inventoryItem?.name}
                        </td>
                        <td
                          className={`p-3.5 font-bold ${
                            isPositive ? "text-emerald-500" : "text-amber-500"
                          }`}
                        >
                          {isPositive ? `+${tx.quantity}` : tx.quantity} {tx.inventoryItem?.unit}
                        </td>
                        <td className="p-3.5 text-muted-foreground font-body text-[11px]">
                          {tx.notes || tx.referenceId || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD / EDIT RAW MATERIAL */}
      {isItemModalOpen && (
        <Modal
          open={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          title={editingItem ? "Edit Raw Material" : "Add New Raw Material"}
        >
          <form onSubmit={handleSaveItem} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Item Name</label>
              <Input
                required
                placeholder="e.g. Fresh Mango, Full Cream Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Current Stock</label>
                <Input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Unit of Measure</label>
                <Input
                  placeholder="kg, liters, units, packs"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Min Threshold Level</label>
                <Input
                  type="number"
                  step="0.01"
                  value={minStockLevel}
                  onChange={(e) => setMinStockLevel(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Supplier Name</label>
                <Input
                  placeholder="e.g. Ceylon Agro Traders"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold">
              {editingItem ? "Save Changes" : "Create Raw Material"}
            </Button>
          </form>
        </Modal>
      )}

      {/* MODAL 2: CONFIGURE RECIPE (BOM) */}
      {isRecipeModalOpen && (
        <Modal
          open={isRecipeModalOpen}
          onClose={() => setIsRecipeModalOpen(false)}
          title="Configure Item Recipe (BOM)"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Select Menu Item</label>
              <select
                value={selectedMenuItemId}
                onChange={(e) => handleOpenRecipeModal(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-foreground text-xs"
              >
                {menuItems.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (LKR {m.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground">Raw Ingredients Required per Serving:</label>
                <Button size="sm" variant="outline" onClick={handleAddIngredientRow} className="h-7 text-xs">
                  + Add Ingredient
                </Button>
              </div>

              {recipeIngredients.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-muted/40 p-2 rounded-lg border border-border">
                  <select
                    value={row.inventoryItemId}
                    onChange={(e) => {
                      const updated = [...recipeIngredients];
                      updated[idx].inventoryItemId = e.target.value;
                      setRecipeIngredients(updated);
                    }}
                    className="flex-1 h-8 px-2 rounded border border-border bg-card text-foreground text-xs"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.unit})
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    step="0.001"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => {
                      const updated = [...recipeIngredients];
                      updated[idx].quantity = Number(e.target.value);
                      setRecipeIngredients(updated);
                    }}
                    className="w-24 h-8 text-xs font-mono"
                  />

                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Wastage %"
                    value={row.wastageFactor}
                    onChange={(e) => {
                      const updated = [...recipeIngredients];
                      updated[idx].wastageFactor = Number(e.target.value);
                      setRecipeIngredients(updated);
                    }}
                    className="w-24 h-8 text-xs font-mono"
                  />

                  <button
                    onClick={() => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx))}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveRecipe}
              disabled={saveRecipeMutation.isPending || recipeIngredients.length === 0}
              className="w-full bg-primary text-primary-foreground font-bold"
            >
              {saveRecipeMutation.isPending ? "Saving..." : "Save Recipe Configuration"}
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 3: STOCK INWARD & ADJUSTMENT */}
      {isInwardModalOpen && (
        <Modal
          open={isInwardModalOpen}
          onClose={() => setIsInwardModalOpen(false)}
          title="Stock Inward & Purchase Order Intake"
        >
          <div className="space-y-4 font-body">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Raw Material</label>
              <select
                value={inwardItemId}
                onChange={(e) => setInwardItemId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-foreground text-xs"
              >
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name} (Current: {it.quantity} {it.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Movement Type</label>
                <select
                  value={inwardType}
                  onChange={(e) => setInwardType(e.target.value as any)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-card text-foreground text-xs"
                >
                  <option value="PURCHASE">PURCHASE (Stock In)</option>
                  <option value="WASTAGE">WASTAGE (Spoilage)</option>
                  <option value="ADJUSTMENT">ADJUSTMENT (Audit)</option>
                  <option value="RETURN">RETURN (Supplier)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Quantity</label>
                <Input
                  type="number"
                  step="0.01"
                  value={inwardQty}
                  onChange={(e) => setInwardQty(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Unit Cost (LKR)</label>
                <Input
                  type="number"
                  value={inwardUnitCost}
                  onChange={(e) => setInwardUnitCost(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">PO / Batch Reference</label>
                <Input
                  placeholder="PO-2026-08"
                  value={inwardRef}
                  onChange={(e) => setInwardRef(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Notes</label>
              <Input
                placeholder="e.g. Fresh stock from wholesale market"
                value={inwardNotes}
                onChange={(e) => setInwardNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              disabled={stockMovementMutation.isPending || !inwardItemId || inwardQty <= 0}
              onClick={() =>
                stockMovementMutation.mutate({
                  inventoryItemId: inwardItemId,
                  type: inwardType,
                  quantity: inwardQty,
                  unitCost: inwardUnitCost,
                  referenceId: inwardRef,
                  notes: inwardNotes,
                })
              }
              className="w-full bg-primary text-primary-foreground font-bold"
            >
              {stockMovementMutation.isPending ? "Recording..." : "Confirm Stock Movement"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
