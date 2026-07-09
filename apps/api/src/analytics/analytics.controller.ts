import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Analytics")
@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  async getDashboardStats() {
    const stats = await this.analyticsService.getDashboardStats();
    return ApiResponseDto.ok(stats);
  }

  @Get("revenue")
  @ApiOperation({ summary: "Get revenue chart data" })
  async getRevenueChart(@Query("days") days?: string) {
    const data = await this.analyticsService.getRevenueChart(Number(days) || 30);
    return ApiResponseDto.ok(data);
  }

  @Get("top-selling")
  @ApiOperation({ summary: "Get top selling items" })
  async getTopSelling(@Query("limit") limit?: string) {
    const data = await this.analyticsService.getTopSelling(Number(limit) || 10);
    return ApiResponseDto.ok(data);
  }

  @Get("order-statuses")
  @ApiOperation({ summary: "Get order status distribution" })
  async getOrderStatusDistribution() {
    const data = await this.analyticsService.getOrderStatusDistribution();
    return ApiResponseDto.ok(data);
  }
}
