"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService, galleryService } from "@juice-vibe/services";
import type { MenuCategory, MenuItem } from "@juice-vibe/types";
import { formatPrice } from "@juice-vibe/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Image as ImageIcon, 
  Star, 
  Eye, 
  Info,
  DollarSign,
  Layers,
  ChevronRight,
  TrendingUp,
  Tag,
  Upload,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { Badge } from "@juice-vibe/ui";

const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Please select a category"),
  availability: z.enum(["in_stock", "out_of_stock", "coming_soon"]),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  calories: z.number().optional(),
  ingredientsStr: z.string().optional(),
  tagsStr: z.string().optional(),
  thumbnail: z.string().optional(),
});

type MenuItemSchema = z.infer<typeof menuItemSchema>;

export default function MenuCatalog() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["menuCategories"],
    queryFn: () => menuService.getCategories(),
    retry: 1,
  });

  const selectedCategory = categories.find((c: any) => c.slug === selectedCategorySlug);

  const { data: menuItems = [], isLoading: itemsLoading } = useQuery<any[]>({
    queryKey: ["menuItems", selectedCategorySlug],
    queryFn: () => menuService.getMenuItems({ 
      category: selectedCategorySlug === "all" ? undefined : selectedCategorySlug 
    }),
    retry: 1,
  });

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: (input: any) => menuService.createMenuItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setIsCreateOpen(false);
      reset();
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<MenuItem> }) => 
      menuService.updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setEditingItem(null);
      reset();
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  // Form Hooks
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MenuItemSchema>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      availability: "in_stock",
      isPopular: false,
      isFeatured: false,
      calories: 0,
      ingredientsStr: "",
      tagsStr: "",
      thumbnail: "",
    },
  });

  const currentThumbnail = watch("thumbnail");

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("price", item.price);
    setValue("categoryId", item.categoryId);
    setValue("availability", item.availability as any);
    setValue("isPopular", !!item.isPopular);
    setValue("isFeatured", !!item.isFeatured);
    setValue("calories", item.calories || 0);
    setValue("ingredientsStr", item.ingredients?.join(", ") || "");
    setValue("tagsStr", item.tags?.join(", ") || "");
    setValue("thumbnail", item.thumbnail || (item.images && item.images[0]) || "");
  };

  const onSubmit = (data: MenuItemSchema) => {
    const formattedData = {
      ...data,
      ingredients: data.ingredientsStr ? data.ingredientsStr.split(",").map(i => i.trim()) : [],
      tags: data.tagsStr ? data.tagsStr.split(",").map(t => t.trim()) : [],
      price: Number(data.price),
      calories: data.calories ? Number(data.calories) : undefined,
      thumbnail: data.thumbnail || undefined,
    };

    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, input: formattedData });
    } else {
      createItemMutation.mutate(formattedData);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      const result = await galleryService.uploadImage(
        file,
        watch("name") || file.name,
        "menu"
      );
      if (result && result.src) {
        setValue("thumbnail", result.src);
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload image. Please ensure API server is running and Cloudinary/Storage is reachable."
      );
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to flag and delete this menu item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Desk Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Menu Catalog
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            BEVERAGE CRUD & CATEGORIES INVENTORY MANAGEMENT
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            reset();
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4 w-4 text-ink-dark" />
          <span>New Catalog Item</span>
        </button>
      </div>

      {/* Category Tabs list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide select-none border-b border-border/40">
        <button
          onClick={() => setSelectedCategorySlug("all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer whitespace-nowrap",
            selectedCategorySlug === "all"
              ? "bg-primary/20 text-primary border-primary/30 font-semibold"
              : "bg-ink-dark text-muted-foreground border-transparent hover:text-foreground hover:bg-ink-dark/50"
          )}
        >
          ALL CATEGORIES
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategorySlug(cat.slug)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer whitespace-nowrap",
              selectedCategorySlug === cat.slug
                ? "bg-primary/20 text-primary border-primary/30 font-semibold"
                : "bg-ink-dark text-muted-foreground border-transparent hover:text-foreground hover:bg-ink-dark/50"
            )}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Items Grid view */}
      {itemsLoading || categoriesLoading ? (
        <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
          Compiling catalog menu parameters...
        </div>
      ) : menuItems.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">Category Catalog is Empty</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Create a new item to populate this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="terminal-card border border-border bg-card p-5 relative flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              {/* Top Row / Badges */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {item.thumbnail ? (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-slate-900/50 flex items-center justify-center">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-lg border border-dashed border-border/40 shrink-0 bg-ink-dark flex items-center justify-center text-xl">
                      🍹
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                        {item.name}
                      </h3>
                      <span className="font-numeral text-xs font-bold text-primary shrink-0 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5 block">
                      {categories.find((c: any) => c.id === item.categoryId)?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Badges indicators */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold font-mono border",
                      item.availability === "in_stock" && "bg-primary/15 text-primary border-primary/20",
                      item.availability === "out_of_stock" && "bg-pink/10 text-pink border-pink/20",
                      item.availability === "coming_soon" && "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}
                  >
                    {item.availability === "in_stock" ? "In Stock" : item.availability === "out_of_stock" ? "Out of Stock" : "Coming Soon"}
                  </span>
                  
                  {item.isPopular && (
                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                      <Star className="h-2.5 w-2.5 fill-yellow-500" />
                      Popular
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="bg-primary/10 text-primary border border-primary/25 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-border/40 pt-4 mt-5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-ink-dark hover:bg-ink-dark/80 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground text-[10px] font-mono font-bold rounded cursor-pointer transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 border border-border hover:border-pink/40 hover:bg-pink/5 text-muted-foreground hover:text-pink rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE & EDIT OVERLAY MODAL */}
      {(isCreateOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0 bg-ink-dark/30">
              <h2 className="text-sm font-bold text-foreground font-heading uppercase tracking-wider">
                {editingItem ? `Edit item // ${editingItem.name}` : "Create Catalog item"}
              </h2>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingItem(null);
                  reset();
                }}
                className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Product Label</label>
                <input
                  type="text"
                  placeholder="e.g. Avocado Delight"
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  {...register("name")}
                />
                {errors.name && <p className="text-[10px] font-mono text-pink">{errors.name.message}</p>}
              </div>

              {/* Product Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Unit Price (LKR)</label>
                  <input
                    type="number"
                    placeholder="350"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && <p className="text-[10px] font-mono text-pink">{errors.price.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Category Map</label>
                  <select
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("categoryId")}
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-[10px] font-mono text-pink">{errors.categoryId.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Product description</label>
                <textarea
                  placeholder="Detailed description of tropical blend..."
                  rows={2}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 resize-none"
                  {...register("description")}
                />
                {errors.description && <p className="text-[10px] font-mono text-pink">{errors.description.message}</p>}
              </div>

              {/* Availability & Switch details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Availability bounds</label>
                  <select
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("availability")}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Calories (kCal)</label>
                  <input
                    type="number"
                    placeholder="250"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("calories", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Promotional Indicators */}
              <div className="flex gap-6 py-1">
                <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground select-none cursor-pointer">
                  <input type="checkbox" className="accent-primary" {...register("isPopular")} />
                  <span>Flag as popular</span>
                </label>
                <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground select-none cursor-pointer">
                  <input type="checkbox" className="accent-primary" {...register("isFeatured")} />
                  <span>Flag as featured</span>
                </label>
              </div>

              {/* Ingredients & Tags (Comma Separated) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Ingredients (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Avocado, milk, sugar"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("ingredientsStr")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="organic, cold, fresh"
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    {...register("tagsStr")}
                  />
                </div>
              </div>

              {/* Media Upload secure segment */}
              <div className="space-y-2 border border-border/80 bg-ink-dark/40 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Cloudinary / Media Vault Integration
                  </label>
                  {currentThumbnail && (
                    <button
                      type="button"
                      onClick={() => setValue("thumbnail", "")}
                      className="text-[9px] font-mono text-pink hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" /> Clear image
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {currentThumbnail ? (
                  <div className="flex items-center gap-3 bg-ink-dark p-2 rounded-lg border border-primary/20">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border shrink-0 bg-slate-900 flex items-center justify-center">
                      <img
                        src={currentThumbnail}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-primary font-bold truncate">
                        {currentThumbnail}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadProgress}
                        className="mt-1 text-[9px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
                      >
                        Change photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadProgress}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-ink-dark hover:bg-ink-dark/80 border border-border hover:border-primary/30 text-xs font-mono text-muted-foreground hover:text-foreground rounded cursor-pointer transition-all disabled:opacity-50"
                    >
                      {uploadProgress ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 text-primary" />
                      )}
                      <span>{uploadProgress ? "Uploading to storage vault..." : "Upload menu image"}</span>
                    </button>
                    <span className="text-[9px] font-mono text-muted-foreground/60">
                      PNG, JPG, WebP (Max 10MB).
                    </span>
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  <label className="text-[9px] font-mono uppercase text-muted-foreground block">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="/images/MenuItems/Ambarella.png or https://..."
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-[10px] px-2.5 py-1.5 rounded focus:outline-none focus:border-primary/50"
                    {...register("thumbnail")}
                  />
                </div>
              </div>

              {/* Save / Dispatch */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                    reset();
                  }}
                  className="px-4 py-2 border border-border hover:bg-ink-dark/30 text-muted-foreground text-xs font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Save to catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
