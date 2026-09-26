import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu & Cold-Pressed Juices",
  description:
    "Explore the Juice Vibe menu: fresh cold-pressed fruit juices, thick smoothies, signature milkshakes, mocktails, burgers, sandwiches, and healthy café snacks in Waskaduwa.",
  alternates: {
    canonical: "https://juicevibe.lk/menu",
  },
  openGraph: {
    title: "Juice Vibe Menu - Fresh Tropical Juices & Gourmet Eats",
    description:
      "Handcrafted tropical juices, organic smoothies, and delicious cafe food in Waskaduwa, Sri Lanka.",
    url: "https://juicevibe.lk/menu",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Juice Vibe Menu",
      },
    ],
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
