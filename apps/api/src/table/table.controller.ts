import { Controller, Get, Post, Patch, Body, Param, UseGuards, Delete } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { TableService } from "./table.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Tables")
@Controller("tables")
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new table and generate QR code (Admin/Manager)" })
  async createTable(@Body() body: CreateTableDto) {
    const table = await this.tableService.createTable(body);
    return ApiResponseDto.ok(table, "Table created successfully");
  }

  @Post("regenerate-qr")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Regenerate all table QR codes with active domain URL" })
  async regenerateQRCodes() {
    const tables = await this.tableService.regenerateQRCodes();
    return ApiResponseDto.ok(tables, "All table QR codes regenerated successfully");
  }

  @Get()
  @ApiOperation({ summary: "Get all tables" })
  async getTables() {
    const tables = await this.tableService.getTables();
    return ApiResponseDto.ok(tables);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a table by ID" })
  async getTable(@Param("id") id: string) {
    const table = await this.tableService.getTable(id);
    return ApiResponseDto.ok(table);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "cashier", "kitchen")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update table floor state (available/occupied/bill_requested/paying)" })
  async updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    const table = await this.tableService.updateTableStatus(id, body.status);
    return ApiResponseDto.ok(table, "Table status updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a table (Admin/Manager)" })
  async deleteTable(@Param("id") id: string) {
    await this.tableService.deleteTable(id);
    return ApiResponseDto.ok(null, "Table deleted successfully");
  }
}


