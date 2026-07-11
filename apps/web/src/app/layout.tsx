import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { CartDrawer } from "@/components/cart/CartDrawer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Juice Vibe - Sip the Good Vibes",
    template: "%s | Juice Vibe",
  },
  description:
    "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love. Experience the best juice bar with premium quality drinks and food.",
  keywords: [
    "juice bar",
    "fresh juices",
    "smoothies",
    "healthy drinks",
    "juice vibe",
    "tropical drinks",
    "organic juices",
    "milkshakes",
    "mocktails",
    "burgers",
    "cafe",
  ],
  authors: [{ name: "Juice Vibe" }],
  creator: "Juice Vibe",
  publisher: "Juice Vibe",
  metadataBase: new URL("https://juicevibe.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://juicevibe.com",
    siteName: "Juice Vibe",
    title: "Juice Vibe - Sip the Good Vibes",
    description:
      "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love.",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Juice Vibe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Vibe - Sip the Good Vibes",
    description:
      "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love.",
    images: ["/images/Logo.jpeg"],
    creator: "@juicevibe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/Logo.jpeg",
    shortcut: "/images/Logo.jpeg",
    apple: "/images/Logo.jpeg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Juice Vibe",
  image: "/images/Logo.jpeg",
  description:
    "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Galle Road",
    addressLocality: "Bentota",
    postalCode: "80500",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.6311,
    longitude: 79.9465,
  },
  url: "https://juicevibe.com",
  telephone: "+94718435876",
  servesCuisine: ["Juices", "Smoothies", "Burgers", "Coffee", "Tropical"],
  priceRange: "$$",
  openingHours: ["Mo-Fr 08:00-22:00", "Sa 09:00-23:00", "Su 10:00-21:00"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        {children}
        <FloatingCart />
        <CartDrawer />
      </body>
    </html>
  );
}
