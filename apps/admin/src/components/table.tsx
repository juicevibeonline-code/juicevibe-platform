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

function CellRenderer<T>({ render, item }: { render: (item: T) => React.ReactNode; item: T }) {
  return <>{render(item)}</>;
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

  let displayData = [...data];

  if (searchQuery && !onSearch) {
    displayData = displayData.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  if (sortConfig && !onSort) {
    displayData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col relative overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-border bg-muted-background/50 shrink-0 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-foreground transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full pl-9 pr-10 h-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all text-foreground placeholder:text-muted shadow-sm"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted-background px-1.5 font-mono text-[10px] font-medium text-muted">
              <span>/</span>
            </kbd>
          </div>
          {displayData.length > 0 && (
            <span className="text-xs font-medium text-muted bg-background border border-border px-2.5 py-1 rounded-md">
              {displayData.length} records
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <ShadcnTable>
          <TableHeader className="bg-muted-background/50 border-b border-border">
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col) => (
                <TableHead 
                  key={col.key} 
                  className={cn(
                    "px-6 py-3.5 text-xs font-medium text-muted uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:bg-muted-background transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-muted">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-foreground" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-muted animate-pulse">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayData.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={columns.length} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center text-muted">
                    <div className="w-10 h-10 bg-muted-background rounded-lg flex items-center justify-center mb-3 border border-border">
                      <Search className="w-4 h-4 text-muted" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No records found</p>
                    <p className="text-xs text-muted mt-1">Try adjusting your search query or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item, i) => (
                <TableRow 
                  key={item.id || i}
                  className="hover:bg-muted-background/50 border-border transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-6 py-4 text-sm font-normal text-foreground">
                      {col.render ? (
                        <CellRenderer render={col.render} item={item} />
                      ) : (
                        item[col.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </ShadcnTable>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted-background/50 shrink-0">
          <span className="text-sm text-muted">
            Page <strong className="text-foreground font-medium">{page}</strong> of <strong className="text-foreground font-medium">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-md bg-background border border-border hover:bg-muted-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-md bg-background border border-border hover:bg-muted-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
