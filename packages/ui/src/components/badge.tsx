import type { ReactNode } from "react";
import { cn } from "@juice-vibe/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "orange" | "pink" | "yellow";
  className?: string;
}

const variants = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-primary/10 text-primary",
  orange: "bg-orange/10 text-orange",
  pink: "bg-pink/10 text-pink",
  yellow: "bg-yellow/10 text-yellow",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2 py-1 rounded-full", variants[variant], className)}>
      {children}
    </span>
  );
}
