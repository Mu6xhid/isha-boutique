import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "../actions";

export default async function OrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true },
  });
  if (!order) return notFound();

  const statusOptions = [
    "PLACED",
    "PACKED",
    "SHIPPED",
    "FULFILLED",
    "CANCELLED",
  ] as const;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      {/* ---- title & status row ---- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          Order&nbsp;<span className="font-mono text-base">{order.id}</span>
        </h1>

        <form
          action={async (fd) => {
            "use server";
            const status = fd.get("status") as typeof statusOptions[number];
            await updateOrderStatus(order.id, status);
            redirect("/admin/orders");
          }}
          className="flex items-center gap-2"
        >
          <select
            name="status"
            defaultValue={order.status}
            className="border rounded px-3 py-1 text-sm"
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded shadow transition">
            Update
          </button>
        </form>
      </div>

      {/* ---- address card ---- */}
      {order.address && (
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-2">Delivery Address</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {order.address.name} {order.address.phone}
            {"\n"}
            {order.address.line1}, {order.address.city},{" "}
            {order.address.state} - {order.address.postcode}
          </p>
        </section>
      )}

      {/* ---- items list ---- */}
      <section className="space-y-4">
        {order.items.map((it) => (
          <div
            key={it.id}
            className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm"
          >
            {it.img && (
              <Image
                src={it.img}
                alt={it.name}
                width={70}
                height={70}
                className="rounded-lg object-cover shrink-0 border"
                unoptimized
              />
            )}

            <div className="flex-1">
              <p className="font-medium text-gray-800">{it.name}</p>
              <p className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                {it.variant && <span>{it.variant}</span>}
                {it.size && <span>Size {it.size}</span>}
                <span>
                  {it.qty} × ₹{(it.price / 100).toFixed(2)}
                </span>
              </p>
            </div>

            <p className="shrink-0 font-medium text-gray-700">
              ₹{((it.price * it.qty) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </section>

      {/* ---- total ---- */}
      <div className="text-right text-lg font-semibold">
        Grand Total: ₹{(order.total / 100).toFixed(2)}
      </div>
    </main>
  );
}
