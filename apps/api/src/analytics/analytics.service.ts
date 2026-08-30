import { Injectable } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class AnalyticsService {
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfMonth.getTime() - 1);

    const [currentMonthAgg, lastMonthAgg, totalCustomers, currentMonthCustomerCount, lastMonthCustomerCount] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.customer.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    ]);

    const currentRevenue = currentMonthAgg?._sum?.total ?? 0;
    const lastRevenue = lastMonthAgg?._sum?.total ?? 0;
    const currentOrders = currentMonthAgg?._count ?? 0;
    const lastOrders = lastMonthAgg?._count ?? 0;

    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : (currentRevenue > 0 ? 100 : 0);
    const ordersChange = lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : (currentOrders > 0 ? 100 : 0);
    const currentAOV = currentOrders > 0 ? currentRevenue / currentOrders : 0;
    const lastAOV = lastOrders > 0 ? lastRevenue / lastOrders : 0;
    const aovChange = lastAOV > 0 ? ((currentAOV - lastAOV) / lastAOV) * 100 : (currentAOV > 0 ? 100 : 0);
    const customersChange = lastMonthCustomerCount > 0 ? ((currentMonthCustomerCount - lastMonthCustomerCount) / lastMonthCustomerCount) * 100 : (currentMonthCustomerCount > 0 ? 100 : 0);

    return {
      revenue: currentRevenue,
      revenueChange: Math.round(revenueChange * 100) / 100,
      orders: currentOrders,
      ordersChange: Math.round(ordersChange * 100) / 100,
      customers: totalCustomers,
      customersChange: Math.round(customersChange * 100) / 100,
      averageOrderValue: Math.round(currentAOV * 100) / 100,
      aovChange: Math.round(aovChange * 100) / 100,
    };
  }

  async getRevenueChart(days = 30) {
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - days + 1);
    startDate.setUTCHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
    });

    const dayMap = new Map<string, { revenue: number; orders: number }>();

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + i);
      const key = date.toISOString().split("T")[0] ?? "";
      dayMap.set(key, { revenue: 0, orders: 0 });
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split("T")[0] ?? "";
      const entry = dayMap.get(key);
      if (entry) {
        entry.revenue += order.total;
        entry.orders += 1;
      }
    }

    return Array.from(dayMap.entries()).map(([date, data]) => ({ date, ...data }));
  }

  async getTopSelling(limit = 10) {
    const result = await prisma.$queryRaw<any[]>`
      SELECT 
        "menuItemId", 
        "name", 
        CAST(SUM("quantity") AS INTEGER) as "quantity", 
        SUM("price" * "quantity") as "revenue"
      FROM "OrderItem"
      GROUP BY "menuItemId", "name"
      ORDER BY "quantity" DESC
      LIMIT ${limit}
    `;

    return result.map((item) => ({
      id: item.menuItemId,
      name: item.name,
      quantity: Number(item.quantity) || 0,
      revenue: Number(item.revenue) || 0,
    }));
  }

  async getOrderStatusDistribution() {
    const data = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });
    return data.map((d) => ({ status: d.status, count: d._count }));
  }
}
