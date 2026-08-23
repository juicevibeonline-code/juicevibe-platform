export type Status = "active" | "inactive" | "archived";
export type Availability = "in_stock" | "out_of_stock" | "coming_soon";
export type Currency = "LKR" | "USD";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type PaymentMethod = "cash" | "card" | "online";

export type OrderSource = "CUSTOMER_WEB" | "COUNTER_POS" | "QR_TABLE" | "WAITER_TAB" | "DELIVERY_AGGREGATOR";
export type KitchenStatus = "new" | "accepted" | "preparing" | "ready" | "completed";
export type ShiftStatus = "open" | "closed";
export type InventoryTxType = "PURCHASE" | "SALE" | "WASTAGE" | "ADJUSTMENT" | "TRANSFER" | "RETURN";
export type TableState = "available" | "occupied" | "bill_requested" | "paying";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp?: string;
}
