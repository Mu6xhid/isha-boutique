/* ---------- src/lib/cart-store.ts ---------- */
"use client";                               // 👈 REQ’D for zustand in App Router

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number; // paise
  img: string;
  variant: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (i: CartItem) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          /* merge identical variants */
          const i = s.items.findIndex(
            (x) =>
              x.productId === item.productId &&
              x.variant === item.variant &&
              x.size === item.size
          );
          if (i > -1) {
            const copy = [...s.items];
            copy[i].qty += item.qty;
            return { items: copy };
          }
          return { items: [...s.items, item] };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "shop-cart" }
  )
);
