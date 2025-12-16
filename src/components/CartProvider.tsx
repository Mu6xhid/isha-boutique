/* ───────── src/components/CartProvider.tsx ───────── */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { loadCart, saveCart, CartItem } from "@/lib/cart-local";

/* ---------- context ---------- */
type CartCtx = {
  items: CartItem[];
  add: (it: CartItem) => void;
  remove: (idx: number) => void;
  setQty: (idx: number, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | undefined>(undefined);
export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

/* ---------- constants ---------- */
const guestKey = "shop_cart_guest";
const DEBOUNCE_MS = 400;

/* ---------- provider ---------- */
export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const key = session ? `shop_cart_${session.user.id}` : guestKey;

  const [items, setItems] = useState<CartItem[]>([]);

  /* refs to coordinate effects */
  const localLoaded = useRef(false);    // localStorage read done
  const dbMerged    = useRef(false);    // guest→DB merge done
  const dbLoaded    = useRef(false);    // server cart fetched
  const prevLen     = useRef(0);
  const saveTmr     = useRef<NodeJS.Timeout | null>(null);

  /* 1️⃣ load bucket whenever key changes */
  useEffect(() => {
    const bucket = loadCart(key);
    setItems(bucket);
    prevLen.current = bucket.length;
    localLoaded.current = true;
    dbLoaded.current = !session; // if guest, DB fetch not needed
    dbMerged.current = false;    // reset merge flag on logout/login swap
  }, [key, session]);

  /* 2️⃣ if logged‑in, fetch DB cart once & merge */
  useEffect(() => {
    if (!session || dbLoaded.current) return;

    (async () => {
      const res = await fetch("/api/cart");
      const { items: db } = await res.json();

      const merged = [...items];
      db.forEach((d: CartItem) => {
        const idx = merged.findIndex(
          (x) =>
            x.productId === d.productId &&
            x.variant === d.variant &&
            x.size === d.size,
        );
        if (idx >= 0) merged[idx].qty = Math.max(merged[idx].qty, d.qty);
        else merged.push(d);
      });

      setItems(merged);
      dbLoaded.current = true;
    })();
  }, [session, items]);

  /* 3️⃣ one‑time merge guest→server on first login */
  useEffect(() => {
    if (!session || dbMerged.current) return;

    const guest = loadCart(guestKey);
    if (guest.length === 0) {
      dbMerged.current = true;
      return;
    }

    const merged = [...items];
    guest.forEach((g) => {
      const idx = merged.findIndex(
        (x) =>
          x.productId === g.productId &&
          x.variant === g.variant &&
          x.size === g.size,
      );
      if (idx >= 0) merged[idx].qty = Math.max(merged[idx].qty, g.qty);
      else merged.push(g);
    });

    setItems(merged);                  // triggers save effect
    localStorage.removeItem(guestKey);
    dbMerged.current = true;
  }, [session, items]);

  /* 4️⃣ save (localStorage + debounced PATCH) */
  useEffect(() => {
    if (!localLoaded.current || !dbLoaded.current) return;

   // Always allow saving to localStorage
saveCart(key, items);
prevLen.current = items.length;


    saveCart(key, items);
    prevLen.current = items.length;

    if (!session) return; // skip DB sync for guests

    if (saveTmr.current) clearTimeout(saveTmr.current);
    saveTmr.current = setTimeout(() => {
      fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    }, DEBOUNCE_MS);
  }, [items, key, session]);

  /* 5️⃣ flush debounce on tab close/refresh */
  useEffect(() => {
    const flush = () => {
      if (!saveTmr.current) return;

      clearTimeout(saveTmr.current);
      saveTmr.current = null;

      if (session) {
        navigator.sendBeacon(
          "/api/cart",
          new Blob([JSON.stringify({ items })], { type: "application/json" }),
        );
      }
      saveCart(key, items);
    };

    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [items, key, session]);

  /* ---------- actions ---------- */
  const ctx = useMemo<CartCtx>(
    () => ({
      items,
      add(it) {
        setItems((prev) => {
          const idx = prev.findIndex(
            (x) =>
              x.productId === it.productId &&
              x.variant === it.variant &&
              x.size === it.size,
          );
          if (idx >= 0) {
            const next = [...prev];
            next[idx].qty += it.qty;
            return next;
          }
          return [...prev, it];
        });
      },
      remove(i) {
        setItems((prev) => prev.filter((_, idx) => idx !== i));
      },
      setQty(i, qty) {
        setItems((prev) => {
          const next = [...prev];
          next[i].qty = qty;
          return next;
        });
      },
      clear() {
  setItems([]);
  saveCart(key, []); // ✅ persist empty cart
  if (session) fetch("/api/cart", { method: "DELETE" });
},

    }),
    [items, key, session],
  );

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
