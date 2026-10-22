import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@juice-vibe/types";

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  tableId: string | null;
  setTableId: (tableId: string | null) => void;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; count: number };
  couponCode?: string | null;
  couponDiscount?: number;
  applyCoupon?: (code: string, discount: number) => void;
  removeCoupon?: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,
      setTableId: (tableId) => set({ tableId }),
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      couponCode: null,
      couponDiscount: 0,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                cartItemId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
                quantity,
              },
            ],
            isOpen: true,
          };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ items: [], tableId: null, couponCode: null, couponDiscount: 0 }),

      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => ({
            subtotal: acc.subtotal + item.price * item.quantity,
            count: acc.count + item.quantity,
          }),
          { subtotal: 0, count: 0 }
        );
      },

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
    }),
    {
      name: "juice-vibe-cart",
      partialize: (state) => ({ items: state.items, tableId: state.tableId, couponCode: state.couponCode, couponDiscount: state.couponDiscount }),
    }
  )
);
