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
      <div className="relative w-full flex flex-col gap-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1"
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
              "flex h-12 w-full rounded-xl border border-transparent bg-white/60 dark:bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-300",
              "focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)]",
              "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-pink/50 focus:border-pink focus:shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-pink/5",
              success && "border-primary/50 bg-primary/5",
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