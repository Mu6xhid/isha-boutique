// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper to set an HttpOnly cookie
function setSessionCookie(
  res: NextResponse,
  payload: { id: string; role: string }
) {
  res.cookies.set("session_user", JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // 1) Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // 2) Verify password hash
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // 3) Create response and set cookie
  const res = NextResponse.json({
    user: { email: user.email, role: user.role },
  });

  setSessionCookie(res, { id: user.id, role: user.role });

  return res;
}
