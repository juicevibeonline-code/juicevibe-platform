"use client";

import { forwardRef, type ButtonHTMLAttributes, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const idRef = useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = idRef.current++;

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.(e);
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          buttonRef.current = node;
        }}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" && [
            "bg-primary text-white shadow-lg shadow-primary/25",
            "hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30",
            "active:scale-[0.97]",
          ],
          variant === "secondary" && [
            "bg-dark-green text-white shadow-lg shadow-dark-green/25",
            "hover:bg-dark-green/90 hover:shadow-xl hover:shadow-dark-green/30",
            "active:scale-[0.97]",
          ],
          variant === "outline" && [
            "border-2 border-primary bg-transparent text-primary",
            "hover:bg-primary hover:text-white",
            "active:scale-[0.97]",
          ],
          variant === "ghost" && [
            "bg-transparent text-dark-green",
            "hover:bg-primary/10",
          ],
          size === "sm" && "h-10 px-5 text-sm",
          size === "md" && "h-12 px-8 text-base",
          size === "lg" && "h-14 px-10 text-lg",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute animate-ripple rounded-full bg-white/30"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        {loading ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
