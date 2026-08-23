import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PosService } from "./pos.service";
import { ShiftService } from "./shift.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { CurrentUser } from "../common/decorators";
import { ApiResponseDto } from "../common/dto";
import { CreatePosOrderDto, SplitPaymentDto, VoidItemDto, OpenShiftDto, CloseShiftDto } from "./dto/pos.dto";

@ApiTags("POS & Shifts")
@Controller("pos")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PosController {
  constructor(
    private posService: PosService,
    private shiftService: ShiftService,
  ) {}

  @Post("orders")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Create a Counter POS order (Cashier/Manager)" })
  async createPosOrder(@CurrentUser("sub") cashierId: string, @Body() body: CreatePosOrderDto) {
    const order = await this.posService.createPosOrder(cashierId, body);
    return ApiResponseDto.ok(order, "POS Order created successfully");
  }

  @Post("orders/:id/split-pay")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Settle an order with multi-tender split payment" })
  async settleSplitPayment(
    @CurrentUser("sub") cashierId: string,
    @Param("id") id: string,
    @Body() body: SplitPaymentDto,
  ) {
    const order = await this.posService.settleSplitPayment(cashierId, id, body);
    return ApiResponseDto.ok(order, "Split payment processed successfully");
  }

  @Post("orders/:id/void-item")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Void an item from an active ticket (Manager/Admin)" })
  async voidItem(
    @CurrentUser("sub") cashierId: string,
    @Param("id") id: string,
    @Body() body: VoidItemDto,
  ) {
    const order = await this.posService.voidItem(cashierId, id, body);
    return ApiResponseDto.ok(order, "Item voided successfully");
  }

  @Get("tickets")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Get all active POS tickets" })
  async getActiveTickets() {
    const tickets = await this.posService.getActiveTickets();
    return ApiResponseDto.ok(tickets);
  }

  @Get("shifts/active")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Get current cashier active shift" })
  async getActiveShift(@CurrentUser("sub") cashierId: string) {
    const shift = await this.shiftService.getActiveShift(cashierId);
    return ApiResponseDto.ok(shift);
  }

  @Post("shifts/open")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Open a new cashier shift drawer" })
  async openShift(@CurrentUser("sub") cashierId: string, @Body() body: OpenShiftDto) {
    const shift = await this.shiftService.openShift(cashierId, body);
    return ApiResponseDto.ok(shift, "Shift opened successfully");
  }

  @Post("shifts/:id/close")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Close cashier shift and generate Z-Report" })
  async closeShift(
    @CurrentUser("sub") cashierId: string,
    @Param("id") id: string,
    @Body() body: CloseShiftDto,
  ) {
    const result = await this.shiftService.closeShift(cashierId, id, body);
    return ApiResponseDto.ok(result, "Shift closed and Z-Report generated successfully");
  }

  @Get("shifts/:id/z-report")
  @Roles("admin", "manager", "cashier")
  @ApiOperation({ summary: "Get Z-Report summary for a shift" })
  async getZReport(@Param("id") id: string) {
    const zReport = await this.shiftService.getZReport(id);
    return ApiResponseDto.ok(zReport);
  }

  @Get("shifts/history")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get shift history (Manager/Admin)" })
  async getShiftHistory(@Query("limit") limit?: string) {
    const history = await this.shiftService.getShiftHistory(Number(limit) || 10);
    return ApiResponseDto.ok(history);
  }

  @Get("kds-orders")
  @Roles("admin", "manager", "kitchen")
  @ApiOperation({ summary: "Get active kitchen orders for KDS display" })
  async getKdsOrders() {
    const orders = await this.posService.getKdsOrders();
    return ApiResponseDto.ok(orders);
  }

  @Patch("orders/:id/kds-status")
  @Roles("admin", "manager", "kitchen")
  @ApiOperation({ summary: "Update kitchen preparation status of an order" })
  async updateKdsStatus(
    @CurrentUser("sub") actorId: string,
    @CurrentUser("role") actorRole: string,
    @Param("id") id: string,
    @Body() body: { kitchenStatus: string },
  ) {
    const updated = await this.posService.updateKdsStatus(actorId, actorRole, id, body.kitchenStatus);
    return ApiResponseDto.ok(updated, "Kitchen status updated successfully");
  }
}

