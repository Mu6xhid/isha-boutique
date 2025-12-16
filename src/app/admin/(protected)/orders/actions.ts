"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  id: string,
  status: "PLACED" | "PACKED" | "SHIPPED" | "FULFILLED" | "CANCELLED"
) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
