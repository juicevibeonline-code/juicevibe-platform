"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, Upload, ImageIcon, X, Edit2, Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/useToast";
import { galleryService, type GalleryImage } from "@juice-vibe/services";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["all", "juices", "smoothies", "milkshakes", "signature", "interior", "team"];

export default function GalleryPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renamingImage, setRenamingImage] = useState<GalleryImage | null>(null);
  const [renamingTitle, setRenamingTitle] = useState("");
  const [renamingCategory, setRenamingCategory] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getImages();
      setImages(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load gallery assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;

      // Client-side validations
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          message: `${file.name} exceeds the 10MB upload limit.`,
          type: "error",
        });
        continue;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          message: `${file.name} is not an image file.`,
          type: "error",
        });
        continue;
      }

      try {
        const title = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        // Default category to the active filter tab if it is not "all"
        const category = activeCategory !== "all" ? activeCategory : "general";
        await galleryService.uploadImage(file, title, category);
        toast({
          title: "Upload successful",
          message: `${file.name} was added to the gallery.`,
          type: "success",
        });
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Upload failed",
          message: err.message || `Failed to upload ${file.name}.`,
          type: "error",
        });
      }
    }

    setIsUploading(false);
    fetchImages();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    const prevImages = [...images];
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteConfirm(null);

    try {
      await galleryService.deleteImage(id);
      toast({
        title: "Image deleted",
        message: "The asset was removed from database.",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      setImages(prevImages);
      toast({
        title: "Delete failed",
        message: err.message || "Failed to delete asset from backend.",
        type: "error",
      });
    }
  };

  const handleOpenRename = (img: GalleryImage) => {
    setRenamingImage(img);
    setRenamingTitle(img.alt);
    setRenamingCategory(img.category);
    setIsRenameOpen(true);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingImage) return;

    try {
      setUpdating(true);
      await galleryService.updateImage(renamingImage.id, renamingTitle, renamingCategory);
      toast({
        title: "Updated successfully",
        message: "Gallery image details updated.",
        type: "success",
      });
      setIsRenameOpen(false);
      setRenamingImage(null);
      fetchImages();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Update failed",
        message: err.message || "Failed to update details.",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const countFor = (cat: string) =>
    cat === "all" ? images.length : images.filter((i) => i.category === cat).length;

  const filtered = images.filter(
    (img) => activeCategory === "all" || img.category === activeCategory
  );

  const uploadAction = (
    <button
      onClick={() => fileInputRef.current?.click()}
      disabled={isUploading}
      className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold text-xs shadow-sm cursor-pointer disabled:opacity-75"
    >
      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      Upload Images
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader
        title="Gallery Management"
        subtitle="Manage your image gallery and assets"
        accentColor="blue"
        action={uploadAction}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleUploadFiles(e.target.files)}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Upload drop zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 bg-card hover:border-primary/50 hover:bg-primary/[0.02] transition-colors cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-primary" />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold text-sm text-foreground">
            {isUploading ? "Uploading files..." : "Drag and drop images here"}
          </p>
          <p className="text-xs text-muted mt-1">or click to browse — PNG, JPG, WebP up to 10MB</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold capitalize border transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-background border-border text-primary"
                : "bg-card hover:bg-background text-muted hover:text-foreground border-border"
            }`}
          >
            {cat}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              activeCategory === cat ? "bg-primary/10 text-primary-dark" : "bg-background text-muted"
            }`}>
              {countFor(cat)}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading gallery...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border rounded-lg shadow-sm">
          <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-7 h-7 text-muted" />
          </div>
          <p className="font-bold text-foreground">No images in this category</p>
          <p className="text-sm text-muted mt-1">Upload some images or choose a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-lg overflow-hidden bg-card border border-border aspect-square shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              {img.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-muted opacity-40" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-end p-2 gap-1.5">
                <button
                  onClick={() => handleOpenRename(img)}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer shadow"
                  title="Rename/Edit"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(img.id === deleteConfirm ? null : img.id)}
                  className="p-1.5 bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer shadow"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Delete confirmation overlay */}
              {deleteConfirm === img.id && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4">
                  <p className="text-white text-xs font-bold text-center">Delete this image?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-md cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs font-bold truncate">{img.alt}</p>
                <p className="text-white/70 text-[10px] capitalize mt-0.5">{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rename Modal */}
      <Modal isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} title="Rename Image Details" size="sm">
        <form onSubmit={handleSaveRename} className="space-y-4 text-xs">
          <Input
            label="Image Title / Alt Text"
            value={renamingTitle}
            onChange={(e) => setRenamingTitle(e.target.value)}
            required
            placeholder="e.g. Signature Mango Shake"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground mb-1.5">Category</label>
            <select
              value={renamingCategory}
              onChange={(e) => setRenamingCategory(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50"
            >
              {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1 text-xs" isLoading={updating}>
              Save Details
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
