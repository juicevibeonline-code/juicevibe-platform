"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, AlertCircle, RefreshCw } from "lucide-react";
import { Table } from "@/components/table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { ActionMenu } from "@/components/ui";
import { menuService } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";
import type { MenuItem, MenuCategory } from "@juice-vibe/types";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleEditItemClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;

    try {
      setSubmitting(true);
      await menuService.updateItem(editingItem.id, {
        name,
        price,
        categoryId,
        description,
      } as any);

      toast({ type: "success", title: "Updated", message: "Menu item updated successfully." });
      await fetchData();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Update failed", message: err.message || "Failed to update menu item." });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const isArchived = activeCategory === "archived";
      const [itemsRes, catsRes] = await Promise.all([
        menuService.getMenuItems({ status: isArchived ? "archived" : "all" }),
        menuService.getCategories(),
      ]);
      setItems(itemsRes || []);
      setCategories(catsRes || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await menuService.deleteItem(deleteConfirmId);
      toast({ type: "success", title: "Archived", message: "Menu item archived successfully." });
      setDeleteConfirmId(null);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Archive failed", message: err.message || "Failed to archive menu item." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await menuService.restoreItem(id);
      toast({ type: "success", title: "Restored", message: "Menu item restored successfully." });
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Restore failed", message: err.message || "Failed to restore item." });
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;

    try {
      setSubmitting(true);
      await menuService.createMenuItem({
        name,
        price,
        categoryId,
        description,
        availability: "in_stock",
        status: "active",
        isPopular: false,
        isFeatured: false,
        ingredients: [],
        tags: [],
        images: [],
      } as any);

      await fetchData();
      setIsAddModalOpen(false);
      toast({ type: "success", title: "Created", message: "Menu item created successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ type: "error", title: "Create failed", message: err.message || "Failed to create menu item." });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Item Name", sortable: true },
    { 
      key: "category", 
      label: "Category",
      sortable: true,
      render: (item: MenuItem) => <span>{item.category?.name || "Uncategorized"}</span>
    },
    { 
      key: "price", 
      label: "Price",
      sortable: true,
      render: (item: MenuItem) => <span>LKR {item.price.toLocaleString()}</span>
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: MenuItem) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
          item.status === "active" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
            : item.status === "archived"
            ? "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
            : "bg-background text-muted border border-border dark:text-muted"
        }`}>
          {item.status === "active" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.status}
        </span>
      ),
    },
    {
      key: "isPopular",
      label: "Popular",
      render: (item: MenuItem) => item.isPopular ? <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> : null,
    },
    { 
      key: "availability", 
      label: "Stock",
      sortable: true,
      render: (item: MenuItem) => (
        <span className="capitalize text-xs font-semibold">{item.availability.replace("_", " ")}</span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (item: MenuItem) => {
        if (item.status === "archived") {
          return (
            <button
              onClick={() => handleRestore(item.id)}
              className="px-2.5 py-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              Restore
            </button>
          );
        }

        const actions = [
          {
            label: "Edit Item",
            onClick: () => handleEditItemClick(item),
            icon: <Edit className="w-3.5 h-3.5 text-blue-600" />,
          },
          {
            label: "Archive",
            onClick: () => handleDeleteClick(item.id),
            icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
            destructive: true,
          },
        ];

        return <ActionMenu items={actions} />;
      },
    },
  ];

  // Apply category filtering on items. Archived tab displays all archived.
  const filtered = activeCategory === "archived"
    ? items
    : activeCategory === "all"
    ? items.filter((item) => item.status !== "archived")
    : items.filter((item) => item.category?.slug === activeCategory && item.status !== "archived");

  const addBtn = (
    <button 
      onClick={() => setIsAddModalOpen(true)} 
      className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold text-xs shadow-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      Add New Item
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader title="Menu Management" subtitle="Manage your menu items, prices, and categories" accentColor="primary" action={addBtn} />

      {/* Dynamic Category Tabs Control Bar */}
      <div className="bg-card border border-border/80 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-full shrink-0 shadow-sm">
        <button 
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "all" 
              ? "bg-primary text-white shadow-sm" 
              : "text-muted hover:text-foreground hover:bg-background/50"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              cat.slug === activeCategory 
                ? "bg-primary text-white shadow-sm" 
                : "text-muted hover:text-foreground hover:bg-background/50"
            }`}
          >
            {cat.name}
          </button>
        ))}
        {/* Archived filter tab */}
        <button 
          onClick={() => setActiveCategory("archived")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "archived" 
              ? "bg-rose-600 text-white shadow-sm shadow-rose-600/10" 
              : "text-rose-600 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10"
          }`}
        >
          Archived / Soft-Deleted
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading menu...</span>
        </div>
      ) : (
        <div>
          <Table columns={columns} data={filtered} searchable />
        </div>
      )}

      {/* Add New Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Item" size="md">
        <form className="space-y-4 text-xs" onSubmit={handleAddItem}>
          <Input label="Name" name="name" required placeholder="e.g. Avocado Shake" />
          <Input label="Price (LKR)" name="price" type="number" required placeholder="e.g. 750" min="0" />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground mb-1">Category</label>
            <select name="categoryId" required className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground mb-1">Description</label>
            <textarea name="description" rows={3} className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none" placeholder="Details about this menu item..." />
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={submitting}>Create Item</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }} title="Edit Menu Item" size="md">
        {editingItem && (
          <form className="space-y-4 text-xs" onSubmit={handleUpdateItem}>
            <Input label="Name" name="name" defaultValue={editingItem.name} required />
            <Input label="Price (LKR)" name="price" type="number" defaultValue={editingItem.price.toString()} required min="0" />
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-foreground mb-1">Category</label>
              <select name="categoryId" defaultValue={editingItem.categoryId} required className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-foreground mb-1">Description</label>
              <textarea name="description" defaultValue={editingItem.description || ""} rows={3} className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none" />
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={submitting}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Archive" size="sm">
        <div className="space-y-4 text-xs">
          <p className="text-foreground leading-relaxed">
            Are you sure you want to archive this menu item? It will be hidden from customer ordering lists but historical records remain untouched.
          </p>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" className="flex-1 text-xs bg-rose-600 hover:bg-rose-700" isLoading={isDeleting} onClick={handleConfirmDelete}>
              Archive
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
