import { apiClient } from "./api-client";

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  averageOrderValue: number;
  aovChange: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopSellingItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get("/analytics/dashboard");
    return data.data;
  },

  async getRevenueChart(days = 30): Promise<RevenueChartData[]> {
    const { data } = await apiClient.get("/analytics/revenue", { params: { days } });
    return data.data;
  },

  async getTopSelling(limit = 10): Promise<TopSellingItem[]> {
    const { data } = await apiClient.get("/analytics/top-selling", { params: { limit } });
    return data.data;
  },

  async getOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
    const { data } = await apiClient.get("/analytics/order-statuses");
    return data.data;
  },
};
