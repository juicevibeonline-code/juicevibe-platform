import { apiClient } from "./api-client";
import type { InventoryItem, CreateInventoryInput, UpdateInventoryInput } from "@juice-vibe/types";

export const inventoryService = {
  async getItems(): Promise<InventoryItem[]> {
    const { data } = await apiClient.get("/inventory");
    return data.data;
  },

  async getItem(id: string): Promise<InventoryItem> {
    const { data } = await apiClient.get(`/inventory/${id}`);
    return data.data;
  },

  async createItem(input: CreateInventoryInput): Promise<InventoryItem> {
    const { data } = await apiClient.post("/inventory", input);
    return data.data;
  },

  async updateItem(id: string, input: UpdateInventoryInput): Promise<InventoryItem> {
    const { data } = await apiClient.patch(`/inventory/${id}`, input);
    return data.data;
  },

  async deleteItem(id: string): Promise<void> {
    await apiClient.delete(`/inventory/${id}`);
  },
};
