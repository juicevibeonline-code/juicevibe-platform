"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ToastProvider } from "@/hooks/useToast";
import { ThemeProvider } from "@/components/theme-provider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <div className="admin-bg-gradient" />
        <div className="flex min-h-screen relative w-full bg-[#F8FFF8]">
          {/* Desktop Sidebar */}
          <div className="hidden md:block sticky top-0 h-screen w-[280px] p-4 z-50">
            <Sidebar />
          </div>

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
                      className="p-2 rounded-full bg-white/80 dark:bg-black/60 shadow-md text-foreground hover:bg-white transition-colors"
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
          <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
            <Header onMobileMenuClick={() => setMobileSidebarOpen(true)} />
            <main className="p-4 md:p-8 w-full">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
