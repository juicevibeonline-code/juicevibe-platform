import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & Tropical Freshness",
  description:
    "Learn about Juice Vibe in Waskaduwa, Sri Lanka. Our passion for 100% natural, organic fruit juices, local farmer partnerships, and energizing beachside hospitality.",
  alternates: {
    canonical: "https://juicevibe.lk/about",
  },
  openGraph: {
    title: "About Juice Vibe Waskaduwa - Fresh Coastal Hospitality",
    description:
      "Our story of pure tropical ingredients, artisan crafted drinks, and warm coastal vibes along Galle Road in Waskaduwa.",
    url: "https://juicevibe.lk/about",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "About Juice Vibe",
      },
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
