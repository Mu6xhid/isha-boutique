"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Package, Tags, ReceiptText } from "lucide-react"; // 👈 added Tags
import { signOut, useSession } from "next-auth/react";

export default function AdminNavBar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between gap-6 border-b px-6 py-4 bg-white">
      {/* ── Left: brand ─────────────────────────────────────────── */}
      <Link href="/admin/products" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={36}
          priority
          draggable={false}
        />
        <span className="hidden sm:inline font-bold text-xl">Admin Panel</span>
      </Link>

      {/* ── Middle: primary links ─────────────────────────────── */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/admin/products" className="flex items-center gap-1">
          <Package className="w-4 h-4" />
          Products
        </Link>

        <Link href="/admin/categories" className="flex items-center gap-1">
          <Tags className="w-4 h-4" />      {/* 👈 NEW link */}
          Categories
        </Link>

        <Link href="/admin/orders" className="flex items-center gap-1">
          <ReceiptText className="w-4 h-4" />
          Orders
        </Link>
      </div>

      {/* ── Right: user + logout ──────────────────────────────── */}
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-2 text-sm hover:opacity-80"
      >
        <LogOut className="w-4 h-4" />
        {session?.user?.email ?? "Logout"}
      </button>
    </nav>
  );
}
