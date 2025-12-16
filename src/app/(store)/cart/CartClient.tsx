/* ───────── src/app/(store)/cart/page.tsx ───────── */
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/CartProvider';
import { useEffect, useState } from 'react';

/* ───────── helpers ───────── */
interface Address {
  id: string;
  name: string;
  phone: string;
  addrType: 'HOME' | 'WORK';
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

const money = (n: number) => `₹${(n / 100).toFixed(2)}`;
const formatLabel = (a: Address) =>
  `${a.name} ${a.phone}\n${a.line1}, ${a.city}, ${a.state} - ${a.postcode}`;

/* ───────── component ───────── */
export default function CartClient() {
  const { items, remove, setQty } = useCart();
  const router = useRouter();

  const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = itemTotal;

  /* address state */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /* spinner while placing order */
  const [placing, setPlacing] = useState(false);

  /* fetch addresses once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/addresses');
        if (!res.ok) throw new Error();
        const data: Address[] = await res.json();
        setAddresses(data);
        if (data.length) {
          setSelectedAddress(data.find((a) => a.isDefault) ?? data[0]);
        }
      } catch {
        toast.error('Could not fetch addresses');
      }
    })();
  }, []);

  /* checkout */
  async function handleCheckout() {
    if (!items.length) return toast.error('Cart is empty');
    if (!selectedAddress)
      return toast.error('Please add a delivery address first');

    try {
      setPlacing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          items: items.map(
            ({ productId, price, name, variant, size, qty, img }) => ({
              productId,
              price,
              name,
              variant,
              size,
              qty,
              img,
            }),
          ),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPlacing(false);
        return toast.error(data.error ?? 'Checkout failed');
      }
      router.replace(`/order/${data.orderId}?success=1`);
    } catch {
      setPlacing(false);
      toast.error('Checkout failed – please try again');
    }
  }

  /* empty cart quick exit */
  if (items.length === 0)
    return (
      <main className="p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="underline text-[#6483ff]">
          Continue shopping →
        </Link>
      </main>
    );

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6 relative">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      {/* address banner */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        {selectedAddress ? (
          <>
            <p className="text-sm text-gray-600">
              Deliver to:{' '}
              <span className="font-medium">
                {formatLabel(selectedAddress).split('\n')[0]}
              </span>
            </p>
            <p className="text-sm whitespace-pre-wrap text-gray-600">
              {formatLabel(selectedAddress).split('\n').slice(1).join('\n')}
            </p>
            <button
              onClick={() => setShowAddressModal(true)}
              className="mt-1 text-[#6483ff] text-sm underline"
            >
              Change
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              You haven’t added a delivery address yet.
            </p>
            <button
              onClick={() => router.push('/account/address')}
              className="mt-1 text-[#6483ff] underline text-sm"
            >
              + Add delivery address
            </button>
          </>
        )}
      </div>

      {/* cart items */}
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li
            key={`${item.productId}_${idx}`}
            className="flex items-center justify-between gap-4 rounded border p-4"
          >
            {item.img && (
              <Image
                src={item.img}
                alt={item.name}
                width={80}
                height={80}
                className="rounded object-cover"
                unoptimized
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600 capitalize">
                {item.variant}
                {item.size ? ` · ${item.size}` : ''}
              </p>
              <p className="text-sm text-green-600">{money(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(idx, Math.max(1, item.qty - 1))}
                className="h-7 w-7 rounded border"
              >
                –
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => setQty(idx, item.qty + 1)}
                className="h-7 w-7 rounded border"
              >
                +
              </button>
            </div>
            <button
              onClick={() => remove(idx)}
              className="text-sm text-red-600 underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* price box */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">PRICE DETAILS</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              Price ({items.length} item{items.length > 1 ? 's' : ''})
            </span>
            <span>{money(itemTotal)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>{money(grandTotal)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full rounded bg-black py-3 text-white font-semibold hover:bg-gray-800"
      >
        Place Order
      </button>

      {/* ── inline modal ─────────────────────────────────── */}
{/* ── inline modal ─────────────────────────────────── */}
{showAddressModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#6483ff]">
        Choose Delivery Address
      </h2>

      {/* list of addresses */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded p-3 cursor-pointer transition ${
              selectedAddress?.id === addr.id
                ? 'ring-2 ring-[#6483ff] bg-[#6483ff]/5'
                : ''
            }`}
            onClick={() => {
              setSelectedAddress(addr);
              setShowAddressModal(false);
            }}
          >
            <p className="text-sm font-medium">
              {formatLabel(addr).split('\n')[0]}
            </p>
            <p className="text-xs text-gray-600 whitespace-pre-wrap">
              {formatLabel(addr).split('\n').slice(1).join('\n')}
            </p>
          </div>
        ))}
      </div>

      {/* footer: add address + cancel */}
      <div className="flex justify-between text-sm pt-2">
        <button
          onClick={() => {
            setShowAddressModal(false);
            router.push('/account/address');
          }}
          className="text-[#6483ff] underline"
        >
          + Add new address
        </button>

        <button
          onClick={() => setShowAddressModal(false)}
          className="text-gray-600 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* placing spinner */}
      {placing && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/20 border-t-black" />
        </div>
      )}
    </main>
  );
}
