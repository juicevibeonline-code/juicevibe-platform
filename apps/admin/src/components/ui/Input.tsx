"use client";

import * as React from "react";
import { cn } from "@juice-vibe/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, success, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative w-full flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-[10px] font-extrabold uppercase tracking-wider text-muted ml-0.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border/80 bg-slate-50/50 dark:bg-zinc-900/30 px-3.5 py-2 text-xs text-foreground shadow-sm transition-all duration-200",
              "focus:outline-none focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary/20",
              "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5",
              success && "border-emerald-500 focus:border-emerald-500 bg-emerald-500/5",
              className
            )}
            {...props}
          />
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}
            {success && !error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-pink font-medium ml-1 mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";