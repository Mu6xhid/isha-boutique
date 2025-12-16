import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ items: [] });

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });

  return NextResponse.json({ items: cart?.items ?? [] });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { items } = await req.json();

  // Step 1: Ensure cart exists for the user
  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const cartId = cart.id;

  // Step 2: Upsert cart items with correct cartId
  const upserts = items.map((it: any) =>
    prisma.cartItem.upsert({
      where: {
        cartId_productId_variant_size: {
          cartId,
          productId: it.productId,
          variant: it.variant,
          size: it.size ?? "",
        },
      },
      update: { qty: it.qty },
      create: { ...it, cartId },
    })
  );

  // Step 3: Delete removed items
  await prisma.$transaction([
    ...upserts,
    prisma.cartItem.deleteMany({
      where: {
        cartId,
        NOT: items.map((it: any) => ({
          productId: it.productId,
          variant: it.variant,
          size: it.size ?? "",
        })),
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
