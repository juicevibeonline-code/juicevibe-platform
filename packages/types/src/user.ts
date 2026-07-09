export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "manager" | "cashier" | "kitchen" | "editor" | "customer";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Customer extends User {
  role: "customer";
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  addresses: import("./common").Address[];
  favorites: string[];
}
