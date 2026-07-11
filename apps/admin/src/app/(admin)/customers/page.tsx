"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag, AlertCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState, ErrorAlert } from "@/components/shared";
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
      render: (item: Customer) => {
        const colors = [
          { bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
          { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
          { bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
          { bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
          { bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
        ];
        const firstLetter = (item.name[0] || "A").toUpperCase();
        const code = firstLetter.charCodeAt(0);
        const style = colors[code % colors.length] || colors[0];
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${style.bg}`}>
              {firstLetter}
            </div>
            <span className="font-bold text-foreground text-xs">{item.name}</span>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Contact",
      sortable: true,
      render: (item: Customer) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
            <Mail className="w-3 h-3 text-muted shrink-0" />
            {item.email}
          </div>
          {item.phone && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
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
        <div className="flex items-center gap-1.5 text-xs font-semibold">
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
        <span className="text-xs font-bold text-primary">
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers in your database`}
      />

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState label="Loading customers..." />
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
