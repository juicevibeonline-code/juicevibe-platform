import { apiClient } from "./api-client";
import type { Order, CreateOrderInput } from "@juice-vibe/types";

export const orderService = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data } = await apiClient.post("/orders", input);
    return data.data;
  },

  async getOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; total: number; totalPages: number }> {
    const { data } = await apiClient.get("/orders", { params });
    return {
      orders: data.data || [],
      total: data.meta?.total || 0,
      totalPages: data.meta?.totalPages || 1,
    };
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data.data;
  },

  async updateOrderPaymentStatus(id: string, status: string): Promise<Order> {
    const { data } = await apiClient.patch(`/orders/${id}/payment-status`, { status });
    return data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await apiClient.get("/orders/my");
    return data.data;
  },

  async trackOrder(orderNumber: string): Promise<Order> {
    const { data } = await apiClient.get(`/orders/track/${orderNumber}`);
    return data.data;
  },
};
