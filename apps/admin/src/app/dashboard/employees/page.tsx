"use client";

import React, { useState } from "react";
import { formatPrice, formatDate } from "@juice-vibe/utils";
import { 
  ChefHat, 
  Search, 
  Plus, 
  Mail, 
  UserCheck, 
  Clock, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@juice-vibe/utils";
import { Badge } from "@juice-vibe/ui";

export default function StaffRoster() {
  const [search, setSearch] = useState("");

  const [employees, setEmployees] = useState([
    { id: "emp-1", employeeId: "JVM-001", position: "Head Chef", hireDate: "2026-01-10T00:00:00Z", isActive: true, user: { name: "Lakmal Perera", email: "lakmal@juicevibe.com", role: "kitchen" } },
    { id: "emp-2", employeeId: "JVM-002", position: "Senior Cashier", hireDate: "2026-02-15T00:00:00Z", isActive: true, user: { name: "Nimali Silva", email: "nimali@juicevibe.com", role: "cashier" } },
    { id: "emp-3", employeeId: "JVM-003", position: "General Manager", hireDate: "2026-01-05T00:00:00Z", isActive: true, user: { name: "Dulan Lakruwan", email: "manager@juicevibe.com", role: "manager" } },
    { id: "emp-4", employeeId: "JVM-004", position: "Juice Mixologist", hireDate: "2026-03-01T00:00:00Z", isActive: true, user: { name: "Kasun Jayawardena", email: "kasun@juicevibe.com", role: "kitchen" } },
  ]);

  const filtered = employees.filter((e: any) => 
    e.user.name.toLowerCase().includes(search.toLowerCase()) || 
    e.position.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Staff Roster
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            EMPLOYEE POSITIONS DIRECTORY & SHIFT SCHEDULING PANELS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs flex items-center">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search staff position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Roster list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((emp: any) => (
          <div 
            key={emp.id}
            className="terminal-card bg-card border border-border p-5 relative hover:border-primary/40 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm uppercase shrink-0">
                    {emp.user.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground font-heading leading-tight">
                      {emp.user.name}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground block mt-1">ID: {emp.employeeId}</span>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-ink-dark border border-border text-muted-foreground">
                  {emp.user.role}
                </span>
              </div>

              {/* Roster Details */}
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] border-t border-border/40 pt-3">
                <div>
                  <span className="text-muted-foreground uppercase block text-[9px] mb-0.5">Position</span>
                  <span className="text-foreground font-sans font-semibold">{emp.position}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase block text-[9px] mb-0.5">Shift bounds</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>08:00 AM - 05:00 PM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row / Status */}
            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4 text-[10px] font-mono">
              <span className="text-muted-foreground">Enrolled: {formatDate(emp.hireDate)}</span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>On Duty</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
