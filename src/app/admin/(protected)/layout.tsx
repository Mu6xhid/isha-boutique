import { auth } from "@/lib/auth";               // server‑side helper
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import SessionClient from "@/components/SessionClient";
import AdminNavBar   from "@/components/AdminNavBar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  /* ── 1) server‑side guard ────────────────────────────── */
  const session = await auth();                 // <- runs only on server
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  /* ── 2) render admin shell ───────────────────────────── */
  return (
    <SessionClient session={session}>
      <AdminNavBar />
      <main className="p-6">{children}</main>
    </SessionClient>
  );
}
