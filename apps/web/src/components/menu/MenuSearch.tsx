"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-300",
        isFocused ? "shadow-lg shadow-primary/5" : "shadow-sm"
      )}
    >
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300",
          isFocused ? "text-primary" : "text-gray-400"
        )}
      />
      <input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-14 w-full rounded-2xl border border-white/50 bg-white/45 backdrop-blur-md pl-12 pr-4 text-base font-medium text-dark-green placeholder-gray-500/70 transition-all duration-300 focus:border-primary/60 focus:bg-white/65 focus:outline-none focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}
