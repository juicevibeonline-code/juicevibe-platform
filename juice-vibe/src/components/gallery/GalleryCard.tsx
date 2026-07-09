"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import type { GalleryImage } from "@/data/gallery";

interface GalleryCardProps {
  image: GalleryImage;
  onOpen: (image: GalleryImage) => void;
  index: number;
}

export function GalleryCard({ image, onOpen, index }: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
      onClick={() => onOpen(image)}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
        style={{ aspectRatio: `${image.width}/${image.height}` }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-orange/5 text-6xl">
          🧃
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-dark-green/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <Expand className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-full rounded-b-2xl bg-gradient-to-t from-dark-green/90 to-transparent p-4 pt-12 transition-transform duration-300 group-hover:translate-y-0">
        <p className="text-sm font-medium text-white">{image.alt}</p>
        <p className="text-xs text-white/70 capitalize">{image.category}</p>
      </div>
    </motion.div>
  );
}
