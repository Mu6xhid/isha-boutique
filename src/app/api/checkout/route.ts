// src/app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// src/app/api/checkout/route.ts
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, addressId } = await req.json();

    if (!items?.length || !addressId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    /* TIP: verify productId exists in DB and pull price again here */

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: items.reduce((s: any, i: any) => s + i.price * i.qty, 0),
        addressId,
        items: {
          create: items.map((i: any) => ({
  productId: i.productId,
  name: i.name,
  price: i.price,
  variant: i.variant,
  size: i.size,
  qty: i.qty,
  img: i.img,
}))

        },
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("Checkout error:", err);   // <-- look in terminal
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}
