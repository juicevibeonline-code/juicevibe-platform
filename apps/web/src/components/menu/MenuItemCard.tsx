"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
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

const slugImageMap: Record<string, string> = {
  // Milkshakes
  "chocolate-milkshake": "/images/MenuItems/milkshake-chocolate.png",
  "vanilla-milkshake": "/images/MenuItems/milkshake-vanilla.png",
  "strawberry-milkshake": "/images/MenuItems/milkshake-strawberry.png",
  "mango-milkshake": "/images/MenuItems/milkshake-mango.png",
  "passion-fruit-milkshake": "/images/MenuItems/milkshake-passion-fruit.png",
  "banana-milkshake": "/images/MenuItems/milkshake-banana.png",
  "mixed-fruit-milkshake": "/images/MenuItems/milkshake-mixed-fruit.jpg",
  "date-almond-milkshake": "/images/MenuItems/milkshake-date-almond.png",
  "falooda-milkshake": "/images/MenuItems/milkshake-falooda.jpg",

  // Fresh Juices
  "avocado-juice": "/images/MenuItems/juice-avocado.png",
  "lime-juice": "/images/MenuItems/juice-lime.png",
  "mango-juice": "/images/MenuItems/juice-mango.png",
  "mixed-fruit-juice": "/images/MenuItems/juice-mixed-fruit.jpg",
  "orange-juice": "/images/MenuItems/juice-orange.png",
  "papaya-juice": "/images/MenuItems/juice-papaya.png",
  "passion-fruit-juice": "/images/MenuItems/juice-passion-fruit.jpg",
  "pineapple-juice": "/images/MenuItems/juice-pineapple.png",
  "soursop-juice": "/images/MenuItems/juice-soursop.png",
  "watermelon-juice": "/images/MenuItems/juice-watermelon.png",
  "wood-apple-juice": "/images/MenuItems/juice-wood-apple.png",
  "ambarella-juice": "/images/MenuItems/juice-ambarella.png",
  "coconut-juice": "/images/MenuItems/juice-coconut.png",
  "grapes-juice": "/images/MenuItems/juice-grapes.png",

  // Smoothies
  "avocado-dates-smoothie": "/images/MenuItems/smoothie-avocado-dates.png",
  "wood-apple-zest-smoothie": "/images/MenuItems/smoothie-wood-apple-zest.png",
  "tropical-smoothie-bowl": "/images/MenuItems/tropical_smoothie_bowl.png",

  // Lassi
  "classic-lassi": "/images/MenuItems/lassi-classic.png",
  "mango-lassi": "/images/MenuItems/lassi-mango.png",
  "passion-fruit-lassi": "/images/MenuItems/lassi-passion-fruit.png",
  "orange-lassi": "/images/MenuItems/lassi-orange.png",

  // Tea
  "english-breakfast-tea": "/images/MenuItems/tea-english-breakfast.png",
  "green-tea": "/images/MenuItems/tea-green.png",
  "ginger-tea": "/images/MenuItems/tea-ginger.png",
  "lemon-tea": "/images/MenuItems/tea-lemon.png",
  "mint-tea": "/images/MenuItems/tea-mint.png",

  // Coffee
  "americano": "/images/MenuItems/coffee-americano.png",
  "espresso": "/images/MenuItems/coffee-espresso.png",
  "cappuccino": "/images/MenuItems/coffee-cappuccino.png",

  // Mocktails
  "classic-virgin-mojito": "/images/MenuItems/mocktail-classic-virgin-mojito.png",
  "flavoured-mojito": "/images/MenuItems/mocktail-flavoured-mojito.png",
  "passion-fruit-mojito": "/images/MenuItems/passionfruit_mojito_mocktail.png",

  // Fruits & Ice Cream
  "jaggery-cashew-dream": "/images/MenuItems/icecream-jaggery-cashew-dream.jpg",
  "banana-boat": "/images/MenuItems/icecream-banana-boat.png",
  "fruit-salad": "/images/MenuItems/icecream-fruit-salad.png",
  "fruit-salad-with-ice-cream": "/images/MenuItems/icecream-fruit-salad-with-icecream.png",
  "ice-cream-3-scoops": "/images/MenuItems/icecream-3-scoops.png",

  // Burgers
  "chicken-burger": "/images/MenuItems/burger-chicken.png",
  "veg-cheese-burger": "/images/MenuItems/burger-veg-cheese.png",

  // Sandwiches
  "cheese-tomato-sandwich": "/images/MenuItems/sandwich-cheese-tomato.png",
  "chicken-ham-cheese-sandwich": "/images/MenuItems/sandwich-chicken-ham-cheese.png",
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

  const itemImage = item.thumbnail || (item.images && item.images[0]) || (item as any).image || slugImageMap[item.slug];
  const [imgSrc, setImgSrc] = useState<string | null>(itemImage || slugImageMap[item.slug] || null);

  // Keep imgSrc updated when props or tab changes
  useEffect(() => {
    setImgSrc(item.thumbnail || (item.images && item.images[0]) || (item as any).image || slugImageMap[item.slug] || null);
  }, [item.thumbnail, item.images, item.slug]);

  const isPng = imgSrc?.toLowerCase().endsWith(".png");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="h-full"
    >
      <div className="group relative flex flex-col justify-between h-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100/80 dark:border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_28px_rgba(34,197,94,0.06)] hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-500 p-4 overflow-hidden">
        
        {/* Full-width Image Section */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-slate-50/90 to-slate-100/50 dark:from-zinc-800/80 dark:to-zinc-900/60 border border-slate-100/60 dark:border-zinc-800/40 flex items-center justify-center mb-4">
          
          {/* Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
            <span className={cn("px-2.5 py-0.75 rounded-full text-[8px] font-extrabold uppercase tracking-widest shadow-sm border backdrop-blur-md", theme.badgeBg)}>
              {theme.tag}
            </span>
            {item.isPopular && (
              <span className="inline-flex items-center gap-0.5 px-2.5 py-0.75 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-extrabold uppercase tracking-widest shadow-sm">
                <Star className="h-2 w-2 fill-current" />
                Popular
              </span>
            )}
          </div>
          
          {imgSrc ? (
            <div className="relative w-full h-full z-10 transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={imgSrc}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className={cn(
                  "transition-all duration-500",
                  isPng ? "object-contain p-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]" : "object-cover"
                )}
                onError={() => setImgSrc(null)}
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
          <h3 className="font-heading text-sm font-extrabold text-dark-green dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <p className="mt-1.5 text-[11px] text-gray-500/90 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
            {item.description}
          </p>
          {item.variants && item.variants.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {item.variants.map((v) => (
                <span key={v.id} className="text-[9px] font-bold bg-primary/5 text-primary border border-primary/10 rounded px-1.5 py-0.5">
                  {v.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800/80 mt-auto">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400/90 dark:text-zinc-500 uppercase tracking-widest leading-none">Price</span>
            <span className="font-mono text-sm font-bold text-dark-green dark:text-primary mt-1">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Order ${item.name}`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm transition-all duration-300 outline-none cursor-pointer",
              isAdded ? "bg-emerald-500" : `${theme.btnBg} hover:scale-105 active:scale-95`
            )}
          >
            {isAdded ? (
              <CheckCircle className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
