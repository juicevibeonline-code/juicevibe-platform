import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma, Prisma } from "@juice-vibe/database";
import { randomBytes } from "crypto";
import { OrdersGateway } from "./orders.gateway";
import { EmailService } from "../email/email.service";

@Injectable()
export class OrdersService {
  constructor(
    private ordersGateway: OrdersGateway,
    private emailService: EmailService
  ) {}

  async createOrder(input: {
    items: { menuItemId?: string; name?: string; price?: number; quantity: number; variant?: string; addOnIds?: string[]; notes?: string }[];
    customerName: string; customerPhone: string; customerEmail?: string;
    type: string; paymentMethod: string; notes?: string; couponCode?: string;
    deliveryAddress?: any; userId?: string; tableId?: string;
  }) {
    const orderNumber = "JV-" + randomBytes(8).toString("hex").toUpperCase();
    let subtotal = 0;

    const menuItemIds = input.items.map(i => i.menuItemId).filter(Boolean) as string[];
    const menuItemNames = input.items.map(i => i.name).filter(Boolean) as string[];

    // Batch query database items to resolve the N+1 query problem
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        OR: [
          ...(menuItemIds.length > 0 ? [{ id: { in: menuItemIds } }] : []),
          ...(menuItemNames.length > 0 ? [{ name: { in: menuItemNames } }] : []),
        ],
      },
    });

    const orderItems = input.items.map((item) => {
      let menuItem = dbMenuItems.find(m => m.id === item.menuItemId);
      if (!menuItem && item.name) {
        menuItem = dbMenuItems.find(m => m.name.toLowerCase() === item.name!.toLowerCase());
      }

      if (!menuItem) {
        throw new BadRequestException(`Menu item not found: ${item.name || item.menuItemId}`);
      }

      if (menuItem.availability !== "in_stock") {
        throw new BadRequestException(`${menuItem.name} is not available`);
      }

      const itemPrice = typeof item.price === "number" && item.price > 0 ? item.price : menuItem.price;
      const itemName = menuItem.name;
      subtotal += itemPrice * item.quantity;

      return {
        menuItemId: menuItem.id,
        name: itemName,
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant,
        addOns: item.addOnIds ?? Prisma.DbNull,
        notes: item.notes,
      };
    });

    const order = await prisma.$transaction(async (tx) => {
      let discount = 0;

      if (input.couponCode) {
        // Enforce concurrency protection using SELECT ... FOR UPDATE row-level lock
        const coupons = await tx.$queryRaw<any[]>`
          SELECT * FROM "Coupon" 
          WHERE "code" = ${input.couponCode.toUpperCase()} 
          FOR UPDATE
        `;
        const coupon = coupons[0];

        if (!coupon) {
          throw new BadRequestException("Coupon not found");
        }
        if (!coupon.isActive) {
          throw new BadRequestException("Coupon is inactive");
        }
        if (coupon.usedCount >= coupon.usageLimit) {
          throw new BadRequestException("Coupon usage limit reached");
        }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          throw new BadRequestException("Coupon has expired");
        }
        if (subtotal < coupon.minOrderAmount) {
          throw new BadRequestException(`Minimum order amount is LKR ${coupon.minOrderAmount}`);
        }

        discount = coupon.type === "percentage"
          ? Math.min(subtotal * (coupon.value / 100), coupon.maxDiscount || subtotal)
          : Math.min(coupon.value, coupon.maxDiscount || coupon.value);

        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const tax = 0;
      const total = subtotal - discount;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: input.userId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          subtotal,
          tax,
          discount,
          total,
          type: input.type as any,
          paymentMethod: input.paymentMethod as any,
          notes: input.notes,
          couponCode: input.couponCode,
          deliveryAddress: input.deliveryAddress ?? Prisma.DbNull,
          tableId: input.tableId,
          items: { create: orderItems },
        },
        include: { items: true, table: true },
      });

      if (input.userId) {
        const customer = await tx.customer.findUnique({ where: { userId: input.userId } });
        if (customer) {
          await tx.customer.update({
            where: { userId: input.userId },
            data: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
          });
        }
      }

      return order;
    }, { maxWait: 15000, timeout: 30000 });

    // Emit live event to dashboard
    this.ordersGateway.emitNewOrder(order);

    if (order.customerEmail) {
      this.emailService.sendOrderConfirmation(order.customerEmail, order).catch((err) => {
        console.error("Order confirmation email async send error:", err.message);
      });
    }

    return order;
  }

  async getOrders(params: { status?: string; page?: number; limit?: number; userId?: string }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.userId) where.customerId = params.userId;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!order) throw new NotFoundException(`Order with number ${orderNumber} not found`);
    return order;
  }


  async updateOrderStatus(id: string, status: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found");

    const updateData: any = { status };
    if (status === "completed") updateData.completedAt = new Date();

    return prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found");

    return prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
      include: { items: true },
    });
  }

  async getRecentOrders(limit = 10) {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
