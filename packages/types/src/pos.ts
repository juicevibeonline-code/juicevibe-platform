import { PaymentMethod, PaymentStatus, OrderSource, KitchenStatus, ShiftStatus, InventoryTxType } from "./common";
import { OrderItem, OrderType } from "./order";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  cardLast4?: string;
  transactionRef?: string;
  cashTendered?: number;
  changeGiven?: number;
  createdAt: string;
}

export interface CashierShift {
  id: string;
  cashierId: string;
  cashierName?: string;
  openingFloat: number;
  closingCash?: number;
  expectedCash?: number;
  variance?: number;
  status: ShiftStatus;
  openedAt: string;
  closedAt?: string;
  notes?: string;
  totalSales?: number;
  cashSales?: number;
  cardSales?: number;
  onlineSales?: number;
  orderCount?: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  beforeData?: any;
  afterData?: any;
  ipAddress?: string;
  orderId?: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItem?: import("./menu").MenuItem;
  yieldServings: number;
  isActive: boolean;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  inventoryItemId: string;
  inventoryItem?: import("./inventory").InventoryItem;
  inventoryItemName?: string;
  quantity: number;
  unit?: string;
  wastageFactor: number;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  inventoryItem?: import("./inventory").InventoryItem;
  type: InventoryTxType;
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  notes?: string;
  actorId?: string;
  createdAt: string;
}


export interface CreatePosOrderInput {
  items: {
    menuItemId: string;
    quantity: number;
    variant?: string;
    addOnIds?: string[];
    notes?: string;
  }[];
  customerName?: string;
  customerPhone?: string;
  type: OrderType;
  tableId?: string;
  notes?: string;
  couponCode?: string;
  discountAmount?: number;
  serviceCharge?: number;
  payment?: {
    method: PaymentMethod;
    cashTendered?: number;
    splitTransactions?: {
      method: PaymentMethod;
      amount: number;
      cardLast4?: string;
      transactionRef?: string;
      cashTendered?: number;
    }[];
  };
}

export interface SplitPaymentInput {
  transactions: {
    method: PaymentMethod;
    amount: number;
    cardLast4?: string;
    transactionRef?: string;
    cashTendered?: number;
  }[];
}

export interface OpenShiftInput {
  openingFloat: number;
  notes?: string;
}

export interface CloseShiftInput {
  closingCash: number;
  notes?: string;
}

export interface ZReportSummary {
  shiftId: string;
  cashierName: string;
  openedAt: string;
  closedAt: string;
  openingFloat: number;
  grossSales: number;
  discountsTotal: number;
  taxTotal: number;
  netSales: number;
  cashSales: number;
  cardSales: number;
  onlineSales: number;
  expectedDrawerCash: number;
  actualCountedCash: number;
  variance: number;
  orderCount: number;
  voidCount: number;
}
