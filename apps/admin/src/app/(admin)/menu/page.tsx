"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, AlertCircle, RefreshCw } from "lucide-react";
import { Table } from "@/components/table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/PageHeader";
import { ActionMenu } from "@/components/ui";
import { LoadingState, ErrorAlert, FilterBar, FilterTab, FormFooter } from "@/components/shared";
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
        <Badge 
          variant={item.status === "active" ? "success" : item.status === "archived" ? "danger" : "default"} 
          className="capitalize font-semibold"
        >
          {item.status === "active" ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
          {item.status}
        </Badge>
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
        <span className="capitalize text-xs font-medium">{item.availability.replaceAll("_", " ")}</span>
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
    <Button variant="primary" className="text-xs" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4" />
      Add New Item
    </Button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader title="Menu Management" subtitle="Manage your menu items, prices, and categories" action={addBtn} />

      {/* Dynamic Category Tabs Control Bar */}
      <FilterBar>
        <FilterTab active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All Items</FilterTab>
        {categories.map((cat) => (
          <FilterTab key={cat.id} active={cat.slug === activeCategory} onClick={() => setActiveCategory(cat.slug)}>
            {cat.name}
          </FilterTab>
        ))}
        <FilterTab active={activeCategory === "archived"} onClick={() => setActiveCategory("archived")} variant="danger">
          Archived / Soft-Deleted
        </FilterTab>
      </FilterBar>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState label="Loading menu..." />
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
          
          <Select 
            label="Category"
            name="categoryId"
            required
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />

          <TextArea label="Description" name="description" rows={3} placeholder="Details about this menu item..." />

          <FormFooter onCancel={() => setIsAddModalOpen(false)} onSubmitLabel="Create Item" isLoading={submitting} />
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }} title="Edit Menu Item" size="md">
        {editingItem && (
          <form className="space-y-4 text-xs" onSubmit={handleUpdateItem}>
            <Input label="Name" name="name" defaultValue={editingItem.name} required />
            <Input label="Price (LKR)" name="price" type="number" defaultValue={editingItem.price.toString()} required min="0" />
            
            <Select 
              label="Category"
              name="categoryId"
              required
              defaultValue={editingItem.categoryId}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
            />

            <TextArea label="Description" name="description" defaultValue={editingItem.description || ""} rows={3} />

            <FormFooter onCancel={() => { setIsEditModalOpen(false); setEditingItem(null); }} onSubmitLabel="Save Changes" isLoading={submitting} />
          </form>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Archive"
        message="Are you sure you want to archive this menu item? It will be hidden from customer ordering lists but historical records remain untouched."
        confirmText="Archive"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
