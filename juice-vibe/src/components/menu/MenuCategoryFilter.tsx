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
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = iconMap[category.icon];
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-white text-gray-600 hover:bg-primary/5 hover:text-primary"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {category.name}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-primary"
                style={{ zIndex: -1 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
