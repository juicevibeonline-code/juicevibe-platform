"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthSpinner } from "@/components/shared";
import { injectAuthStore, useAuthStore } from "@juice-vibe/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

injectAuthStore(useAuthStore as any);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, tokens } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken) {
      router.replace("/login");
    }
  }, [isAuthenticated, tokens, router]);

  if (!isAuthenticated || !tokens?.accessToken) {
    return <AuthSpinner />;
  }

  return (
    <div className="flex min-h-screen relative w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen w-[280px] p-4 z-50 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[280px] p-4 z-[70] md:hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-full bg-card/80 backdrop-blur-md shadow-md text-foreground hover:bg-card transition-colors border border-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full min-w-0 overflow-x-hidden">
        <Header onMobileMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 w-full px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
