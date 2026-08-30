"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryService, type GalleryImage } from "@juice-vibe/services";
import { Badge } from "@juice-vibe/ui";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Loader2,
  X,
  Check,
  Filter,
  ExternalLink,
  Sparkles,
  Search,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Assets" },
  { id: "smoothies", label: "Smoothies" },
  { id: "mocktails", label: "Mocktails" },
  { id: "fresh-juices", label: "Fresh Juices" },
  { id: "burgers", label: "Burgers" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "coffee", label: "Coffee" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "ice-cream", label: "Ice Cream" },
  { id: "general", label: "Ambiance & General" },
];

export default function GalleryManager() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("smoothies");
  const [directUrl, setDirectUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["adminGalleryImages", selectedCategory],
    queryFn: () => galleryService.getImages(selectedCategory === "all" ? undefined : selectedCategory),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", title || "Storefront Photo");
        formData.append("category", category);
        return galleryService.uploadImage(formData);
      }
      throw new Error("Please select an image file to upload");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGalleryImages"] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || err.message || "Upload failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingImage) return;
      return galleryService.updateImage(editingImage.id, {
        title,
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGalleryImages"] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || err.message || "Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGalleryImages"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Delete failed");
    },
  });

  const openUploadModal = () => {
    setEditingImage(null);
    setTitle("");
    setCategory("smoothies");
    setDirectUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormError(null);
    setIsUploadModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setTitle(img.alt || "");
    setCategory(img.category || "smoothies");
    setSelectedFile(null);
    setPreviewUrl(img.src);
    setFormError(null);
    setIsUploadModalOpen(true);
  };

  const closeModal = () => {
    setIsUploadModalOpen(false);
    setEditingImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const filteredImages = images.filter((img) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      img.alt?.toLowerCase().includes(q) ||
      img.category?.toLowerCase().includes(q) ||
      img.src?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Storefront Media & Gallery Manager
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            PHOTO ASSETS, SHOWCASE VISUALS & PROMOTIONAL IMAGERY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" className="font-mono text-[10px]">
            TOTAL ASSETS: {images.length}
          </Badge>
          <button
            onClick={openUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-mono">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-ink-dark font-bold shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-ink-dark/50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border text-foreground font-mono text-xs pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 font-mono text-xs text-muted-foreground uppercase tracking-widest gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <span>Loading storefront assets...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl space-y-3">
          <ImageIcon className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <div className="font-mono text-xs uppercase text-muted-foreground tracking-wider">No media assets found</div>
          <button
            onClick={openUploadModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-mono hover:bg-primary/20 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Upload Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/40 transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] bg-ink-dark overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt || "Gallery Asset"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="primary" className="bg-ink-dark/80 backdrop-blur-sm text-[9px] font-mono uppercase text-primary border-primary/30">
                    {img.category || "General"}
                  </Badge>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-heading text-xs font-bold text-foreground line-clamp-1">
                    {img.alt || "Untitled Asset"}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground truncate block mt-0.5">
                    {img.src}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                  <span className="truncate">{img.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(img)}
                      className="p-1 text-muted-foreground hover:text-primary hover:bg-ink-dark rounded transition-colors cursor-pointer"
                      title="Edit metadata"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete image "${img.alt || img.id}"?`)) {
                          deleteMutation.mutate(img.id);
                        }
                      }}
                      className="p-1 text-muted-foreground hover:text-pink hover:bg-ink-dark rounded transition-colors cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>{editingImage ? "Edit Asset Metadata" : "Upload New Gallery Asset"}</span>
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-pink/10 border border-pink/30 rounded-lg text-xs font-mono text-pink">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {/* File Picker or Preview */}
              {!editingImage && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Asset File</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/50 bg-ink-dark/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center"
                  >
                    {previewUrl ? (
                      <div className="relative h-32 w-full rounded-lg overflow-hidden">
                        <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary" />
                        <span className="text-xs font-mono text-foreground font-bold">Click to select image file</span>
                        <span className="text-[10px] font-mono text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Title / Alt */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Asset Title / Alt Description</label>
                <input
                  type="text"
                  placeholder="e.g., Signature Tropical Smoothie Bowl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Showcase Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-transparent hover:bg-ink-dark text-muted-foreground text-xs font-mono rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={uploadMutation.isPending || updateMutation.isPending}
                onClick={() => {
                  if (editingImage) {
                    updateMutation.mutate();
                  } else {
                    uploadMutation.mutate();
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-60 text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer shadow-md shadow-primary/10 transition-all"
              >
                {(uploadMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin text-ink-dark" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{editingImage ? "Update Asset" : "Commit Upload"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
