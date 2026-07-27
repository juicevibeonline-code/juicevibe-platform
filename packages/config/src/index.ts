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
  bankDetails: {
    bankName: "Commercial Bank of Ceylon",
    branch: "Bentota",
    accountName: "Juice Vibe Bentota",
    accountNumber: "8010156942",
    whatsappReceipt: "+94 71 843 5876",
    whatsappReceiptRaw: "94718435876",
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

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const raw = process.env.NEXT_PUBLIC_API_URL;
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://juice-vibeapi.up.railway.app/api";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://juice-vibeapi.up.railway.app/api";
  }
  return "http://localhost:4000/api";
}

export const apiConfig = {
  get baseUrl() {
    return getApiBaseUrl();
  },
  get wsUrl() {
    if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return "https://juice-vibeapi.up.railway.app";
    }
    if (process.env.NODE_ENV === "production") {
      return "https://juice-vibeapi.up.railway.app";
    }
    return "http://localhost:4000";
  },
  timeout: 10000,
};

