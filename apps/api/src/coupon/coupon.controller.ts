import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CouponService } from "./coupon.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Coupons")
@Controller("coupons")
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all coupons" })
  async getCoupons() {
    const coupons = await this.couponService.getCoupons();
    return ApiResponseDto.ok(coupons);
  }

  @Get("validate")
  @ApiOperation({ summary: "Validate a coupon code" })
  async validateCoupon(@Query("code") code: string, @Query("amount") amount: string) {
    const result = await this.couponService.validateCoupon(code, Number(amount));
    return ApiResponseDto.ok(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a coupon" })
  async createCoupon(@Body() body: any) {
    const coupon = await this.couponService.createCoupon(body);
    return ApiResponseDto.ok(coupon, "Coupon created");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a coupon" })
  async deleteCoupon(@Param("id") id: string) {
    await this.couponService.deleteCoupon(id);
    return ApiResponseDto.ok(null, "Coupon deleted");
  }
}
