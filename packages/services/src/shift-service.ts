import { apiClient } from "./api-client";
import type { CashierShift, OpenShiftInput, CloseShiftInput, ZReportSummary } from "@juice-vibe/types";

export const shiftService = {
  async getActiveShift(): Promise<CashierShift | null> {
    const { data } = await apiClient.get("/pos/shifts/active");
    return data.data;
  },

  async openShift(input: OpenShiftInput): Promise<CashierShift> {
    const { data } = await apiClient.post("/pos/shifts/open", input);
    return data.data;
  },

  async closeShift(shiftId: string, input: CloseShiftInput): Promise<{ shift: CashierShift; zReport: ZReportSummary }> {
    const { data } = await apiClient.post(`/pos/shifts/${shiftId}/close`, input);
    return data.data;
  },

  async getZReport(shiftId: string): Promise<ZReportSummary> {
    const { data } = await apiClient.get(`/pos/shifts/${shiftId}/z-report`);
    return data.data;
  },

  async getShiftHistory(limit = 10): Promise<CashierShift[]> {
    const { data } = await apiClient.get("/pos/shifts/history", { params: { limit } });
    return data.data || [];
  },
};
