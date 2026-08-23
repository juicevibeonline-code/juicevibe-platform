import { apiClient } from "./api-client";
import type {
  InventoryItem,
  CreateInventoryInput,
  UpdateInventoryInput,
  Recipe,
  InventoryTransaction,
} from "@juice-vibe/types";

export interface SaveRecipeInput {
  menuItemId: string;
  yieldServings?: number;
  ingredients: {
    inventoryItemId: string;
    quantity: number;
    wastageFactor?: number;
  }[];
}

export interface StockMovementInput {
  inventoryItemId: string;
  type: string;
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  notes?: string;
}

export const inventoryService = {
  async getItems(): Promise<InventoryItem[]> {
    const { data } = await apiClient.get("/inventory");
    return data.data;
  },

  async getItem(id: string): Promise<InventoryItem> {
    const { data } = await apiClient.get(`/inventory/${id}`);
    return data.data;
  },

  async createItem(input: CreateInventoryInput): Promise<InventoryItem> {
    const { data } = await apiClient.post("/inventory", input);
    return data.data;
  },

  async updateItem(id: string, input: UpdateInventoryInput): Promise<InventoryItem> {
    const { data } = await apiClient.patch(`/inventory/${id}`, input);
    return data.data;
  },

  async deleteItem(id: string): Promise<void> {
    await apiClient.delete(`/inventory/${id}`);
  },

  async getRecipes(): Promise<Recipe[]> {
    const { data } = await apiClient.get("/inventory/recipes");
    return data.data || [];
  },

  async getRecipe(menuItemId: string): Promise<Recipe | null> {
    const { data } = await apiClient.get(`/inventory/recipes/${menuItemId}`);
    return data.data;
  },

  async saveRecipe(input: SaveRecipeInput): Promise<Recipe> {
    const { data } = await apiClient.post("/inventory/recipes", input);
    return data.data;
  },

  async recordStockMovement(input: StockMovementInput): Promise<{ item: InventoryItem; transaction: InventoryTransaction }> {
    const { data } = await apiClient.post("/inventory/stock-movement", input);
    return data.data;
  },

  async getTransactions(inventoryItemId?: string): Promise<InventoryTransaction[]> {
    const { data } = await apiClient.get("/inventory/transactions", { params: { inventoryItemId } });
    return data.data || [];
  },
};

