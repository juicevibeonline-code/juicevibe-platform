"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@juice-vibe/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Drawer({ isOpen, onClose, title, children, className, position = "right", size = "md" }: DrawerProps) {
  // Prevent scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-[100vw]",
  };

  const slideVariants = {
    right: {
      initial: { opacity: 0, x: "100%" },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: "100%" },
    },
    left: {
      initial: { opacity: 0, x: "-100%" },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: "-100%" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative h-full w-full glass-panel shadow-2xl flex flex-col bg-white/80 dark:bg-black/80",
              position === "right" ? "ml-auto" : "mr-auto",
              position === "right" ? "rounded-l-3xl border-l" : "rounded-r-3xl border-r",
              sizes[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-white/50 dark:bg-black/20">
                <h2 className="text-xl font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 z-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors bg-white/50 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
