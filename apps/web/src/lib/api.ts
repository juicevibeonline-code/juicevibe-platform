export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const raw = process.env.NEXT_PUBLIC_API_URL;
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://juice-vibe-waskaduwa-api.vercel.app/api";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://juice-vibe-waskaduwa-api.vercel.app/api";
  }
  return "http://localhost:4000/api";
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: "pickup" | "dine_in" | "delivery";
  paymentMethod: "cash" | "online"; // card payments will be added in a future release
  notes?: string;
  tableId?: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${getApiUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to place order" }));
    throw new Error(error.message || "Failed to place order");
  }

  const data = await res.json();
  return data.data;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${getApiUrl()}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to send message" }));
    throw new Error(error.message || "Failed to send message");
  }
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/contact/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to subscribe" }));
    throw new Error(error.message || "Failed to subscribe");
  }
}
