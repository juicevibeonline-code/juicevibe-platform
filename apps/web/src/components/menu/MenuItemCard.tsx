"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, CheckCircle } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { MenuItem } from "@juice-vibe/types";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

const categoryThemes: Record<
  string,
  {
    btnBg: string;
    badgeBg: string;
    emoji: string;
    tag: string;
  }
> = {
  milkshakes: {
    btnBg: "bg-orange-500 hover:bg-orange-600",
    badgeBg: "bg-orange-50 text-orange-600 border-orange-200/40",
    emoji: "🥤",
    tag: "Creamy",
  },
  "fresh-juices": {
    btnBg: "bg-primary hover:bg-primary-dark",
    badgeBg: "bg-green-50 text-green-600 border-green-200/40",
    emoji: "🍎",
    tag: "100% Pure",
  },
  smoothies: {
    btnBg: "bg-primary hover:bg-primary-dark",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200/40",
    emoji: "🍹",
    tag: "Organic",
  },
  lassi: {
    btnBg: "bg-yellow-500 hover:bg-yellow-600 text-white",
    badgeBg: "bg-yellow-50 text-yellow-600 border-yellow-200/40",
    emoji: "🥛",
    tag: "Blended",
  },
  tea: {
    btnBg: "bg-amber-600 hover:bg-amber-700",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200/40",
    emoji: "🍵",
    tag: "Brewed",
  },
  coffee: {
    btnBg: "bg-yellow-800 hover:bg-yellow-900",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200/40",
    emoji: "☕",
    tag: "Espresso",
  },
  mocktails: {
    btnBg: "bg-pink-500 hover:bg-pink-600",
    badgeBg: "bg-pink-50 text-pink-600 border-pink-200/40",
    emoji: "🍷",
    tag: "Refreshing",
  },
  "ice-cream": {
    btnBg: "bg-pink-500 hover:bg-pink-600",
    badgeBg: "bg-pink-50 text-pink-600 border-pink-200/40",
    emoji: "🍨",
    tag: "Sweet",
  },
  burgers: {
    btnBg: "bg-orange-500 hover:bg-orange-600",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200/40",
    emoji: "🍔",
    tag: "Grilled",
  },
  sandwiches: {
    btnBg: "bg-green-700 hover:bg-green-800",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/40",
    emoji: "🥪",
    tag: "Toasted",
  },
};

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const categorySlug = typeof item.category === "string" ? item.category : item.category?.slug || "";
  const theme = categoryThemes[categorySlug] || {
    btnBg: "bg-primary hover:bg-primary-dark",
    badgeBg: "bg-primary/5 text-primary border-primary/10",
    emoji: "🌿",
    tag: "Fresh",
  };

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const itemImage = item.thumbnail || (item.images && item.images[0]) || (item as any).image;
  const isPng = itemImage?.toLowerCase().endsWith(".png");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="h-full"
    >
      <div className="group relative flex flex-col justify-between h-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 p-4 overflow-hidden">
        
        {/* Full-width Image Section */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800/50 flex items-center justify-center mb-4">
          
          {/* Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
            <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border", theme.badgeBg)}>
              {theme.tag}
            </span>
            {item.isPopular && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider shadow-sm">
                <Star className="h-2 w-2 fill-current" />
                Popular
              </span>
            )}
          </div>
          
          {itemImage ? (
            <div className="relative w-full h-full z-10 transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={encodeURI(itemImage)}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className={cn(
                  "transition-all duration-500",
                  isPng ? "object-contain p-4" : "object-cover"
                )}
              />
            </div>
          ) : (
            <div className="relative text-5xl select-none z-10 transition-transform duration-500 group-hover:scale-110">
              {theme.emoji}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col justify-start mb-3">
          <h3 className="font-heading text-sm font-bold text-dark-green dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
            {item.description}
          </p>
          {item.variants && item.variants.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {item.variants.map((v) => (
                <span key={v.id} className="text-[9px] font-semibold bg-primary/5 text-primary border border-primary/10 rounded px-1.5 py-0.5">
                  {v.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800 mt-auto">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider leading-none">Price</span>
            <span className="font-heading text-base font-black text-dark-green dark:text-primary mt-1">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Order ${item.name}`}
            className={cn(
              "flex h-8.5 w-8.5 items-center justify-center rounded-lg text-white shadow-sm transition-all duration-300 outline-none cursor-pointer",
              isAdded ? "bg-emerald-500" : `${theme.btnBg} hover:scale-105 active:scale-95`
            )}
          >
            {isAdded ? (
              <CheckCircle className="h-4.5 w-4.5 stroke-[2.5]" />
            ) : (
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
