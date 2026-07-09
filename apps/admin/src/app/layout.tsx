import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ToastProvider } from "@/hooks/useToast";

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
        <ToastProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
              <Header />
              <main className="p-8">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
