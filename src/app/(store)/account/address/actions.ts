// src/app/(store)/account/address/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id;
  const id = formData.get("id") as string | null;

  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const addrType = formData.get("addrType") as "HOME" | "WORK";
  const line1 = formData.get("line1")?.toString().trim();
  const line2 = formData.get("line2")?.toString().trim() || null;
  const city = formData.get("city")?.toString().trim();
  const state = formData.get("state")?.toString().trim();
  const postcode = formData.get("postcode")?.toString().trim();
  const country = "India";
  const landmark = formData.get("landmark")?.toString().trim() || null;
  const altPhone = formData.get("altPhone")?.toString().trim() || null;

  // ✅ Validate required fields
  if (!name || !phone || !addrType || !line1 || !city || !state || !postcode) {
    throw new Error("Required fields missing");
  }

  const data = {
    name,
    phone,
    altPhone,
    addrType,
    line1,
    line2,
    city,
    state,
    postcode,
    country,
    landmark,
  };

  if (id) {
    await prisma.address.update({ where: { id }, data });
  } else {
    await prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  revalidatePath("/account/address");
}
export async function deleteAddress(id: string) {
  await prisma.address.delete({ where: { id } });
  revalidatePath("/account/address");
}
