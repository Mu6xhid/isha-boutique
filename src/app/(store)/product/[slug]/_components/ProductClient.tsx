"use client";

import { useState, useEffect } from "react";
import Gallery from "./gallery";
import BuyPanel from "./buy‑panel";

type Variant = { url: string; color: string };

export default function ProductClient({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    inStock: boolean;
    category: string;
  };
}) {
  const variants: Variant[] = product.images.map((url, i) => ({
    url,
    color: product.colors[i] ?? `Variant ${i + 1}`,
  }));

  const [selected, setSelected] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by delaying client-only render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-10">
      {/* Gallery */}
      <Gallery image={variants[selected].url} />

      {/* Right panel */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-green-600 text-2xl">
          ₹{(product.price / 100).toFixed(2)}
        </p>

        <BuyPanel
          productId={product.id}
          name={product.name}
          price={product.price}
          variants={variants}
          sizes={product.sizes}
          inStock={product.inStock}
          selected={selected}
          onSelect={setSelected}
          description={product.description}
        />
      </div>

      {/* Category */}
      <p className="col-span-full text-sm text-muted-foreground mt-4">
        Category: {product.category}
      </p>
    </main>
  );
}
