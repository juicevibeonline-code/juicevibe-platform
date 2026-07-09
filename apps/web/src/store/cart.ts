import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/data/menu";

export interface CartItem extends MenuItem {
  cartItemId: string; // Unique ID for the cart item (allows same product with different variations later if needed)
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; count: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      
      addItem: (item, quantity = 1) => set((state) => {
        // Check if item already exists in cart
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
            isOpen: true, // Auto-open cart on add
          };
        }

        return {
          items: [...state.items, { ...item, cartItemId: crypto.randomUUID(), quantity }],
          isOpen: true, // Auto-open cart on add
        };
      }),

      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter((i) => i.cartItemId !== cartItemId)
      })),

      updateQuantity: (cartItemId, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => ({
            subtotal: acc.subtotal + (item.price * item.quantity),
            count: acc.count + item.quantity
          }),
          { subtotal: 0, count: 0 }
        );
      },
    }),
    {
      name: "juice-vibe-cart",
      // Exclude UI state from persistence
      partialize: (state) => ({ items: state.items }),
    }
  )
);
