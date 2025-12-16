// No "use client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Account Dashboard" };

export default async function AccountDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const userId = session.user.id;

  /* ------- gather stats in parallel ------- */
  const [orderCount, openCount, lastOrder] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({
      where: {
        userId,
        NOT: { status: { in: ["DELIVERED", "CANCELLED"] } },
      },
    }),
    prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const memberSince = new Date(session.user.createdAt ?? "").toLocaleDateString(
    undefined,
    { year: "numeric", month: "short" }
  );

  /* ------- helpers ------- */
  const fmtDate = (d: Date | undefined) =>
    d ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      {/* welcome */}
      <section className="rounded border p-6">
        <h1 className="text-2xl font-semibold">
          Hi {session.user.name?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="text-sm text-gray-600">
          Member since {memberSince}
        </p>
      </section>

      {/* stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={orderCount} />
        <StatCard label="Open Orders" value={openCount} />
        <StatCard label="Last Order" value={fmtDate(lastOrder?.createdAt)} />
      </section>

      {/* quick links */}
      <section className="rounded border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/account/orders" className="hover:underline">
              ➜ View all orders
            </Link>
          </li>
          <li>
            <Link href="/account/address" className="hover:underline">
              ➜ Manage delivery address
            </Link>
          </li>
          <li>
            <Link href="/account/details" className="hover:underline">
              ➜ Account details
            </Link>
          </li>
          <li>
            <Link href="/account/password" className="hover:underline">
              ➜ Change password
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

/* ---------- small card component ---------- */
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border p-4 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
    </div>
  );
}
