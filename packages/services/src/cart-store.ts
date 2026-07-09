import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem, ItemVariant, AddOn } from "@juice-vibe/types";
import { generateId } from "@juice-vibe/utils";

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  isOpen: boolean;
  addItem: (menuItem: MenuItem, quantity?: number, variant?: ItemVariant, addOns?: AddOn[], notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      isOpen: false,

      addItem: (menuItem, quantity = 1, variant, addOns = [], notes = "") => {
        const existing = get().items.find(
          (i) => i.menuItem.id === menuItem.id && i.variant?.id === variant?.id
        );
        if (existing) {
          get().updateQuantity(existing.id, existing.quantity + quantity);
          return;
        }
        const variantPrice = variant?.priceAdjustment ?? 0;
        const addOnsPrice = addOns.reduce((sum, a) => sum + a.price, 0);
        const totalPrice = (menuItem.price + variantPrice + addOnsPrice) * quantity;

        const item: CartItem = {
          id: generateId(),
          menuItem,
          quantity,
          variant,
          addOns,
          notes,
          totalPrice,
        };
        set((state) => ({ items: [...state.items, item] }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity,
                  totalPrice:
                    (i.menuItem.price +
                      (i.variant?.priceAdjustment ?? 0) +
                      i.addOns.reduce((s, a) => s + a.price, 0)) *
                    quantity,
                }
              : i
          ),
        })),

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),
      getTotal: () => {
        const subtotal = get().items.reduce((sum, i) => sum + i.totalPrice, 0);
        const discount = get().couponDiscount;
        return Math.max(0, subtotal - discount);
      },
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "juice-vibe-cart", partialize: (state) => ({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount }) }
  )
);
