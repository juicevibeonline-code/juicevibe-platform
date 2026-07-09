import type { Metadata } from "next";
import { siteConfig } from ".";

interface SEOPageConfig {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export function generateMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex,
}: SEOPageConfig): Metadata {
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage || siteConfig.ogImage, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage || siteConfig.ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    servesCuisine: ["Juice", "Smoothies", "Healthy Drinks", "Tropical"],
    image: siteConfig.ogImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.421,
      longitude: 79.998,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "21:00" },
    ],
    servesCuisine: "Juice",
    priceRange: "$$",
  };
}
