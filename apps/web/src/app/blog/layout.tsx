import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tropical Journal & Wellness Insights",
  description:
    "Read the Juice Vibe Journal for wellness insights, superfood nutritional facts, fruit mixology tips, and stories from our tropical juice bar in Waskaduwa.",
  alternates: {
    canonical: "https://juicevibe.lk/blog",
  },
  openGraph: {
    title: "Juice Vibe Journal - Wellness, Stories & Tropical Health",
    description:
      "Explore health tips, recipe guides, and coastal lifestyle stories from Juice Vibe Waskaduwa.",
    url: "https://juicevibe.lk/blog",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Juice Vibe Journal",
      },
    ],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
