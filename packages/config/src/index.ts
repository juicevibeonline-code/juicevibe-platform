export const siteConfig = {
  name: "Juice Vibe",
  tagline: "Sip the Good Vibes",
  description:
    "Premium tropical juice café offering fresh, organic, and handcrafted beverages. Experience the finest juices, smoothies, and healthy drinks in Bentota, Sri Lanka.",
  url: "https://juicevibe.com",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://facebook.com/juicevibe",
    instagram: "https://instagram.com/juicevibe",
    tiktok: "https://tiktok.com/@juicevibe",
  },
  contact: {
    phone: "+94718435876",
    whatsapp: "94718435876",
    email: "hello@juicevibe.com",
    address: {
      street: "Galle Road",
      city: "Bentota",
      country: "Sri Lanka",
    },
  },
  hours: {
    weekdays: "8:00 AM - 10:00 PM",
    saturday: "9:00 AM - 11:00 PM",
    sunday: "10:00 AM - 9:00 PM",
  },
} as const;

export const brandColors = {
  primary: "#22C55E",
  "primary-dark": "#16A34A",
  "primary-light": "#4ADE80",
  "dark-green": "#14532D",
  orange: "#FB923C",
  yellow: "#FBBF24",
  pink: "#F43F5E",
  "light-bg": "#F8FFF8",
  dark: "#07110A",
  white: "#FFFFFF",
} as const;

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export const apiConfig = {
  baseUrl: rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000",
  timeout: 10000,
} as const;
