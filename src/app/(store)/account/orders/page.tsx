// src/app/account/orders/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg p-6 space-y-4">
              <header className="flex justify-between text-sm text-gray-600">
                <span>Order ID: <code>{order.id}</code></span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </header>

              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center">
                    {item.img && (
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded border object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.variant} {item.size && `· Size ${item.size}`} – Qty {item.qty}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="font-semibold text-right text-green-700">
                Total: ₹{(order.total / 100).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
