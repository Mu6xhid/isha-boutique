"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Facet = { label: string; value: string };

const SLIDER_MAX = 20000;
const SLIDER_STEP = 100;

const fmt = (n: number) =>
  n === 0
    ? "₹0"
    : n === SLIDER_MAX
    ? `₹${SLIDER_MAX.toLocaleString("en-IN")}+`
    : `₹${n.toLocaleString("en-IN")}`;

export default function FilterPanel({ colors }: { colors: Facet[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const timer = useRef<NodeJS.Timeout | null>(null);
  const isFirst = useRef(true);

  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<[number, number]>([
    Number(params.get("min") ?? 0),
    Number(params.get("max") ?? SLIDER_MAX),
  ]);
  const [selColors, setColors] = useState<string[]>(params.getAll("color"));

  // Always call hooks before conditionals
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (timer.current !== null) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const qp = new URLSearchParams();
      if (params.get("q")) qp.set("q", params.get("q")!);

      if (range[0]) qp.set("min", String(range[0]));
      if (range[1]) qp.set("max", String(range[1]));
      selColors.forEach((c) => qp.append("color", c));

      router.push(`${location.pathname}?${qp.toString()}`, { scroll: false });
    }, 300);

    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [range, selColors, mounted, params, router]);

  const reset = () => {
    setRange([0, SLIDER_MAX]);
    setColors([]);
    router.push(location.pathname, { scroll: false });
  };

  if (!mounted) return null; // ✅ safe to return null after all hooks

  return (
    <aside className="border rounded p-5 space-y-6 w-full md:w-64">
      {/* Price Slider */}
      <div className="space-y-4">
        <h3 className="font-medium">Price (₹)</h3>
        <Slider
          min={0}
          max={SLIDER_MAX}
          step={SLIDER_STEP}
          value={range}
          onValueChange={(v) => setRange([v[0], v[1]])}
        />
        <p className="text-sm text-gray-600">
          {fmt(range[0])} – {fmt(range[1])}
        </p>
      </div>

      {/* Color checkboxes */}
      <div className="space-y-2">
        <h3 className="font-medium">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <label key={c.value} className="flex items-center gap-1 text-sm">
              <Checkbox
                checked={selColors.includes(c.value)}
                onCheckedChange={(ck) =>
                  setColors((prev) =>
                    ck
                      ? [...prev, c.value]
                      : prev.filter((x) => x !== c.value)
                  )
                }
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <Button size="sm" variant="outline" className="w-full" onClick={reset}>
        Reset
      </Button>
    </aside>
  );
}
