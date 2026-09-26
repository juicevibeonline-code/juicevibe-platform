import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Location",
  description:
    "Visit Juice Vibe in Waskaduwa, Sri Lanka at No. 89 Bandaragama Road. Call +94 71 843 5876 or chat on WhatsApp for orders, table bookings, and inquiries.",
  alternates: {
    canonical: "https://juicevibe.lk/contact",
  },
  openGraph: {
    title: "Contact Juice Vibe - Waskaduwa, Sri Lanka",
    description:
      "Find location details, opening hours, phone number, and directions to Juice Vibe on Bandaragama Road, Waskaduwa.",
    url: "https://juicevibe.lk/contact",
    images: [
      {
        url: "/images/Logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact Juice Vibe",
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
