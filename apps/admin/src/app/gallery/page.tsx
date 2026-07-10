"use client";

import { useState } from "react";
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

// Using real images from /public/images/ where available
const initialImages = [
  { id: "1", src: "/images/BG-R-Logo1.png", alt: "Juice Vibe Signature", category: "signature", size: "1200x800" },
  { id: "2", src: "/images/BG-R-Logo2.png", alt: "Juice Vibe Branding", category: "signature", size: "1200x800" },
  { id: "3", src: "/images/Logo.jpeg", alt: "Juice Vibe Logo", category: "interior", size: "800x800" },
  { id: "4", src: "/images/Menu.jpeg", alt: "Menu Board", category: "interior", size: "800x600" },
  { id: "5", src: "/images/MenuItems/FreshJuicesMango .png", alt: "Fresh Mango Juice", category: "juices", size: "800x600" },
  { id: "6", src: "/images/MenuItems/Special Smoothies-AandD.png", alt: "Tropical Smoothie", category: "smoothies", size: "800x800" },
  { id: "7", src: "/images/MenuItems/Milkshakes-Strawberry.png", alt: "Strawberry Milkshake", category: "milkshakes", size: "600x800" },
  { id: "8", src: "/images/MenuItems/Mocktails-Flavoured Mojito.png", alt: "Signature Mocktail", category: "signature", size: "600x800" },
];

const categories = ["all", "juices", "smoothies", "milkshakes", "signature", "interior", "team"];

export default function GalleryPage() {
  const [images, setImages] = useState(initialImages);
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = images.filter((img) => activeCategory === "all" || img.category === activeCategory);

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const uploadAction = (
    <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
      <Upload className="w-5 h-5" />
      Upload Images
    </button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader
        title="Gallery Management"
        subtitle="Manage your image gallery and assets"
        accentColor="blue"
        action={uploadAction}
      />

      {/* Drag-and-drop upload area */}
      <div className="mx-2 border-2 border-dashed border-border/60 rounded-3xl p-8 flex flex-col items-center gap-3 bg-white/30 dark:bg-white/[0.02] hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer group">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-foreground">Drag and drop images here</p>
          <p className="text-sm text-muted mt-1">or click to browse — PNG, JPG, WebP up to 10MB</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
                : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-white/80 dark:border-white/5 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="mx-2 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-lg font-bold text-foreground">No images in this category</p>
          <p className="text-sm text-muted mt-1">Upload some images or choose a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-[1.5rem] overflow-hidden bg-white/40 dark:bg-white/5 border border-white/80 dark:border-white/5 aspect-square shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image or placeholder */}
              {img.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-3 bg-pink/90 rounded-xl hover:scale-110 hover:bg-pink transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-bold truncate tracking-wide">{img.alt}</p>
                <p className="text-white/70 text-xs font-medium capitalize mt-0.5">{img.category} · {img.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
