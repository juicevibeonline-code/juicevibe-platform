"use client";

import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@juice-vibe/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

export function Table<T extends Record<string, any>>({
  columns, data, isLoading, searchable, onSearch,
  page = 1, totalPages = 1, onPageChange, onSort
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-sm flex flex-col relative">
      {searchable && (
        <div className="p-5 border-b border-border/50 bg-white/40 dark:bg-black/20 shrink-0">
          <div className="relative max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-transparent bg-white/60 dark:bg-white/10 text-sm focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:border-primary/30 focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={cn(
                    "px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap",
                    col.sortable && "cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-50 hover:opacity-100 transition-opacity" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={columns.length} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
                      <span className="text-sm font-bold text-muted animate-pulse">Loading data...</span>
                    </div>
                  </td>
                </motion.tr>
              ) : data.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={columns.length} className="text-center py-24">
                    <div className="flex flex-col items-center justify-center text-muted">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No records found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                data.map((item, i) => (
                  <motion.tr 
                    key={item.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/80 dark:hover:bg-white/5 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm font-medium text-foreground transition-colors">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-5 border-t border-border/50 bg-white/40 dark:bg-black/20 shrink-0">
          <span className="text-sm font-medium text-muted">
            Page <strong className="text-foreground font-bold">{page}</strong> of <strong className="text-foreground font-bold">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl bg-white dark:bg-white/5 border border-border/50 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-muted" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-xl bg-white dark:bg-white/5 border border-border/50 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
