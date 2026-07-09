"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, Leaf, Flame, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
  const theme = categoryThemes[item.category] || {
    glow: "from-primary/15 to-transparent",
    btnBg: "bg-primary hover:bg-primary-dark shadow-primary/20",
    badgeBg: "bg-primary/5 text-primary border-primary/10",
    badgeText: "text-primary",
    emoji: "🌿",
    tag: "Fresh",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.02, type: "spring", stiffness: 100, damping: 18 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div className="group relative flex flex-col justify-between h-full rounded-[2.5rem] bg-white/45 backdrop-blur-xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:border-white/70 transition-all duration-500 overflow-hidden">
        
        {/* Top Badges Row */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
          <span className={cn("px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider", theme.badgeBg)}>
            {theme.tag}
          </span>
          {item.popular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 text-[10px] font-extrabold uppercase tracking-wider">
              <Star className="h-3 w-3 fill-current" />
              Popular
            </span>
          )}
        </div>

        {/* Dynamic Glowing Image Container */}
        <div className="relative w-full h-52 flex items-center justify-center mb-6 mt-2">
          {/* Radial category glow */}
          <div className={cn("absolute inset-0 rounded-full blur-3xl opacity-70 z-0 bg-radial pointer-events-none scale-90", theme.glow)} />
          
          {item.image ? (
            <div className="relative w-44 h-44 z-10 drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)] animate-float-slow group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out">
              <Image
                src={encodeURI(item.image)}
                alt={item.name}
                fill
                sizes="(max-w-768px) 150px, 180px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="relative text-7xl select-none z-10 animate-float group-hover:scale-110 transition-transform duration-500">
              {theme.emoji}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col justify-start mb-6">
          <h3 className="font-heading text-xl font-extrabold text-dark-green tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <p className="mt-2 text-sm text-gray-500/90 leading-relaxed font-medium">
            {item.description}
          </p>
          {item.flavours && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.flavours.map((flavour) => (
                <span key={flavour} className="text-[10px] font-semibold bg-primary/5 text-primary border border-primary/10 rounded-md px-1.5 py-0.5">
                  {flavour}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions (Price & Order CTA) */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-dark-green/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">Price</span>
            <span className="font-heading text-2xl font-black text-dark-green mt-1">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            aria-label={`Order ${item.name}`}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg active:scale-90 hover:scale-105 hover:rotate-90 transition-all duration-300 outline-none",
              theme.btnBg
            )}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
