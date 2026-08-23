import { apiClient } from "./api-client";
import type { Order, CreatePosOrderInput, SplitPaymentInput } from "@juice-vibe/types";

export const posService = {
  async createPosOrder(input: CreatePosOrderInput): Promise<Order> {
    const { data } = await apiClient.post("/pos/orders", input);
    return data.data;
  },

  async settleSplitPayment(orderId: string, input: SplitPaymentInput): Promise<Order> {
    const { data } = await apiClient.post(`/pos/orders/${orderId}/split-pay`, input);
    return data.data;
  },

  async voidItem(orderId: string, orderItemId: string, reason: string): Promise<Order> {
    const { data } = await apiClient.post(`/pos/orders/${orderId}/void-item`, { orderItemId, reason });
    return data.data;
  },

  async getActiveTickets(): Promise<Order[]> {
    const { data } = await apiClient.get("/pos/tickets");
    return data.data || [];
  },

  async holdTicket(orderId: string): Promise<Order> {
    const { data } = await apiClient.post(`/pos/orders/${orderId}/hold`);
    return data.data;
  },

  async resumeTicket(orderId: string): Promise<Order> {
    const { data } = await apiClient.post(`/pos/orders/${orderId}/resume`);
    return data.data;
  },
};
