import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json([], { status: 200 });
  }

  const list = await prisma.address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(list);
}