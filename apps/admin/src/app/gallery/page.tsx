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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-muted mt-1">Manage your image gallery</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Upload Images
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeCategory === cat ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images
          .filter((img) => activeCategory === "all" || img.category === activeCategory)
          .map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden bg-gray-100 border border-border aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm font-medium truncate">{img.alt}</p>
                <p className="text-white/70 text-xs capitalize">{img.category} · {img.size}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
