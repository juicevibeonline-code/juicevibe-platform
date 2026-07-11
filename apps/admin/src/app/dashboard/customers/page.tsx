"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@juice-vibe/services";
import { formatPrice, formatDate } from "@juice-vibe/utils";
import { 
  Users, 
  Search, 
  TrendingUp, 
  MapPin, 
  Award, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@juice-vibe/utils";
import { Badge } from "@juice-vibe/ui";

export default function CRMDirectory() {
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery<any[]>({
    queryKey: ["crmCustomers"],
    queryFn: () => authService.getCustomers(),
    retry: 1,
  });

  const fallbackCustomers = [
    { id: "cust-1", user: { name: "Priya Sharma", email: "priya@gmail.com", phone: "+94771234567" }, loyaltyPoints: 450, totalSpent: 12500, totalOrders: 14, createdAt: "2026-06-10T00:00:00Z" },
    { id: "cust-2", user: { name: "Arjun Nair", email: "arjun@yahoo.com", phone: "+94779876543" }, loyaltyPoints: 210, totalSpent: 7200, totalOrders: 8, createdAt: "2026-06-15T00:00:00Z" },
    { id: "cust-3", user: { name: "Neha Gupta", email: "neha@outlook.com", phone: "+94715556666" }, loyaltyPoints: 780, totalSpent: 24500, totalOrders: 21, createdAt: "2026-05-20T00:00:00Z" },
    { id: "cust-4", user: { name: "Rahul Verma", email: "rahul@blogger.com", phone: "+94723334444" }, loyaltyPoints: 120, totalSpent: 4300, totalOrders: 5, createdAt: "2026-07-01T00:00:00Z" }
  ];

  const currentCustomers: any[] = customers.length > 0 ? customers : fallbackCustomers;

  const filtered = currentCustomers.filter((c: any) => {
    const name = c.user?.name || "";
    const email = c.user?.email || "";
    const phone = c.user?.phone || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getTier = (points: number) => {
    if (points >= 500) return { label: "Gold Club", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
    if (points >= 200) return { label: "Silver Star", color: "text-muted-foreground bg-ink-dark border-border" };
    return { label: "Bronze Core", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  };

  return (
    <div className="space-y-6">
      {/* Header Desk Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            CRM Directory
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            CLIENT RELATIONSHIP MANAGEMENT & LIFETIME VALUE LOGS
          </p>
        </div>

        <div className="relative w-full max-w-xs flex items-center">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search CRM profile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* CRM Grid List */}
      {isLoading ? (
        <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
          Querying CRM indices records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">No CRM Profile Matches</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Try adjusting your search criteria parameters.
          </p>
        </div>
      ) : (
        <div className="terminal-card bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                  <th className="py-3 px-4 font-semibold">Client Name</th>
                  <th className="py-3 px-4 font-semibold">Security Identifier</th>
                  <th className="py-3 px-4 font-semibold">Loyalty Rank</th>
                  <th className="py-3 px-4 font-semibold">Volume (Orders)</th>
                  <th className="py-3 px-4 font-semibold">LTV Cumulative</th>
                  <th className="py-3 px-4 font-semibold">Joined System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((c: any) => {
                  const tier = getTier(c.loyaltyPoints);
                  return (
                    <tr key={c.id} className="hover:bg-ink-dark/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0 uppercase">
                            {c.user?.name?.slice(0, 2) || "CL"}
                          </div>
                          <span className="font-semibold text-foreground font-sans">{c.user?.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{c.user?.email}</span>
                          <span className="text-[10px] mt-0.5">{c.user?.phone || "No phone ID"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border", tier.color)}>
                            {tier.label}
                          </span>
                          <span className="font-numeral text-xs text-primary">{c.loyaltyPoints}pts</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-numeral">{c.totalOrders || 0} checks</td>
                      <td className="py-3.5 px-4 font-numeral text-primary font-bold">{formatPrice(c.totalSpent || 0)}</td>
                      <td className="py-3.5 px-4 text-[10px] text-muted-foreground">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
