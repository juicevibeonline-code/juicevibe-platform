"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@juice-vibe/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden cursor-pointer";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm shadow-primary/10",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 border border-border/40",
      outline: "border border-border/80 bg-transparent text-foreground hover:bg-slate-50 dark:hover:bg-zinc-900",
      ghost: "bg-transparent text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-500/10",
      glass: "glass-panel text-foreground hover:bg-white/80 dark:hover:bg-white/10",
    };

    const sizes = {
      sm: "h-8 px-3.5 text-[10px] rounded-lg",
      md: "h-10 px-4 text-xs rounded-lg",
      lg: "h-12 px-6 text-sm rounded-xl",
      icon: "h-10 w-10 rounded-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : null}
        <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
          {children}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";