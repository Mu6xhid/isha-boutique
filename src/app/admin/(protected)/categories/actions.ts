"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ---------- CREATE ---------- */
export async function createCategory(fd: FormData) {
  const name  = fd.get("name")  as string;
  const slug  = fd.get("slug")  as string;
  const cover = fd.get("cover") as string | null;

  await prisma.category.create({
    data: { name, slug, cover: cover || null },
  });
  revalidatePath("/admin/categories");
}

/* ---------- UPDATE ---------- */
export async function updateCategory(id: string, fd: FormData) {
  const name  = fd.get("name")  as string;
  const slug  = fd.get("slug")  as string;
  const cover = fd.get("cover") as string | null;

  await prisma.category.update({
    where: { id },
    data: { name, slug, cover: cover || null },
  });
  revalidatePath("/admin/categories");
}

/* ---------- DELETE ---------- */
export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
