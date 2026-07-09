import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ToastProvider } from "@/hooks/useToast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Juice Vibe Admin",
  description: "Juice Vibe Premium Café Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <div className="admin-bg-gradient" />
          <div className="flex min-h-screen relative w-full bg-[#F8FFF8]">
            {/* Sidebar Container */}
            <div className="hidden md:block sticky top-0 h-screen w-[280px] p-4 z-50">
              <Sidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
              <Header />
              <main className="p-4 md:p-8 w-full">{children}</main>
            </div>
          </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
