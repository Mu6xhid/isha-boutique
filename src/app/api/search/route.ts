import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name:        { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 24,                 // limit results
  });

  return NextResponse.json({ products });
}
