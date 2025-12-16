// src/app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const items = (await req.json()) as {
    id: string;
    name: string;
    price: number;
    variant: string;
    size?: string;
    qty: number;
    img?: string;
  }[];

  if (!items.length)
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });

  /* ── total & current user ──────────────────────────────── */
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id ?? null; // ← may be null for guest

  /* ── create order ──────────────────────────────────────── */
  const order = await prisma.order.create({
    data: {
      total,
      userId,                     // ✅ link order → user!
      items: {
        create: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          variant: i.variant,
          size: i.size,
          qty: i.qty,
          img: i.img,
        })),
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
