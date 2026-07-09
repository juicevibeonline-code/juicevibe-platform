import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma, Prisma } from "@juice-vibe/database";
import { generateId } from "@juice-vibe/utils";

@Injectable()
export class OrdersService {
  async createOrder(input: {
    items: { menuItemId?: string; name?: string; price?: number; quantity: number; variant?: string; addOnIds?: string[]; notes?: string }[];
    customerName: string; customerPhone: string; customerEmail?: string;
    type: string; paymentMethod: string; notes?: string; couponCode?: string;
    deliveryAddress?: any; userId?: string;
  }) {
    const orderNumber = "JV-" + Date.now().toString(36).toUpperCase() + generateId().slice(0, 4).toUpperCase();
    let subtotal = 0;
    let discount = 0;

    const orderItems = await Promise.all(
      input.items.map(async (item) => {
        let menuItemId = item.menuItemId;
        let itemName = item.name ?? "Unknown Item";
        let itemPrice = item.price ?? 0;

        // If menuItemId is provided, validate against DB
        if (menuItemId) {
          const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
          if (menuItem) {
            itemName = menuItem.name;
            itemPrice = menuItem.price;
            if (menuItem.availability !== "in_stock") throw new BadRequestException(`${menuItem.name} is not available`);
          }
        } else if (item.name) {
          // Guest storefront order: try to find by name
          const menuItem = await prisma.menuItem.findFirst({ where: { name: { equals: item.name, mode: "insensitive" } } });
          if (menuItem) {
            menuItemId = menuItem.id;
            itemName = menuItem.name;
            itemPrice = menuItem.price;
          } else {
            // Item not in DB (local-only menu item): use a placeholder
            const placeholder = await prisma.menuItem.findFirst();
            menuItemId = placeholder?.id ?? "";
          }
        }

        if (!menuItemId) throw new BadRequestException(`Cannot find menu item: ${itemName}`);

        subtotal += (itemPrice) * item.quantity;

        return {
          menuItemId,
          name: itemName,
          quantity: item.quantity,
          price: itemPrice,
          variant: item.variant,
          addOns: item.addOnIds ?? Prisma.DbNull,
          notes: item.notes,
        };
      })
    );

    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode } });
      if (coupon && coupon.isActive && coupon.usedCount < coupon.usageLimit) {
        if (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) {
          if (subtotal >= coupon.minOrderAmount) {
            discount = coupon.type === "percentage"
              ? Math.min(subtotal * (coupon.value / 100), coupon.maxDiscount || subtotal)
              : Math.min(coupon.value, coupon.maxDiscount || coupon.value);

            await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
          }
        }
      }
    }

    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax - discount;

    const order = await prisma.order.create({
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
        items: { create: orderItems },
      },
      include: { items: true },
    });

    if (input.userId) {
      const customer = await prisma.customer.findUnique({ where: { userId: input.userId } });
      if (customer) {
        await prisma.customer.update({
          where: { userId: input.userId },
          data: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
        });
      }
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

  async getRecentOrders(limit = 10) {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
