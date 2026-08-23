import { apiClient } from "./api-client";
import type { Table, CreateTableInput } from "@juice-vibe/types";

export const tableService = {
  async getTables(): Promise<Table[]> {
    const { data } = await apiClient.get("/tables");
    return data.data;
  },

  async getTable(id: string): Promise<Table> {
    const { data } = await apiClient.get(`/tables/${id}`);
    return data.data;
  },

  async createTable(input: CreateTableInput): Promise<Table> {
    const { data } = await apiClient.post("/tables", input);
    return data.data;
  },

  async deleteTable(id: string): Promise<void> {
    await apiClient.delete(`/tables/${id}`);
  },

  async regenerateQRCodes(): Promise<Table[]> {
    const { data } = await apiClient.post("/tables/regenerate-qr");
    return data.data;
  },

  async updateTableStatus(id: string, status: string): Promise<Table> {
    const { data } = await apiClient.patch(`/tables/${id}/status`, { status });
    return data.data;
  },
};

