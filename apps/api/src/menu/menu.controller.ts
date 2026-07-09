import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { JwtAuthGuard, RolesGuard, Roles, OptionalAuthGuard } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Menu")
@Controller("menu")
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get("categories")
  @ApiOperation({ summary: "Get all active categories" })
  async getCategories() {
    const categories = await this.menuService.getCategories();
    return ApiResponseDto.ok(categories);
  }

  @Get("categories/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all categories (admin)" })
  async getAllCategories() {
    const categories = await this.menuService.getAllCategories();
    return ApiResponseDto.ok(categories);
  }

  @Post("categories")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a category" })
  async createCategory(@Body() body: any) {
    const category = await this.menuService.createCategory(body);
    return ApiResponseDto.ok(category, "Category created");
  }

  @Patch("categories/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a category" })
  async updateCategory(@Param("id") id: string, @Body() body: any) {
    const category = await this.menuService.updateCategory(id, body);
    return ApiResponseDto.ok(category, "Category updated");
  }

  @Delete("categories/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a category" })
  async deleteCategory(@Param("id") id: string) {
    await this.menuService.deleteCategory(id);
    return ApiResponseDto.ok(null, "Category deleted");
  }

  @Get("items")
  @ApiOperation({ summary: "Get menu items" })
  async getMenuItems(
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("popular") popular?: string,
    @Query("featured") featured?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const result = await this.menuService.getMenuItems({
      category,
      search,
      popular: popular === "true",
      featured: featured === "true",
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return ApiResponseDto.paginated(result.items, result.total, result.page, result.limit);
  }

  @Get("items/:id")
  @ApiOperation({ summary: "Get menu item by ID" })
  async getMenuItem(@Param("id") id: string) {
    const item = await this.menuService.getMenuItem(id);
    return ApiResponseDto.ok(item);
  }

  @Post("items")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a menu item" })
  async createMenuItem(@Body() body: any) {
    const item = await this.menuService.createMenuItem(body);
    return ApiResponseDto.ok(item, "Menu item created");
  }

  @Patch("items/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a menu item" })
  async updateMenuItem(@Param("id") id: string, @Body() body: any) {
    const item = await this.menuService.updateMenuItem(id, body);
    return ApiResponseDto.ok(item, "Menu item updated");
  }

  @Delete("items/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a menu item" })
  async deleteMenuItem(@Param("id") id: string) {
    await this.menuService.deleteMenuItem(id);
    return ApiResponseDto.ok(null, "Menu item deleted");
  }

  @Put("items/reorder")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reorder menu items" })
  async reorderItems(@Body() body: { items: { id: string; order: number }[] }) {
    await this.menuService.reorderItems(body.items);
    return ApiResponseDto.ok(null, "Items reordered");
  }
}
