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

export interface RevenueDataPoint {
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

export interface HourlyOrderData {
  hour: number;
  orders: number;
}
