import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, address: true },
  });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => {
            const first = order.items[0];
            return (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex gap-6 items-start rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* thumbnail */}
                  {first?.img && (
                    <Image
                      src={first.img}
                      alt={first.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover shrink-0 border"
                      unoptimized
                    />
                  )}

                  {/* body */}
                  <div className="flex-1 space-y-3">
                    {/* header */}
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                      <div>
                        <p className="font-semibold">
                          <span className="text-muted-foreground">#</span>
                          {order.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
  {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize
                            ${
                              order.status === "PLACED"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "PACKED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "SHIPPED"
                                ? "bg-indigo-100 text-indigo-800"
                                : order.status === "FULFILLED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {order.status}
                        </span>
                        <p className="font-bold text-green-600 mt-1">
                          ₹{(order.total / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* delivery address */}
                    {order.address && (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {order.address.name} {order.address.phone}
                        {"\n"}
                        {order.address.line1}, {order.address.city},{" "}
                        {order.address.state} - {order.address.postcode}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
