import { apiClient } from "./api-client";
import type { MenuCategory, MenuItem } from "@juice-vibe/types";

export const menuService = {
  async getCategories(): Promise<MenuCategory[]> {
    const { data } = await apiClient.get("/menu/categories");
    return data.data;
  },

  async getMenuItems(params?: { category?: string; search?: string; popular?: boolean }): Promise<MenuItem[]> {
    const { data } = await apiClient.get("/menu/items", { params });
    return data.data;
  },

  async getMenuItem(id: string): Promise<MenuItem> {
    const { data } = await apiClient.get(`/menu/items/${id}`);
    return data.data;
  },

  async createCategory(input: { name: string; description?: string; icon: string }): Promise<MenuCategory> {
    const { data } = await apiClient.post("/menu/categories", input);
    return data.data;
  },

  async createItem(input: FormData): Promise<MenuItem> {
    const { data } = await apiClient.post("/menu/items", input, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async updateItem(id: string, input: Partial<MenuItem>): Promise<MenuItem> {
    const { data } = await apiClient.patch(`/menu/items/${id}`, input);
    return data.data;
  },

  async deleteItem(id: string): Promise<void> {
    await apiClient.delete(`/menu/items/${id}`);
  },

  async reorderItems(items: { id: string; order: number }[]): Promise<void> {
    await apiClient.put("/menu/items/reorder", { items });
  },
};
