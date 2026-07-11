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
    const baseStyles = "relative inline-flex items-center justify-center font-medium tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden cursor-pointer whitespace-nowrap";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      secondary: "bg-muted-background text-foreground hover:bg-muted/10 border border-border",
      outline: "border border-border bg-transparent text-foreground hover:bg-muted/10",
      ghost: "bg-transparent text-foreground hover:bg-muted/10",
      danger: "bg-danger text-danger-foreground hover:bg-danger/90 shadow-sm",
      glass: "glass-panel text-foreground hover:bg-white/80 dark:hover:bg-white/10",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-sm",
      md: "h-10 px-4 text-sm rounded-md",
      lg: "h-11 px-8 text-sm rounded-md",
      icon: "h-10 w-10 rounded-md",
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