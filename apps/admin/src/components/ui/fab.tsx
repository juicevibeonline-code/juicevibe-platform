"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@juice-vibe/utils";

export interface FABProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  icon: React.ReactNode;
}

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, position = "bottom-right", icon, ...props }, ref) => {
    const positionStyles = {
      "bottom-right": "bottom-8 right-8",
      "bottom-left": "bottom-8 left-8",
      "top-right": "top-8 right-8",
      "top-left": "top-8 left-8",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg focus:outline-none transition-shadow hover:shadow-xl",
          positionStyles[position],
          className
        )}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);
FAB.displayName = "FAB";
