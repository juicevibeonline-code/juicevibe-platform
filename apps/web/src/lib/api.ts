const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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
