"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@juice-vibe/services";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Search, 
  Terminal, 
  Leaf, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Package,
  AlertCircle
} from "lucide-react";
import { LoadingSpinner } from "@juice-vibe/ui";
import { cn } from "@juice-vibe/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiConversation, setAiConversation] = useState<{ role: "user" | "system"; text: string }[]>([
    { role: "system", text: "Systems online. Ask me about inventory warnings, revenue status, or shift summaries." }
  ]);

  // Auth Guard redirect
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user) {
        if (pathname === "/dashboard" || pathname === "/dashboard/") {
          if (user.role === "kitchen" || user.role === "cashier") {
            router.replace("/dashboard/orders");
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  // Keyboard shortcut listener for Command Palette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="h-8 w-8 text-primary" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Verifying Authorization...</span>
        </div>
      </div>
    );
  }

  const userRole = user?.role || "admin";

  const allCommands = [
    { name: "Go to Mission Control", desc: "Overview analytics dashboard", action: () => router.push("/dashboard"), roles: ["admin", "manager"] },
    { name: "Open Order Desk", desc: "Manage live customer orders", action: () => router.push("/dashboard/orders"), roles: ["admin", "manager", "cashier", "kitchen", "editor"] },
    { name: "View Menu Catalog", desc: "Edit categories and beverages", action: () => router.push("/dashboard/menu"), roles: ["admin", "manager", "cashier", "kitchen", "editor"] },
    { name: "Inventory Log", desc: "Check raw materials inventory", action: () => router.push("/dashboard/inventory"), roles: ["admin", "manager", "cashier", "kitchen", "editor"] },
    { name: "Tables & QR Codes", desc: "Manage dine-in tables and QR codes", action: () => router.push("/dashboard/tables"), roles: ["admin", "manager", "cashier"] },
    { name: "Workspace Settings", desc: "Adjust system variables", action: () => router.push("/dashboard/settings"), roles: ["admin", "manager"] },
  ];

  const commands = allCommands.filter((c) => c.roles.includes(userRole));

  const filteredCommands = commands.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userText = aiMessage;
    setAiConversation((prev) => [...prev, { role: "user", text: userText }]);
    setAiMessage("");

    // Simulate AI Business Insights
    setTimeout(() => {
      let reply = "Processing business logs...";
      const query = userText.toLowerCase();

      if (query.includes("revenue") || query.includes("sales")) {
        reply = "Revenue totals are currently at LKR 125,430. Growth is up +14% compared to this hour yesterday. Smoothies continue to lead sales volume.";
      } else if (query.includes("stock") || query.includes("inventory") || query.includes("warn")) {
        reply = "Alert: Mango pulp inventory is at 4.2kg (minimum target threshold is 5.0kg). Passion fruit count is also decreasing.";
      } else if (query.includes("order") || query.includes("live")) {
        reply = "Active orders: 4 in preparation, 1 ready for pickup. Average kitchen preparation time is at 8m 42s.";
      } else {
        reply = "Operational log summary: All systems are nominal. Seeding variables indicate a healthy checkout pipeline. Let me know if I should compile a PDF dispatch.";
      }

      setAiConversation((prev) => [...prev, { role: "system", text: reply }]);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Collapsible Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-card z-40 md:hidden"
            >
              <Sidebar collapsed={false} setCollapsed={() => {}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header
          sidebarCollapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleAiPanel={() => setAiPanelOpen(!aiPanelOpen)}
          aiPanelOpen={aiPanelOpen}
          notificationCount={2}
          onOpenNotifications={() => alert("Notification center: [System Notice] Low stock count on Mango Pulp.")}
        />

        <main className="flex-1 overflow-y-auto bg-background p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant Sliding Panel (Dockable on Right) */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="w-80 md:w-96 border-l border-border bg-card flex flex-col h-screen shrink-0 z-10 shadow-2xl relative"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-bold font-heading">AI Business Insights</span>
              </div>
              <button
                onClick={() => setAiPanelOpen(false)}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-[11px]">
              {aiConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg border leading-relaxed",
                    msg.role === "user"
                      ? "bg-ink-dark/60 border-border text-foreground ml-8 text-right"
                      : "bg-primary/5 border-primary/20 text-primary mr-8"
                  )}
                >
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                    {msg.role === "user" ? `// OPERATOR (${user?.name})` : "// SYSTEM INSIGHT"}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAiSend} className="p-3 border-t border-border bg-ink-dark/30">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask for stats or stock warnings..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2.5 rounded-lg pr-10 focus:outline-none focus:border-primary/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Overlay Modal (Linear Style) */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Type a workspace command or path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 border-none outline-none font-mono text-xs"
                  autoFocus
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded cursor-pointer hover:text-foreground"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => {
                        cmd.action();
                        setCommandPaletteOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-ink-dark/60 border border-transparent hover:border-border/30 group transition-all text-xs cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {cmd.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {cmd.desc}
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground font-mono">
                    No system commands match search parameter.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
