"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FloatingCart() {
  const { getTotals, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { count } = getTotals();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 md:bottom-6 md:right-6"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            
            <motion.div
              key={count}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-[10px] font-bold text-white shadow-sm"
            >
              {count}
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
