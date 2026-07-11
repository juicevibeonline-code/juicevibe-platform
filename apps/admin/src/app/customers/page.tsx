"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag, AlertCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { authService } from "@juice-vibe/services";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, sorting, and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getCustomers();
      // Safely map incoming roles
      const formatted = (data || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || u.customer?.phone || "",
        orderCount: u.customer?.totalOrders || 0,
        totalSpent: u.customer?.totalSpent || 0,
        createdAt: u.createdAt,
      }));
      setCustomers(formatted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load customers from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 1. Filter
  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    let fieldA = a[sortField as keyof Customer];
    let fieldB = b[sortField as keyof Customer];

    if (fieldA === undefined) fieldA = "";
    if (fieldB === undefined) fieldB = "";

    if (typeof fieldA === "string") {
      fieldA = (fieldA as string).toLowerCase();
      fieldB = (fieldB as string).toLowerCase();
    }

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Paginate
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{item.name[0]}</span>
          </div>
          <span className="font-medium text-foreground text-sm">{item.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      sortable: true,
      render: (item: Customer) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <Mail className="w-3 h-3 text-muted shrink-0" />
            {item.email}
          </div>
          {item.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Phone className="w-3 h-3 shrink-0" />
              {item.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "orderCount",
      label: "Orders",
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <ShoppingBag className="w-3.5 h-3.5 text-muted" />
          {item.orderCount ?? 0}
        </div>
      ),
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (item: Customer) => (
        <span className="text-sm font-semibold text-foreground">
          LKR {(item.totalSpent ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (item: Customer) =>
        item.createdAt ? (
          <span className="text-xs text-muted">
            {new Date(item.createdAt).toLocaleDateString([], { month: "short", year: "numeric" })}
          </span>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers in your database`}
        accentColor="pink"
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider animate-pulse">Loading customers...</span>
        </div>
      ) : (
        <Table
          columns={columns}
          data={paginated}
          searchable
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onSort={(key, dir) => {
            setSortField(key);
            setSortDirection(dir);
          }}
          page={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </div>
  );
}
