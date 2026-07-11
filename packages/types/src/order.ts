export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: import("./common").OrderStatus;
  paymentStatus: import("./common").PaymentStatus;
  paymentMethod: import("./common").PaymentMethod;
  type: OrderType;
  deliveryAddress?: import("./common").Address;
  notes?: string;
  couponCode?: string;
  estimatedReadyTime?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  addOns: { name: string; price: number }[];
  notes?: string;
}

export type OrderType = "delivery" | "pickup" | "dine_in";

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: OrderType;
  deliveryAddress?: import("./common").Address;
  paymentMethod: import("./common").PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  variant?: string;
  addOnIds?: string[];
  notes?: string;
}

export interface CartItem {
  id: string;
  menuItem: import("./menu").MenuItem;
  quantity: number;
  variant?: import("./menu").ItemVariant;
  addOns: import("./menu").AddOn[];
  notes: string;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
}
