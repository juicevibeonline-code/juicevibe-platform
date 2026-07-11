import { apiClient } from "./api-client";

export const settingsService = {
  async getSettings(): Promise<Record<string, string>> {
    const { data } = await apiClient.get("/settings");
    return data.data;
  },

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    const { data } = await apiClient.patch("/settings", settings);
    return data.data;
  },
};
