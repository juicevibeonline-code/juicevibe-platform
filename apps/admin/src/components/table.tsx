"use client";

import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@juice-vibe/utils";
import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@juice-vibe/ui/components/ui/table";

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" && document.activeElement !== searchInputRef.current) || 
          (e.key === "f" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-card border border-border/80 rounded-xl shadow-sm flex flex-col relative overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-zinc-900/10 shrink-0 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-primary transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full pl-9 pr-10 py-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-semibold"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-bold text-muted-foreground shadow-sm">
              <span>/</span>
            </kbd>
          </div>
          {data.length > 0 && (
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-background border border-border/60 px-2.5 py-1 rounded-md">
              {data.length} records
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <ShadcnTable>
          <TableHeader className="bg-slate-50/80 dark:bg-zinc-900/30 border-b border-border">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead 
                  key={col.key} 
                  className={cn(
                    "px-6 py-4 text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/30 transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-muted">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center text-muted">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center mb-3 border border-border">
                      <Search className="w-4 h-4 text-muted" />
                    </div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">No records found</p>
                    <p className="text-[10px] text-muted mt-1">Try adjusting your search query or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow 
                  key={item.id || i}
                  className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/10 border-b border-border/50 last:border-0 transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-6 py-4 text-xs font-semibold text-foreground">
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </ShadcnTable>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-slate-50/50 dark:bg-zinc-900/10 shrink-0">
          <span className="text-xs font-semibold text-muted">
            Page <strong className="text-foreground font-bold">{page}</strong> of <strong className="text-foreground font-bold">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-card border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-card border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
