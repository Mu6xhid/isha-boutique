"use client";

import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";            // for the summary thumbnail

type Addr = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  addrType: string;
  landmark?: string;
};

const money = (n: number) => `₹${(n / 100).toFixed(2)}`;

export default function CheckoutClient() {
  const { data: session } = useSession();
  const { items, clear } = useCart();
  const router = useRouter();

  /* ─────────────────────────────────────── addresses */
  const [addrs, setAddrs] = useState<Addr[]>([]);
  const [addressId, setAddressId] = useState<string>();

  useEffect(() => {
    (async () => {
      const res  = await fetch("/api/addresses");
      const list = (await res.json()) as Addr[];
      setAddrs(list);
      if (list.length) setAddressId(list[0].id);
    })();
  }, []);

  /* ─────────────────────────────────────── totals    */
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal ;

  /* ─────────────────────────────────────── order      */
  async function placeOrder() {
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    if (!items.length)        return toast.error("Cart is empty");
    if (!addressId)           return toast.error("Select a delivery address");

    const res = await fetch("/api/checkout", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ items, addressId }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      return toast.error(error || "Could not place order");
    }

    clear();
    const { orderId } = await res.json();
    toast.success("Order placed!");
    router.replace(`/order/${orderId}`);
  }

  /* ─────────────────────────────────────── UI         */
  if (!items.length) {
    return (
      <main className="p-6 text-center">
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* top bar with selected address */}
      {addrs.length > 0 && (
        <section className="mb-6 border rounded p-4 flex justify-between">
          <div>
            <p className="font-semibold">
              Deliver to: {addrs.find(a => a.id === addressId)?.name},{" "}
              {addrs.find(a => a.id === addressId)?.postcode}
              <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                {addrs.find(a => a.id === addressId)?.addrType}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              {addrs.find(a => a.id === addressId)?.line1},{" "}
              {addrs.find(a => a.id === addressId)?.city}
            </p>
          </div>

          <button
            className="text-sm text-blue-600"
            onClick={() => setAddressId(undefined)}
          >
            Change
          </button>
        </section>
      )}

      {/* list + price column */}
      <div className="md:flex md:gap-8">
        {/* cart items */}
        <div className="flex-1 space-y-4">
          {items.map((it, i) => (
            <div key={i} className="flex gap-4 border rounded p-4">
              {it.img && (
                <Image
                  src={it.img}
                  alt={it.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                  unoptimized
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{it.name}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {it.variant} {it.size && `· ${it.size}`}
                </p>
                <p className="text-sm">{money(it.price)}</p>
                <p className="text-sm">Qty {it.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* price details */}
        <aside className="mt-8 md:mt-0 md:w-72 border rounded p-4 space-y-3">
          <h2 className="font-semibold">Price Details</h2>
          <div className="flex justify-between">
            <span>Price ({items.length} item)</span>
            <span>{money(subtotal)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>{money(total)}</span>
          </div>
        </aside>
      </div>

      {/* address chooser when “Change” pressed */}
      {addressId === undefined && (
        <div className="my-6 space-y-2">
          <h3 className="font-medium">Select delivery address</h3>
          {addrs.map(a => (
            <label key={a.id} className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                name="addr"
                value={a.id}
                onChange={() => setAddressId(a.id)}
              />
              <span>
                {a.name}, {a.line1}, {a.city}, {a.postcode}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={placeOrder}
        className="mt-6 w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded">
        PLACE ORDER
      </button>
    </main>
  );
}
