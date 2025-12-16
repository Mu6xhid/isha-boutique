"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "@/components/CartProvider";

type Variant = { url: string; color: string };

interface BuyPanelProps {
  productId: string;
  name: string;
  price: number;
  variants: Variant[];
  sizes: string[];
  inStock: boolean;
  selected: number;
  onSelect: (i: number) => void;
  description: string | null;
}

export default function BuyPanel({
  productId,
  name,
  price,
  variants,
  sizes,
  inStock,
  selected,
  onSelect,
  description,
}: BuyPanelProps) {
  const router = useRouter();
  const { add } = useCart();

  const [selSize, setSelSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // avoid hydration mismatch by delaying render
  useEffect(() => {
    setIsMounted(true);
    if (sizes.length > 0) {
      const defaultSize = sizes[0]?.replace(/[[\]"]+/g, "");
      setSelSize(defaultSize);
    }
  }, [sizes]);

  const normalise = (s: string) => s.replace(/[[\]"]+/g, "");

  const addItem = () => {
    add({
      productId,
      name,
      price,
      img: variants[selected].url,
      variant: variants[selected].color,
      size: selSize,
      qty,
    });

    toast.success("✔️ Added to cart");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Variants */}
      <div className="space-y-2">
        <p className="font-medium">Variants</p>
        <div className="flex gap-3 flex-wrap">
          {variants.map((v, i) => (
            <button
              key={v.color + i}
              onClick={() => onSelect(i)}
              className={`rounded-lg border-2 ${
                i === selected ? "border-black" : "border-transparent"
              }`}
            >
              <img
                src={v.url}
                alt={v.color}
                className="w-16 h-16 object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Sizes</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((raw) => {
              const size = normalise(raw);
              return (
                <button
                  key={size}
                  onClick={() => setSelSize(size)}
                  className={`px-3 py-1 rounded border text-sm ${
                    selSize === size
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <p className="font-medium">Qty</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 border rounded"
          >
            –
          </button>
          <span className="min-w-[24px] text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 border rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          disabled={!inStock}
          onClick={addItem}
          className={`w-full py-3 rounded text-white ${
            inStock
              ? "bg-black hover:bg-neutral-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add to cart
        </button>

        <button
          disabled={!inStock}
          onClick={() => {
            addItem();
            router.push("/cart");
          }}
          className={`w-full py-3 rounded border text-black ${
            inStock
              ? "border-black hover:bg-neutral-100"
              : "border-gray-300 cursor-not-allowed opacity-50"
          }`}
        >
          Buy now
        </button>
      </div>

      {/* Description */}
      {description ? (
        <p className="whitespace-pre-line text-gray-700">{description}</p>
      ) : (
        <p className="italic text-gray-400">No description available.</p>
      )}
    </div>
  );
}
