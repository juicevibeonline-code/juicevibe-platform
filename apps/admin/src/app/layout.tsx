import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Juice Vibe OS — Mission Control",
  description: "Official administrative operational platform for Juice Vibe.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} ${bricolageGrotesque.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-body antialiased selection:bg-primary selection:text-ink-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
