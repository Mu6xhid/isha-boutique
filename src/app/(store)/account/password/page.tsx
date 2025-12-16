// ❌ no "use client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Change Password" };

/* ---------- SERVER ACTION ---------- */
export async function changePassword(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/password");

  const userId = session.user.id;
  const current = formData.get("current") as string;
  const next = formData.get("next") as string;
  const confirm = formData.get("confirm") as string;

  if (next !== confirm) {
    throw new Error("New passwords do not match");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(current, user.password);
  if (!ok) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(next, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/password");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">Change Password</h1>
      <ChangePasswordForm onSubmit={changePassword} />
    </main>
  );
}
