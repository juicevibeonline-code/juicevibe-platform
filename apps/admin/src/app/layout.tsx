import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";

// Production Build Marker: 2026-07-27-01
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('juice-theme') || 'dark';
                  if (theme === 'system') {
                    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    theme = darkQuery.matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-body antialiased selection:bg-primary selection:text-ink-dark">
        <ThemeProvider defaultTheme="dark" storageKey="juice-theme">
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
