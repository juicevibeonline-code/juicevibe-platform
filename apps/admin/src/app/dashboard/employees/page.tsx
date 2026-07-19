"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { 
  ChefHat, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock,
  Loader2
} from "lucide-react";

export default function StaffRoster() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [hireDate, setHireDate] = useState("");

  // Query
  const { data: employees = [], isLoading } = useQuery<any[]>({
    queryKey: ["employees"],
    queryFn: () => employeeService.getEmployees(),
    retry: 1,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (input: any) => employeeService.createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to create employee");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => employeeService.updateEmployee(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to update employee");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to deactivate employee");
    },
  });

  const filtered = employees.filter((emp: any) => 
    emp.user.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.position.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setEmployeeId("");
    setName("");
    setEmail("");
    setPassword("");
    setRole("cashier");
    setPosition("");
    setSalary(0);
    setHireDate("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditingEmployee(emp);
    setEmployeeId(emp.employeeId);
    setName(emp.user.name);
    setEmail(emp.user.email);
    setPassword("");
    setRole(emp.user.role);
    setPosition(emp.position);
    setSalary(emp.salary || 0);
    setHireDate(emp.hireDate ? emp.hireDate.split("T")[0] : "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !position.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!editingEmployee && !password) {
      alert("Password is required for new employees");
      return;
    }

    const payload: any = {
      name,
      email,
      role,
      position,
      salary: salary ? Number(salary) : undefined,
      hireDate: hireDate || undefined,
    };

    if (password) {
      payload.password = password;
    }

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, input: payload });
    } else {
      payload.employeeId = employeeId;
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate and remove ${name} from the staff roster?`)) {
      deleteMutation.mutate(id);
    }
  };

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

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer"
          >
            <Plus className="h-4 w-4 text-ink-dark" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Roster list */}
      {isLoading ? (
        <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
          Querying staff directories...
        </div>
      ) : filtered.length === 0 ? (
        <div className="terminal-card p-12 text-center border border-border bg-card">
          <ChefHat className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground font-heading">No Staff Found</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Register new employee credentials above.
          </p>
        </div>
      ) : (
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

                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-ink-dark border border-border text-primary">
                    {emp.user.role}
                  </span>
                </div>

                {/* Roster Details */}
                <div className="grid grid-cols-2 gap-4 font-mono text-[10px] border-t border-border/40 pt-3">
                  <div>
                    <span className="text-muted-foreground uppercase block text-[9px] mb-0.5">Position</span>
                    <span className="text-foreground font-sans font-semibold text-xs">{emp.position}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground uppercase block text-[9px] mb-0.5">Salary bounds</span>
                    <span className="text-foreground font-semibold">
                      {emp.salary ? `LKR ${emp.salary.toLocaleString()}` : "Not Disclosed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row / Status / Actions */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4 text-[10px] font-mono">
                <span className="text-muted-foreground">Enrolled: {formatDate(emp.hireDate)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(emp)}
                    className="p-1 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id, emp.user.name)}
                    className="p-1 border border-border hover:border-pink/40 text-muted-foreground hover:text-pink rounded cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-ink-dark/30">
              <h2 className="text-sm font-bold text-foreground font-heading uppercase tracking-wider">
                {editingEmployee ? `Edit Staff // ${editingEmployee.user.name}` : "Register Staff Member"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Employee ID</label>
                  <input
                    type="text"
                    placeholder="JVM-005"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                    disabled={!!editingEmployee}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kasun Perera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    placeholder="kasun@juicevibe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {editingEmployee ? "New Password (Optional)" : "Security Password"}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required={!editingEmployee}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Café Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Juice Mixologist"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Base Salary (LKR)</label>
                  <input
                    type="number"
                    placeholder="45000"
                    value={salary || ""}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Hire Date</label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-ink-dark/30 text-muted-foreground text-xs font-mono rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-ink-dark text-xs font-mono font-bold rounded-lg uppercase tracking-wider cursor-pointer flex items-center justify-center min-w-[120px]"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save Member"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
