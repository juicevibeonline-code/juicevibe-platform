export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  supplier?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryInput {
  name: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  supplier?: string;
  expiryDate?: string;
}

export interface UpdateInventoryInput {
  name?: string;
  quantity?: number;
  unit?: string;
  minStockLevel?: number;
  supplier?: string;
  expiryDate?: string;
}
