"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 transition-all",
              "placeholder:text-gray-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-11",
              error && "border-pink focus-visible:ring-pink",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-pink">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
