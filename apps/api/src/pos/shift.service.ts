import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { OpenShiftDto, CloseShiftDto } from "./dto/pos.dto";

@Injectable()
export class ShiftService {
  async getActiveShift(cashierId: string) {
    return prisma.cashierShift.findFirst({
      where: {
        cashierId,
        status: "open",
      },
      include: {
        cashier: { select: { id: true, name: true, email: true } },
        orders: {
          select: {
            id: true,
            total: true,
            paymentStatus: true,
            paymentMethod: true,
            payments: true,
          },
        },
      },
    });
  }

  async openShift(cashierId: string, input: OpenShiftDto) {
    const existing = await prisma.cashierShift.findFirst({
      where: { cashierId, status: "open" },
    });

    if (existing) {
      throw new BadRequestException("Cashier already has an active open shift");
    }

    const shift = await prisma.cashierShift.create({
      data: {
        cashierId,
        openingFloat: input.openingFloat,
        notes: input.notes || null,
        status: "open",
      },
      include: {
        cashier: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: cashierId,
        actorRole: "cashier",
        action: "SHIFT_OPEN",
        entity: "CashierShift",
        entityId: shift.id,
        afterData: { openingFloat: input.openingFloat },
      },
    });

    return shift;
  }

  async closeShift(cashierId: string, shiftId: string, input: CloseShiftDto) {
    const shift = await prisma.cashierShift.findUnique({
      where: { id: shiftId },
      include: {
        cashier: { select: { id: true, name: true } },
        orders: {
          include: { payments: true },
        },
      },
    });

    if (!shift) throw new NotFoundException("Shift not found");
    if (shift.status === "closed") throw new BadRequestException("Shift is already closed");

    // Calculate Sales Breakdown
    let grossSales = 0;
    let cashSales = 0;
    let cardSales = 0;
    let onlineSales = 0;
    let taxTotal = 0;
    let discountsTotal = 0;
    let orderCount = 0;

    for (const order of shift.orders) {
      if (order.status !== "cancelled") {
        grossSales += order.total;
        taxTotal += order.tax;
        discountsTotal += order.discount;
        orderCount++;

        // Process payments
        if (order.payments && order.payments.length > 0) {
          for (const p of order.payments) {
            if (p.method === "cash") cashSales += p.amount;
            else if (p.method === "card") cardSales += p.amount;
            else if (p.method === "online") onlineSales += p.amount;
          }
        } else {
          // Fallback to order paymentMethod
          if (order.paymentMethod === "cash") cashSales += order.total;
          else if (order.paymentMethod === "card") cardSales += order.total;
          else if (order.paymentMethod === "online") onlineSales += order.total;
        }
      }
    }

    const expectedDrawerCash = shift.openingFloat + cashSales;
    const variance = input.closingCash - expectedDrawerCash;

    const updatedShift = await prisma.$transaction(async (tx) => {
      const closed = await tx.cashierShift.update({
        where: { id: shiftId },
        data: {
          status: "closed",
          closingCash: input.closingCash,
          expectedCash: expectedDrawerCash,
          variance,
          closedAt: new Date(),
          notes: input.notes || shift.notes,
        },
        include: {
          cashier: { select: { id: true, name: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: cashierId,
          actorRole: "cashier",
          action: "SHIFT_CLOSE_Z_REPORT",
          entity: "CashierShift",
          entityId: shiftId,
          afterData: {
            openingFloat: shift.openingFloat,
            closingCash: input.closingCash,
            expectedDrawerCash,
            variance,
            grossSales,
            orderCount,
          },
        },
      });

      return closed;
    });

    const zReport = {
      shiftId: shift.id,
      cashierName: shift.cashier?.name || "Cashier",
      openedAt: shift.openedAt.toISOString(),
      closedAt: new Date().toISOString(),
      openingFloat: shift.openingFloat,
      grossSales,
      discountsTotal,
      taxTotal,
      netSales: grossSales - taxTotal,
      cashSales,
      cardSales,
      onlineSales,
      expectedDrawerCash,
      actualCountedCash: input.closingCash,
      variance,
      orderCount,
      voidCount: 0,
    };

    return { shift: updatedShift, zReport };
  }

  async getZReport(shiftId: string) {
    const shift = await prisma.cashierShift.findUnique({
      where: { id: shiftId },
      include: {
        cashier: { select: { id: true, name: true } },
        orders: { include: { payments: true } },
      },
    });

    if (!shift) throw new NotFoundException("Shift not found");

    let grossSales = 0;
    let cashSales = 0;
    let cardSales = 0;
    let onlineSales = 0;
    let taxTotal = 0;
    let discountsTotal = 0;
    let orderCount = 0;

    for (const order of shift.orders) {
      if (order.status !== "cancelled") {
        grossSales += order.total;
        taxTotal += order.tax;
        discountsTotal += order.discount;
        orderCount++;

        if (order.payments && order.payments.length > 0) {
          for (const p of order.payments) {
            if (p.method === "cash") cashSales += p.amount;
            else if (p.method === "card") cardSales += p.amount;
            else if (p.method === "online") onlineSales += p.amount;
          }
        } else {
          if (order.paymentMethod === "cash") cashSales += order.total;
          else if (order.paymentMethod === "card") cardSales += order.total;
          else if (order.paymentMethod === "online") onlineSales += order.total;
        }
      }
    }

    const expectedDrawerCash = shift.openingFloat + cashSales;
    const actualCash = shift.closingCash || 0;
    const variance = shift.variance !== null ? shift.variance : actualCash - expectedDrawerCash;

    return {
      shiftId: shift.id,
      cashierName: shift.cashier?.name || "Cashier",
      openedAt: shift.openedAt.toISOString(),
      closedAt: shift.closedAt?.toISOString() || new Date().toISOString(),
      openingFloat: shift.openingFloat,
      grossSales,
      discountsTotal,
      taxTotal,
      netSales: grossSales - taxTotal,
      cashSales,
      cardSales,
      onlineSales,
      expectedDrawerCash,
      actualCountedCash: actualCash,
      variance,
      orderCount,
      voidCount: 0,
    };
  }

  async getShiftHistory(limit = 10) {
    return prisma.cashierShift.findMany({
      take: limit,
      orderBy: { openedAt: "desc" },
      include: {
        cashier: { select: { id: true, name: true, email: true } },
        orders: { select: { id: true, total: true, status: true } },
      },
    });
  }
}
