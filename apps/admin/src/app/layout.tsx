import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/AdminShell";
import { AuthGuard } from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-data" });

export const metadata: Metadata = {
  title: "Juice Vibe Admin",
  description: "Juice Vibe Premium Café Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} font-sans`}>
        <AuthGuard>
          <AdminShell>{children}</AdminShell>
        </AuthGuard>
      </body>
    </html>
  );
}
