import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { CouponType } from "@juice-vibe/database";

@Injectable()
export class CouponService {
  async getCoupons() {
    return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException("Coupon not found");
    if (!coupon.isActive) throw new NotFoundException("Coupon is inactive");
    if (coupon.usedCount >= coupon.usageLimit) throw new NotFoundException("Coupon usage limit reached");
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new NotFoundException("Coupon has expired");
    if (orderAmount < coupon.minOrderAmount) throw new NotFoundException(`Minimum order amount is ${coupon.minOrderAmount}`);

    const discount = coupon.type === "percentage"
      ? Math.min(orderAmount * (coupon.value / 100), coupon.maxDiscount || orderAmount)
      : Math.min(coupon.value, coupon.maxDiscount || coupon.value);

    return { valid: true, discount, coupon };
  }

  async createCoupon(input: { code: string; type: CouponType; value: number; minOrderAmount?: number; maxDiscount?: number; usageLimit?: number; expiresAt?: string }) {
    const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
    if (existing) throw new ConflictException("Coupon code already exists");

    return prisma.coupon.create({
      data: {
        code: input.code.toUpperCase(),
        type: input.type as CouponType,
        value: input.value,
        minOrderAmount: input.minOrderAmount || 0,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit || 100,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });
  }

  async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }
}
