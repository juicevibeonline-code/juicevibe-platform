import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outlined";
  hover?: boolean;
}

function Card({ className, variant = "default", hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variant === "default" && "bg-white card-shadow",
        variant === "glass" && "glass",
        variant === "outlined" && "border border-primary/20 bg-white",
        hover && "card-shadow-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardContent, CardFooter };
