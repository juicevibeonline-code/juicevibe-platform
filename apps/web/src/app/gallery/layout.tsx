import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery & Menu Highlights",
  description:
    "Browse our photo gallery featuring fresh fruit juices, colorful smoothies, avocado delights, lassis, and cafe moments at Juice Vibe Waskaduwa.",
  alternates: {
    canonical: "https://juicevibe.lk/gallery",
  },
  openGraph: {
    title: "Juice Vibe Gallery - Visual Journey Through Tropical Flavors",
    description:
      "A vibrant photo showcase of handcrafted tropical drinks and food crafted at Juice Vibe in Waskaduwa, Sri Lanka.",
    url: "https://juicevibe.lk/gallery",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Juice Vibe Gallery",
      },
    ],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
