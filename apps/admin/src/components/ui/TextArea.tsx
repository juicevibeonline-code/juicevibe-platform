"use client";

import * as React from "react";
import { cn } from "@juice-vibe/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="relative w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[10px] font-extrabold uppercase tracking-wider text-muted ml-0.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex w-full rounded-lg border border-border/80 bg-slate-50/50 dark:bg-zinc-900/30 px-3.5 py-2 text-xs text-foreground shadow-sm transition-all duration-200 resize-none",
            "focus:outline-none focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary/20",
            "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-rose-500 font-medium ml-1 mt-1">{error}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
