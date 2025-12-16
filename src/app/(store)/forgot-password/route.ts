// src/app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendResetMail } from "@/lib/mailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function POST() {
  // always return 200 (do not expose if email exists)
  const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!user) return NextResponse.json({ ok: true });

  // create token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expires },
  });

  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  await sendResetMail(ADMIN_EMAIL, resetUrl);

  return NextResponse.json({ ok: true });
}
