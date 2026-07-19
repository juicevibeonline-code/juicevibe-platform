import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import { CreateInventoryDto, UpdateInventoryDto } from "./dto/inventory.dto";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Inventory")
@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
@ApiBearerAuth()
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: "Get all inventory items (Admin/Manager)" })
  async getItems() {
    const items = await this.inventoryService.getItems();
    return ApiResponseDto.ok(items);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an inventory item by ID (Admin/Manager)" })
  async getItem(@Param("id") id: string) {
    const item = await this.inventoryService.getItem(id);
    return ApiResponseDto.ok(item);
  }

  @Post()
  @ApiOperation({ summary: "Create a new inventory item (Admin/Manager)" })
  async createItem(@Body() body: CreateInventoryDto) {
    const item = await this.inventoryService.createItem(body);
    return ApiResponseDto.ok(item, "Inventory item created successfully");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an inventory item (Admin/Manager)" })
  async updateItem(@Param("id") id: string, @Body() body: UpdateInventoryDto) {
    const item = await this.inventoryService.updateItem(id, body);
    return ApiResponseDto.ok(item, "Inventory item updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an inventory item (Admin/Manager)" })
  async deleteItem(@Param("id") id: string) {
    await this.inventoryService.deleteItem(id);
    return ApiResponseDto.ok(null, "Inventory item deleted successfully");
  }
}
