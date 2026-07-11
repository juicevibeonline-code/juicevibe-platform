"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { categories } from "@/data/menu";
import {
  Sparkles,
  Apple,
  CupSoda,
  Wine,
  Blend,
  Milk,
  IceCream,
  Coffee,
  Hamburger,
  Sandwich,
  CookingPot,
  Flame,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Apple,
  CupSoda,
  Wine,
  Blend,
  Milk,
  IceCream,
  Coffee,
  Hamburger,
  Sandwich,
  CookingPot,
  Flame,
};

interface MenuCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuCategoryFilter({ activeCategory, onCategoryChange }: MenuCategoryFilterProps) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-3 pt-1">
      {categories.map((category) => {
        const Icon = iconMap[category.icon];
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 outline-none select-none",
              isActive
                ? "text-white shadow-md shadow-primary/10"
                : "bg-white/40 border border-white/40 backdrop-blur-md text-gray-600 hover:bg-white/60 hover:text-dark-green"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryPill"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="absolute inset-0 z-0 rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/15"
              />
            )}
            {Icon && (
              <Icon
                className={cn(
                  "h-4 w-4 relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                )}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
