/**
 * All server‑side product mutations live here.
 * Every function is marked `"use server"` so it can be
 * called either …
 *   • directly as a **Server Action**  (e.g. <form action={addProduct}>)
 *   • or from an **API route** / custom fetch
 */

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

/* ───────────────────── helpers ─────────────────────── */

const csvToArray = (v: unknown) =>
  typeof v === "string"
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : Array.isArray(v)
    ? v
    : [];

const jsonOrArray = (v: unknown) =>
  typeof v === "string"
    ? JSON.parse(v || "[]")
    : Array.isArray(v)
    ? v
    : [];

/* Build a unique slug (foo, foo-1, foo-2 …) */
async function makeUniqueSlug(base: string) {
  let slug = base;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

/* Normalise FormData vs plain object */
function getVal(src: Record<string, any> | FormData, key: string) {
  return src instanceof FormData ? src.get(key) : (src as any)[key];
}

/* ─────────────────── add product ───────────────────── */

export async function addProduct(
  raw: Record<string, any> | FormData
): Promise<{ ok: true }> {
  const name = getVal(raw, "name") as string;
  const slug = await makeUniqueSlug(name.toLowerCase().replace(/\s+/g, "-"));

  const data: Prisma.ProductCreateInput = {
    name,
    slug,
    price: Number(getVal(raw, "price") || 0) * 100,
    description: (getVal(raw, "description") as string) || null,
    stock: Number(getVal(raw, "stock") || 0),
    sizes: csvToArray(getVal(raw, "sizes")),
    colors: csvToArray(getVal(raw, "colors")),
    images: jsonOrArray(getVal(raw, "images")),
    category: {
      connect: { id: getVal(raw, "categoryId") as string },
    },
  };

  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  return { ok: true };
}

/* ────────────────── update product ─────────────────── */

export async function updateProduct(
  id: string,
  raw: Record<string, any> | FormData
): Promise<{ ok: true }> {
  const categoryId = getVal(raw, "categoryId") as string | undefined;

  const data: Prisma.ProductUpdateInput = {
    name: getVal(raw, "name") as string,
    price: Number(getVal(raw, "price") || 0) * 100,
    description: (getVal(raw, "description") as string) || null,
    stock: Number(getVal(raw, "stock") || 0),
    sizes: jsonOrArray(getVal(raw, "sizes")),
    colors: jsonOrArray(getVal(raw, "colors")),
    images: jsonOrArray(getVal(raw, "images")),
    ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
  };

  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  return { ok: true };
}

/* ────────────────── delete product ─────────────────── */

export async function deleteProduct(id: string): Promise<{ ok: true }> {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { ok: true };
}
