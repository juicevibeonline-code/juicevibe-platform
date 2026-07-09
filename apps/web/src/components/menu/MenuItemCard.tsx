"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, Leaf, Flame, Sparkles, CheckCircle } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { MenuItem } from "@/data/menu";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

// Category theme mapping for ambient glows, badges, and button highlights
const categoryThemes: Record<
  string,
  {
    glow: string;
    btnBg: string;
    badgeBg: string;
    badgeText: string;
    emoji: string;
    tag: string;
  }
> = {
  milkshakes: {
    glow: "from-orange-400/20 via-amber-400/5 to-transparent",
    btnBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20",
    badgeBg: "bg-orange-50 text-orange-600 border-orange-200/40",
    badgeText: "text-orange-600",
    emoji: "🥤",
    tag: "Creamy",
  },
  "fresh-juices": {
    glow: "from-green-400/20 via-emerald-400/5 to-transparent",
    btnBg: "bg-primary hover:bg-primary-dark shadow-primary/20",
    badgeBg: "bg-green-50 text-green-600 border-green-200/40",
    badgeText: "text-green-600",
    emoji: "🍎",
    tag: "100% Pure",
  },
  smoothies: {
    glow: "from-emerald-400/25 via-yellow-400/5 to-transparent",
    btnBg: "bg-primary hover:bg-primary-dark shadow-primary/20",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200/40",
    badgeText: "text-emerald-600",
    emoji: "🍹",
    tag: "Organic",
  },
  lassi: {
    glow: "from-yellow-400/25 via-orange-300/5 to-transparent",
    btnBg: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/20",
    badgeBg: "bg-yellow-50 text-yellow-600 border-yellow-200/40",
    badgeText: "text-yellow-600",
    emoji: "🥛",
    tag: "Blended",
  },
  tea: {
    glow: "from-amber-500/15 via-yellow-600/5 to-transparent",
    btnBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200/40",
    badgeText: "text-amber-700",
    emoji: "🍵",
    tag: "Freshly Brewed",
  },
  coffee: {
    glow: "from-yellow-900/15 via-amber-900/5 to-transparent",
    btnBg: "bg-yellow-800 hover:bg-yellow-900 shadow-yellow-800/20",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200/40",
    badgeText: "text-amber-800",
    emoji: "☕",
    tag: "Espresso base",
  },
  mocktails: {
    glow: "from-pink-400/20 via-rose-300/5 to-transparent",
    btnBg: "bg-pink-500 hover:bg-pink-600 shadow-pink-500/20",
    badgeBg: "bg-pink-50 text-pink-600 border-pink-200/40",
    badgeText: "text-pink-600",
    emoji: "🍷",
    tag: "Refreshing",
  },
  "ice-cream": {
    glow: "from-pink-400/20 via-orange-300/5 to-transparent",
    btnBg: "bg-pink-500 hover:bg-pink-600 shadow-pink-500/20",
    badgeBg: "bg-pink-50 text-pink-600 border-pink-200/40",
    badgeText: "text-pink-600",
    emoji: "🍨",
    tag: "Sweet Delight",
  },
  burgers: {
    glow: "from-orange-500/20 via-red-400/5 to-transparent",
    btnBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200/40",
    badgeText: "text-orange-700",
    emoji: "🍔",
    tag: "Hot & Grilled",
  },
  sandwiches: {
    glow: "from-emerald-400/15 via-green-300/5 to-transparent",
    btnBg: "bg-green-700 hover:bg-green-800 shadow-green-700/20",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/40",
    badgeText: "text-emerald-700",
    emoji: "🥪",
    tag: "Toasted",
  },
};

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const theme = categoryThemes[item.category] || {
    glow: "from-primary/15 to-transparent",
    btnBg: "bg-primary hover:bg-primary-dark shadow-primary/20",
    badgeBg: "bg-primary/5 text-primary border-primary/10",
    badgeText: "text-primary",
    emoji: "🌿",
    tag: "Fresh",
  };

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.02, type: "spring", stiffness: 100, damping: 18 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div className="group relative flex flex-col justify-between h-full rounded-[2rem] bg-white/70 dark:bg-[#111813]/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] hover:bg-white dark:hover:bg-[#111813]/85 hover:border-white dark:hover:border-white/15 transition-all duration-500 p-5 overflow-hidden">
        
        {/* Dynamic Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50/80 to-gray-100/40 dark:from-white/5 dark:to-white/10 border border-gray-100 dark:border-white/5 flex items-center justify-center mb-5">
          {/* Top Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
            <span className={cn("px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider shadow-sm", theme.badgeBg)}>
              {theme.tag}
            </span>
            {item.popular && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/25 text-amber-600 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                <Star className="h-2.5 w-2.5 fill-current" />
                Popular
              </span>
            )}
          </div>

          {/* Radial category glow */}
          <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-60 z-0 bg-radial pointer-events-none scale-75 transition-transform duration-500 group-hover:scale-95", theme.glow)} />
          
          {item.image ? (
            <div className="relative w-[75%] h-[75%] z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-500 ease-out">
              <Image
                src={encodeURI(item.image)}
                alt={item.name}
                fill
                sizes="(max-w-768px) 150px, 180px"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="relative text-6xl select-none z-10 group-hover:scale-110 group-hover:-translate-y-1.5 transition-transform duration-500">
              {theme.emoji}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col justify-start mb-4">
          <h3 className="font-heading text-lg font-extrabold text-dark-green dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
            {item.description}
          </p>
          {item.flavours && (
            <div className="mt-3 flex flex-wrap gap-1">
              {item.flavours.map((flavour) => (
                <span key={flavour} className="text-[9px] font-semibold bg-primary/5 text-primary border border-primary/10 rounded-md px-1.5 py-0.5">
                  {flavour}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions (Price & Order CTA) */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">Price</span>
            <span className="font-heading text-xl font-black text-dark-green dark:text-primary mt-1">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Order ${item.name}`}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md active:scale-95 hover:scale-105 transition-all duration-300 outline-none",
              isAdded ? "bg-green-500 shadow-green-500/30" : `${theme.btnBg} hover:rotate-90`
            )}
          >
            {isAdded ? (
              <CheckCircle className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <Plus className="h-5 w-5 stroke-[2.5]" />
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
