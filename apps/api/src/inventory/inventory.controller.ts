import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import { CreateInventoryDto, UpdateInventoryDto, SaveRecipeDto, StockMovementDto } from "./dto/inventory.dto";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { CurrentUser } from "../common/decorators";
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

  @Get("recipes")
  @ApiOperation({ summary: "Get all item recipes with Bill of Materials" })
  async getRecipes() {
    const recipes = await this.inventoryService.getRecipes();
    return ApiResponseDto.ok(recipes);
  }

  @Get("recipes/:menuItemId")
  @ApiOperation({ summary: "Get recipe for a specific menu item" })
  async getRecipe(@Param("menuItemId") menuItemId: string) {
    const recipe = await this.inventoryService.getRecipe(menuItemId);
    return ApiResponseDto.ok(recipe);
  }

  @Post("recipes")
  @ApiOperation({ summary: "Create or update a menu item recipe" })
  async saveRecipe(@Body() body: SaveRecipeDto) {
    const recipe = await this.inventoryService.saveRecipe(body);
    return ApiResponseDto.ok(recipe, "Recipe saved successfully");
  }

  @Post("stock-movement")
  @ApiOperation({ summary: "Record stock inward, purchase, wastage or adjustment" })
  async recordStockMovement(
    @CurrentUser("sub") actorId: string,
    @Body() body: StockMovementDto,
  ) {
    const result = await this.inventoryService.recordStockMovement(actorId, body);
    return ApiResponseDto.ok(result, "Stock movement recorded successfully");
  }

  @Get("transactions")
  @ApiOperation({ summary: "Get inventory transaction ledger" })
  async getTransactions(@Query("inventoryItemId") inventoryItemId?: string) {
    const txs = await this.inventoryService.getTransactions(inventoryItemId);
    return ApiResponseDto.ok(txs);
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

