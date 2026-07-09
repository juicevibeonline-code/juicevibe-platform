import { Injectable } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class AnalyticsService {
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentMonthOrders, lastMonthOrders, totalCustomers, totalRevenue] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.findMany({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      prisma.customer.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange = lastMonthRevenue ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const ordersChange = lastMonthOrders.length ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;
    const currentAOV = currentMonthOrders.length ? currentRevenue / currentMonthOrders.length : 0;
    const lastAOV = lastMonthOrders.length ? lastMonthRevenue / lastMonthOrders.length : 0;
    const aovChange = lastAOV ? ((currentAOV - lastAOV) / lastAOV) * 100 : 0;

    return {
      revenue: currentRevenue,
      revenueChange: Math.round(revenueChange * 100) / 100,
      orders: currentMonthOrders.length,
      ordersChange: Math.round(ordersChange * 100) / 100,
      customers: totalCustomers,
      customersChange: 0,
      averageOrderValue: Math.round(currentAOV * 100) / 100,
      aovChange: Math.round(aovChange * 100) / 100,
    };
  }

  async getRevenueChart(days = 30) {
    const data: { date: string; revenue: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 86400000);

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      });
      const revenue = orders.reduce((sum, o) => sum + o.total, 0);

      data.push({
        date: startOfDay.toISOString().split("T")[0] ?? "",
        revenue,
        orders: orders.length,
      });
    }
    return data;
  }

  async getTopSelling(limit = 10) {
    const orderItems = await prisma.orderItem.groupBy({
      by: ["menuItemId", "name"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    return orderItems.map((item) => ({
      id: item.menuItemId,
      name: item.name,
      quantity: item._sum.quantity || 0,
      revenue: (item._sum.price || 0) * (item._sum.quantity || 0),
    }));
  }

  async getOrderStatusDistribution() {
    const statuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"] as const;
    const data = await Promise.all(
      statuses.map(async (status) => {
        const count = await prisma.order.count({ where: { status } });
        return { status, count };
      })
    );
    return data;
  }
}
