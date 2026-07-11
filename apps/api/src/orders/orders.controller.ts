import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard, RolesGuard, Roles, OptionalAuthGuard } from "../common/guards";
import { ApiResponseDto } from "../common/dto";
import { CreateOrderDto, UpdateOrderStatusDto } from "../common/dto";
import { Prisma } from "@juice-vibe/database";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;
type OrderListResult = { orders: OrderWithItems[]; total: number; page: number; limit: number; totalPages: number };

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: "Create a new order" })
  async createOrder(@Body() body: CreateOrderDto, @CurrentUser("sub") userId?: string): Promise<ApiResponseDto<OrderWithItems>> {
    const order = await this.ordersService.createOrder({ ...body, userId } as any);
    return ApiResponseDto.ok(order, "Order created successfully");
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "cashier")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all orders (admin)" })
  async getOrders(
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<ApiResponseDto<OrderWithItems[]>> {
    const result = await this.ordersService.getOrders({ status, page: Number(page) || 1, limit: Number(limit) || 20 });
    return ApiResponseDto.paginated(result.orders, result.total, result.page, result.limit);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's orders" })
  async getMyOrders(@CurrentUser("sub") userId: string): Promise<ApiResponseDto<OrderWithItems[]>> {
    const result = await this.ordersService.getOrders({ userId });
    return ApiResponseDto.ok(result.orders);
  }

  @Get("recent")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get recent orders" })
  async getRecentOrders(@Query("limit") limit?: number): Promise<ApiResponseDto<OrderWithItems[]>> {
    const orders = await this.ordersService.getRecentOrders(Number(limit) || 10);
    return ApiResponseDto.ok(orders);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get order by ID" })
  async getOrder(@Param("id") id: string): Promise<ApiResponseDto<OrderWithItems>> {
    const order = await this.ordersService.getOrder(id);
    return ApiResponseDto.ok(order);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "cashier", "kitchen")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status" })
  async updateOrderStatus(@Param("id") id: string, @Body() body: UpdateOrderStatusDto): Promise<ApiResponseDto<OrderWithItems>> {
    const order = await this.ordersService.updateOrderStatus(id, body.status);
    return ApiResponseDto.ok(order, "Order status updated");
  }
}
