import type { Metadata } from "next";
import "./globals.css";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSiteUrl } from "@/lib/utils";

const siteUrl = getSiteUrl();

// Production Build Marker: 2026-07-27-01
export const metadata: Metadata = {
  title: {
    default: "Juice Vibe - Sip the Good Vibes",
    template: "%s | Juice Vibe",
  },
  description:
    "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love. Experience the best juice bar with premium quality drinks and food.",
  keywords: [
    "juice vibe",
    "juice vibe waskaduwa",
    "juice vibe bentota",
    "best juice bar waskaduwa",
    "fresh juice shop kalutara",
    "fresh juices sri lanka",
    "smoothies waskaduwa",
    "healthy drinks bentota",
    "tropical fruit juice sri lanka",
    "milkshakes waskaduwa",
    "mocktails",
    "burgers waskaduwa",
    "cafe waskaduwa",
  ],
  authors: [{ name: "Juice Vibe" }],
  creator: "Juice Vibe",
  publisher: "Juice Vibe",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Juice Vibe",
    title: "Juice Vibe - Sip the Good Vibes",
    description:
      "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love.",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Juice Vibe Waskaduwa",
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
  "@type": "CafeOrCoffeeShop",
  name: "Juice Vibe",
  image: "https://juicevibe.lk/images/Logo.jpeg",
  description:
    "Fresh juices, smoothies, burgers, coffee and tropical flavors crafted with love in Waskaduwa, Sri Lanka.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 89 Bandaragama Road",
    addressLocality: "Waskaduwa",
    addressRegion: "Western Province",
    postalCode: "12580",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.6306512,
    longitude: 79.9460964,
  },
  url: "https://juicevibe.lk",
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
