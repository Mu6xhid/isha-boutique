/* -------------------------------------------------------------
 * /order/[id] – thank‑you page
 * ------------------------------------------------------------*/
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ClearCart from "./_clear-cart";

const money = (n: number) => `₹${(n / 100).toFixed(2)}`;

// ✅ define the shape we actually use in the JSX
type OrderItem = {
  id: string;
  name: string;
  price: number;
  variant: string;
  size: string | null;
  qty: number;
  img: string | null;
};

export default async function OrderThankYou({
  params: { id },
}: {
  params: { id: string };
}) {
  /* ───── fetch order ───── */
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      {/* clear local cart once we arrive on this page */}
      <ClearCart />

      <h1 className="text-3xl font-bold text-green-700">
        Thank you for your order!
      </h1>

      <p className="text-sm text-gray-600">
        Order&nbsp;
        <span className="font-mono">{order.id}</span> placed on{" "}
        {order.createdAt.toLocaleString()}.
      </p>

      <ul className="space-y-4">
        {order.items.map((item: OrderItem) => (
          <li key={item.id} className="flex gap-4 rounded border p-4">
            {item.img && (
              <Image
                src={item.img}
                alt={item.name}
                width={70}
                height={70}
                className="rounded object-cover"
                unoptimized
              />
            )}

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm capitalize text-gray-600">
                {item.variant}
                {item.size ? ` · ${item.size}` : ""}
              </p>
            </div>

            <p className="font-medium">
              {item.qty} × {money(item.price)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t pt-4 text-xl font-semibold">
        <span>Total</span>
        <span>{money(order.total)}</span>
      </div>

      <Link
        href="/"
        className="mx-auto mt-8 block w-max rounded bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black"
      >
        Continue shopping
      </Link>
    </main>
  );
}
