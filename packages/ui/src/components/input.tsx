import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@juice-vibe/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-border bg-gray-50 text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-muted/60",
              "px-3 py-2",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-pink focus:ring-pink/20 focus:border-pink",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-xs text-pink">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
