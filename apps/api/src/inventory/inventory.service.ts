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
}
