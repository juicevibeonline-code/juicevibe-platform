import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "orange" | "pink" | "yellow" | "outline";
}

function Badge({ className, variant = "primary", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variant === "primary" && "bg-primary/10 text-primary",
        variant === "orange" && "bg-orange/10 text-orange",
        variant === "pink" && "bg-pink/10 text-pink",
        variant === "yellow" && "bg-yellow/10 text-yellow-800",
        variant === "outline" && "border border-primary/30 text-primary",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
