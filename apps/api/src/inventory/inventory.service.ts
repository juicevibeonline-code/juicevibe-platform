import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { CreateInventoryDto, UpdateInventoryDto } from "./dto/inventory.dto";

@Injectable()
export class InventoryService {
  async getItems() {
    return prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async getItem(id: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });
    if (!item || !item.isActive) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async createItem(input: CreateInventoryDto) {
    return prisma.inventoryItem.create({
      data: {
        name: input.name,
        quantity: input.quantity,
        unit: input.unit,
        minStockLevel: input.minStockLevel,
        supplier: input.supplier || null,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      },
    });
  }

  async updateItem(id: string, input: UpdateInventoryDto) {
    await this.getItem(id);

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.quantity !== undefined) updateData.quantity = input.quantity;
    if (input.unit !== undefined) updateData.unit = input.unit;
    if (input.minStockLevel !== undefined) updateData.minStockLevel = input.minStockLevel;
    if (input.supplier !== undefined) updateData.supplier = input.supplier;
    if (input.expiryDate !== undefined) updateData.expiryDate = input.expiryDate ? new Date(input.expiryDate) : null;

    return prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteItem(id: string) {
    await this.getItem(id);
    return prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- RECIPES (BILL OF MATERIALS) ---

  async getRecipes() {
    return prisma.recipe.findMany({
      where: { isActive: true },
      include: {
        menuItem: {
          select: { id: true, name: true, price: true, categoryId: true },
        },
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRecipe(menuItemId: string) {
    return prisma.recipe.findUnique({
      where: { menuItemId },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });
  }

  async saveRecipe(input: import("./dto/inventory.dto").SaveRecipeDto) {
    return prisma.$transaction(async (tx) => {
      // 1. Delete old recipe if exists
      const existing = await tx.recipe.findUnique({
        where: { menuItemId: input.menuItemId },
      });

      if (existing) {
        await tx.recipeIngredient.deleteMany({
          where: { recipeId: existing.id },
        });
        await tx.recipe.delete({
          where: { id: existing.id },
        });
      }

      // 2. Create new Recipe with ingredients
      const recipe = await tx.recipe.create({
        data: {
          menuItemId: input.menuItemId,
          yieldServings: input.yieldServings || 1.0,
          ingredients: {
            create: input.ingredients.map((ing) => ({
              inventoryItemId: ing.inventoryItemId,
              quantity: ing.quantity,
              wastageFactor: ing.wastageFactor || 0.0,
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              inventoryItem: true,
            },
          },
        },
      });

      return recipe;
    });
  }

  // --- DOUBLE-ENTRY INVENTORY LEDGER & STOCK MOVEMENTS ---

  async recordStockMovement(actorId: string, input: import("./dto/inventory.dto").StockMovementDto) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: input.inventoryItemId },
      });

      if (!item) throw new NotFoundException("Inventory item not found");

      // Calculate quantity delta:
      // PURCHASE / RETURN / ADJUSTMENT(+) adds stock
      // WASTAGE / SALE / ADJUSTMENT(-) deducts stock
      const isPositive = input.type === "PURCHASE" || input.type === "RETURN" || (input.type === "ADJUSTMENT" && input.quantity > 0);
      const absQty = Math.abs(input.quantity);
      const delta = isPositive ? absQty : -absQty;
      const newQty = Math.max(0, item.quantity + delta);

      // 1. Update Inventory Item current quantity
      const updatedItem = await tx.inventoryItem.update({
        where: { id: item.id },
        data: { quantity: newQty },
      });

      // 2. Record Immutable Inventory Transaction Ledger Entry
      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryItemId: item.id,
          type: input.type as any,
          quantity: delta,
          unitCost: input.unitCost || null,
          referenceId: input.referenceId || null,
          notes: input.notes || null,
          actorId: actorId,
        },
      });

      return { item: updatedItem, transaction };
    });
  }

  async getTransactions(inventoryItemId?: string) {
    return prisma.inventoryTransaction.findMany({
      where: inventoryItemId ? { inventoryItemId } : undefined,
      include: {
        inventoryItem: {
          select: { id: true, name: true, unit: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}

