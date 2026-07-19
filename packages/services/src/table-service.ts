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
};
