const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: "pickup" | "dine_in" | "delivery";
  paymentMethod: "cash" | "card" | "online";
  notes?: string;
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
  const res = await fetch(`${API_URL}/orders`, {
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
  const res = await fetch(`${API_URL}/contact`, {
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
  const res = await fetch(`${API_URL}/contact/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to subscribe" }));
    throw new Error(error.message || "Failed to subscribe");
  }
}
