/* ------------------------------------------------------------
   Robust local‑storage helpers with key + legacy migration
   ------------------------------------------------------------ */
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  variant: string;
  size?: string;
  qty: number;
  img?: string;
};

const LEGACY_KEY = "shop_cart"; // old single bucket

/** Load cart from a bucket key (guest or user). Migrates legacy data. */
export function loadCart(key: string): CartItem[] {
  if (typeof window === "undefined") return [];

  // 1️⃣ try new bucket
  const raw = localStorage.getItem(key);
  if (raw) return parse(raw);

  // 2️⃣ fallback: legacy bucket → migrate & clear legacy
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    const parsed = parse(legacy);
    localStorage.removeItem(LEGACY_KEY);
    localStorage.setItem(key, JSON.stringify(parsed));
    return parsed;
  }

  return [];
}

/** Save cart to specific bucket */
export function saveCart(key: string, cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(cart));
}

/* ---------- helpers ---------- */
function parse(raw: string): CartItem[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr)
      ? arr.map((it: any): CartItem => ({
          productId: it.productId ?? it.id, // legacy id → productId
          name: it.name,
          price: it.price,
          variant: it.variant,
          size: it.size,
          qty: it.qty,
          img: it.img,
        }))
      : [];
  } catch {
    return [];
  }
}
