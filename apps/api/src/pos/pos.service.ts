import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { OrdersGateway } from "../orders/orders.gateway";
import { CreatePosOrderDto, SplitPaymentDto, VoidItemDto } from "./dto/pos.dto";

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  constructor(private ordersGateway: OrdersGateway) {}

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, "");
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    });
    return `JV-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }

  async createPosOrder(cashierId: string, input: CreatePosOrderDto) {
    if (!input.items || input.items.length === 0) {
      throw new BadRequestException("Order must contain at least one item");
    }

    // 1. Check for active cashier shift
    const activeShift = await prisma.cashierShift.findFirst({
      where: { cashierId, status: "open" },
    });

    // 2. Fetch authoritative menu items from DB in one batch
    const menuItemIds = input.items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { variants: true, addOns: true },
    });

    const menuMap = new Map(dbMenuItems.map((m) => [m.id, m]));

    let calculatedSubtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of input.items) {
      const dbItem = menuMap.get(item.menuItemId);
      if (!dbItem) {
        throw new BadRequestException(`Menu item ${item.menuItemId} not found`);
      }
      if (dbItem.availability === "out_of_stock") {
        throw new BadRequestException(`Item "${dbItem.name}" is currently out of stock`);
      }

      let unitPrice = dbItem.price;

      // Check variant
      if (item.variant) {
        const variantObj = dbItem.variants.find((v) => v.name.toLowerCase() === item.variant?.toLowerCase());
        if (variantObj) {
          unitPrice += variantObj.priceAdjustment;
        }
      }

      // Check add-ons
      const selectedAddOns: { name: string; price: number }[] = [];
      if (item.addOnIds && item.addOnIds.length > 0) {
        for (const addOnId of item.addOnIds) {
          const addOnObj = dbItem.addOns.find((a) => a.id === addOnId);
          if (addOnObj) {
            unitPrice += addOnObj.price;
            selectedAddOns.push({ name: addOnObj.name, price: addOnObj.price });
          }
        }
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItemsData.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        quantity: item.quantity,
        price: unitPrice,
        variant: item.variant || null,
        addOns: selectedAddOns.length > 0 ? selectedAddOns : null,
        notes: item.notes || null,
      });
    }

    // 3. Tax and Discount Calculations
    const discountAmount = input.discountAmount || 0;
    const discountedSubtotal = Math.max(0, calculatedSubtotal - discountAmount);
    const tax = Math.round(discountedSubtotal * 0.05 * 100) / 100; // 5% Govt Tax
    const serviceCharge = input.serviceCharge || 0;
    const total = Math.max(0, discountedSubtotal + tax + serviceCharge);

    const orderNumber = await this.generateOrderNumber();

    // 4. Payment Preparation
    let paymentStatus: "pending" | "paid" = "pending";
    const paymentTransactionsToCreate: any[] = [];

    if (input.payment) {
      if (input.payment.splitTransactions && input.payment.splitTransactions.length > 0) {
        let splitTotal = 0;
        for (const split of input.payment.splitTransactions) {
          splitTotal += split.amount;
          paymentTransactionsToCreate.push({
            method: split.method,
            amount: split.amount,
            status: "paid",
            cardLast4: split.cardLast4 || null,
            transactionRef: split.transactionRef || null,
            cashTendered: split.cashTendered || split.amount,
            changeGiven: split.cashTendered ? Math.max(0, split.cashTendered - split.amount) : 0,
          });
        }
        if (splitTotal >= total) {
          paymentStatus = "paid";
        }
      } else {
        const tendered = input.payment.cashTendered || total;
        paymentTransactionsToCreate.push({
          method: input.payment.method,
          amount: total,
          status: "paid",
          cashTendered: tendered,
          changeGiven: Math.max(0, tendered - total),
        });
        paymentStatus = "paid";
      }
    }

    // 5. Execute DB Transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          orderSource: "COUNTER_POS",
          customerName: input.customerName || "Walk-in Guest",
          customerPhone: input.customerPhone || "N/A",
          type: input.type as any,
          tableId: input.tableId || null,
          subtotal: calculatedSubtotal,
          tax,
          discount: discountAmount,
          serviceCharge,
          total,
          status: "confirmed",
          kitchenStatus: "new",
          paymentStatus: paymentStatus as any,
          paymentMethod: (input.payment?.method || "cash") as any,
          notes: input.notes || null,
          couponCode: input.couponCode || null,
          cashierShiftId: activeShift?.id || null,
          servedById: cashierId,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: paymentTransactionsToCreate,
          },
        },
        include: {
          items: true,
          payments: true,
          table: true,
        },
      });

      // Update table status if dine-in
      if (input.tableId) {
        await tx.table.update({
          where: { id: input.tableId },
          data: { status: "occupied" },
        });
      }

      // Auto-deplete raw inventory ingredients based on recipes
      const menuItemIds = input.items.map((i) => i.menuItemId);
      const recipes = await tx.recipe.findMany({
        where: { menuItemId: { in: menuItemIds }, isActive: true },
        include: { ingredients: true },
      });

      for (const item of input.items) {
        const recipe = recipes.find((r) => r.menuItemId === item.menuItemId);
        if (recipe && recipe.ingredients.length > 0) {
          for (const ing of recipe.ingredients) {
            const deductQty = item.quantity * ing.quantity * (1 + (ing.wastageFactor || 0));
            await tx.inventoryItem.update({
              where: { id: ing.inventoryItemId },
              data: {
                quantity: { decrement: deductQty },
              },
            });

            await tx.inventoryTransaction.create({
              data: {
                inventoryItemId: ing.inventoryItemId,
                type: "SALE",
                quantity: -deductQty,
                referenceId: createdOrder.id,
                notes: `Auto-depleted for Order #${orderNumber} (${item.quantity}x)`,
                actorId: cashierId,
              },
            });
          }
        }
      }

      // Log Audit Event
      await tx.auditLog.create({
        data: {
          actorId: cashierId,
          actorRole: "cashier",
          action: "POS_ORDER_CREATE",
          entity: "Order",
          entityId: createdOrder.id,
          afterData: { orderNumber, total, paymentStatus },
          orderId: createdOrder.id,
        },
      });

      return createdOrder;
    });


    // 6. Broadcast Real-Time WebSocket Event to KDS and Order Desks
    this.ordersGateway.emitNewOrder(order);

    return order;
  }

  async settleSplitPayment(cashierId: string, orderId: string, input: SplitPaymentDto) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.paymentStatus === "paid") {
      throw new BadRequestException("Order is already fully paid");
    }

    const totalTendered = input.transactions.reduce((sum, t) => sum + t.amount, 0);
    if (totalTendered < order.total) {
      throw new BadRequestException(
        `Total tendered (LKR ${totalTendered}) is less than order total (LKR ${order.total})`
      );
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Create transactions
      for (const txData of input.transactions) {
        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            method: txData.method as any,
            amount: txData.amount,
            status: "paid",
            cardLast4: txData.cardLast4 || null,
            transactionRef: txData.transactionRef || null,
            cashTendered: txData.cashTendered || txData.amount,
            changeGiven: txData.cashTendered ? Math.max(0, txData.cashTendered - txData.amount) : 0,
          },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "paid",
        },
        include: {
          items: true,
          payments: true,
          table: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: cashierId,
          actorRole: "cashier",
          action: "PAYMENT_SPLIT_SETTLE",
          entity: "Order",
          entityId: orderId,
          afterData: { totalTendered, transactions: input.transactions } as any,
          orderId,
        },
      });

      return updated;
    });

    return updatedOrder;
  }

  async voidItem(cashierId: string, orderId: string, input: VoidItemDto) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "completed") throw new BadRequestException("Cannot void items on a completed order");

    const targetItem = order.items.find((i) => i.id === input.orderItemId);
    if (!targetItem) throw new NotFoundException("Order item not found on this order");

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.orderItem.delete({
        where: { id: input.orderItemId },
      });

      // Recalculate totals
      const remainingItems = order.items.filter((i) => i.id !== input.orderItemId);
      const newSubtotal = remainingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newTax = Math.round(newSubtotal * 0.05 * 100) / 100;
      const newTotal = Math.max(0, newSubtotal + newTax + (order.serviceCharge || 0) - (order.discount || 0));

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal,
          voidReason: input.reason,
        },
        include: { items: true, payments: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: cashierId,
          actorRole: "cashier",
          action: "ORDER_ITEM_VOID",
          entity: "OrderItem",
          entityId: input.orderItemId,
          beforeData: { itemName: targetItem.name, price: targetItem.price, qty: targetItem.quantity },
          afterData: { reason: input.reason, newTotal },
          orderId,
        },
      });

      return updated;
    });

    return updatedOrder;
  }

  async getActiveTickets() {
    return prisma.order.findMany({
      where: {
        status: { in: ["pending", "confirmed", "preparing", "ready"] },
      },
      include: {
        items: true,
        payments: true,
        table: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getKdsOrders() {
    return prisma.order.findMany({
      where: {
        status: { notIn: ["completed", "cancelled"] },
      },
      include: {
        items: true,
        table: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async updateKdsStatus(actorId: string, actorRole: string, orderId: string, kitchenStatus: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");

    const orderStatusMap: Record<string, string> = {
      new: "confirmed",
      accepted: "confirmed",
      preparing: "preparing",
      ready: "ready",
      completed: "completed",
    };

    const newOrderStatus = orderStatusMap[kitchenStatus] || order.status;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        kitchenStatus: kitchenStatus as any,
        status: newOrderStatus as any,
        ...(kitchenStatus === "completed" ? { completedAt: new Date() } : {}),
      },
      include: {
        items: true,
        table: true,
      },
    });

    // Broadcast WebSocket update to all listeners
    if (this.ordersGateway.server) {
      this.ordersGateway.server.emit("kdsStatusChanged", updated);
      this.ordersGateway.server.emit("orderUpdated", updated);
    }

    return updated;
  }
}

