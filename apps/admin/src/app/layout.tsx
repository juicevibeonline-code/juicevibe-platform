import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/AdminShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Juice Vibe Admin",
  description: "Juice Vibe Premium Café Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
