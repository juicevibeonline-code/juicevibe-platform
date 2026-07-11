import { apiClient } from "./api-client";
import type { Coupon, CreateCouponInput } from "@juice-vibe/types";

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    const { data } = await apiClient.get("/coupons");
    return data.data;
  },

  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; discount: number; coupon: Coupon }> {
    const { data } = await apiClient.get("/coupons/validate", {
      params: { code, amount },
    });
    return data.data;
  },

  async createCoupon(input: CreateCouponInput): Promise<Coupon> {
    const { data } = await apiClient.post("/coupons", input);
    return data.data;
  },

  async deleteCoupon(id: string): Promise<void> {
    await apiClient.delete(`/coupons/${id}`);
  },
};
