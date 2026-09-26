import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Story";

  return {
    title: formattedTitle,
    description: `Read ${formattedTitle} on the Juice Vibe Journal. Fresh insights, recipes, and tropical wellness from Waskaduwa, Sri Lanka.`,
    alternates: {
      canonical: `https://juicevibe.lk/blog/${slug}`,
    },
    openGraph: {
      title: `${formattedTitle} | Juice Vibe Journal`,
      description: `Read ${formattedTitle} on the Juice Vibe Journal.`,
      url: `https://juicevibe.lk/blog/${slug}`,
      images: [
        {
          url: "/images/Logo.jpeg",
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
    },
  };
}

export default function SingleBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
