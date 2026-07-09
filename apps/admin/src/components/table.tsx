"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

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
}

export function Table<T extends Record<string, any>>({
  columns, data, isLoading, searchable, onSearch,
  page = 1, totalPages = 1, onPageChange,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
      {searchable && (
        <div className="p-5 border-b border-border/50 bg-white/40">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-transparent bg-white/60 text-sm focus:outline-none focus:bg-white focus:border-primary/30 focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 backdrop-blur-md">
            <tr className="border-b border-border/50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-sm text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-white/80 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-5 border-t border-border/50 bg-white/40">
          <span className="text-sm font-medium text-gray-500">Page <strong className="text-gray-900">{page}</strong> of <strong className="text-gray-900">{totalPages}</strong></span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl bg-white border border-border/50 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-xl bg-white border border-border/50 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
