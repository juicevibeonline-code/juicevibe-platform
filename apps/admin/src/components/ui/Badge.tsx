"use client";

import { cn } from "@juice-vibe/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-amber-500/15 dark:text-amber-400",
  danger: "bg-pink-100 text-pink-700 dark:bg-rose-500/15 dark:text-rose-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  outline: "bg-transparent border border-border text-muted",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}