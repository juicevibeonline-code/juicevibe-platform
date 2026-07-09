"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

const initialImages = [
  { id: "1", src: "", alt: "Fresh Orange Juice", category: "juices", size: "800x600" },
  { id: "2", src: "", alt: "Tropical Smoothie", category: "smoothies", size: "800x800" },
  { id: "3", src: "", alt: "Signature Mocktail", category: "signature", size: "600x800" },
  { id: "4", src: "", alt: "Chocolate Milkshake", category: "milkshakes", size: "600x800" },
];

export default function GalleryPage() {
  const [images] = useState(initialImages);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "juices", "smoothies", "milkshakes", "signature", "interior", "team"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Gallery Management</h1>
            <p className="text-muted font-medium mt-2">Manage your image gallery and assets</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300 font-bold cursor-pointer">
            <Plus className="w-5 h-5" />
            Upload Images
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              activeCategory === cat ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]" : "bg-white/60 dark:bg-white/5 text-muted hover:bg-white dark:hover:bg-white/10 hover:text-foreground border border-white/80 dark:border-white/5 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 mt-4">
        {images
          .filter((img) => activeCategory === "all" || img.category === activeCategory)
          .map((img) => (
            <div key={img.id} className="group relative rounded-[2rem] overflow-hidden bg-white/40 dark:bg-white/5 border border-white/80 dark:border-white/5 aspect-square shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400 opacity-50 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button className="p-3 bg-pink/90 rounded-xl hover:scale-110 hover:bg-pink transition-all duration-300 shadow-lg cursor-pointer">
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-bold truncate tracking-wide">{img.alt}</p>
                <p className="text-white/80 text-xs font-medium capitalize mt-0.5">{img.category} · {img.size}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
