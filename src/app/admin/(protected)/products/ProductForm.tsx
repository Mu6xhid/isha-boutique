"use client";

import { useEffect, useRef, useState } from "react";
import { addProduct, updateProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Variant = {
  color: string;
  file?: File;
  existingUrl?: string;
};

interface Props {
  categories: { id: string; name: string }[];
  initial?: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    stock: number;
    sizes: string[];
    colors: string[];
    images: string[];
    categoryId: string;
  };
  onSaved?: () => void;
}

export default function ProductForm({ categories, initial }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [variants, setVariants] = useState<Variant[]>(
    initial
      ? initial.colors.map((c, i) => ({
          color: c,
          existingUrl: initial.images[i] ?? undefined,
        }))
      : [{ color: "" }]
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initial || !formRef.current) return;
    const f = formRef.current;
    (f.elements.namedItem("name") as HTMLInputElement).value = initial.name;
    (f.elements.namedItem("price") as HTMLInputElement).value = (
      initial.price / 100
    ).toString();
    (f.elements.namedItem("description") as HTMLTextAreaElement).value =
      initial.description ?? "";
    (f.elements.namedItem("stock") as HTMLInputElement).value =
      initial.stock.toString();
    (f.elements.namedItem("sizes") as HTMLInputElement).value =
      initial.sizes.join(",");
    (f.elements.namedItem("categoryId") as HTMLSelectElement).value =
      initial.categoryId;
  }, [initial]);

  function addVariant() {
    setVariants((v) => [...v, { color: "" }]);
  }

  function removeVariant(idx: number) {
    setVariants((v) => v.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const sizes = fd.get("sizes")?.toString().split(",").filter(Boolean) ?? [];
    fd.set("sizes", JSON.stringify(sizes));


    const colors: string[] = [];
    const images: string[] = [];

    for (let i = 0; i < variants.length; i++) {
      const color = fd.get(`variant-color-${i}`)?.toString().trim();
      const file = fd.get(`variant-file-${i}`) as File;

      if (!color) continue;
      colors.push(color);

      if (file && file.size > 0) {
        const uploadForm = new FormData();
        uploadForm.set("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (!res.ok) {
          const { error } = await res.json();
          setError(error || "Upload failed");
          setSubmitting(false);
          return;
        }

        const { url } = await res.json();
        images.push(url);
      } else if (typeof variants[i]?.existingUrl === "string") {
  if (variants[i]?.existingUrl) {
  images.push(variants[i].existingUrl as string);
}

}

    }

    fd.set("colors", JSON.stringify(colors));
    fd.set("images", JSON.stringify(images));

    try {
      if (initial) {
        await updateProduct(initial.id, fd);
      } else {
        await addProduct(fd);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save product");
      setSubmitting(false);
      return;
    }
  }

  return (
    <form
      ref={formRef}
      className="grid grid-cols-2 gap-4"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <TextInput id="name" name="name" label="Name" required />
      <TextInput id="price" name="price" type="number" label="Price (₹)" required />
      <TextInput id="stock" name="stock" type="number" label="Stock" />
      <TextInput id="sizes" name="sizes" label="Sizes (comma)" />

      <div className="col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="col-span-2 space-y-2">
        <h3 className="font-medium">Variants (color + image)</h3>
        {variants.map((v, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              name={`variant-color-${idx}`}
              defaultValue={v.color}
              placeholder="Color"
              className="flex-1"
            />
            {v.existingUrl && (
              <img
                src={v.existingUrl}
                alt="existing"
                className="h-12 w-12 object-cover rounded"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              name={`variant-file-${idx}`}
              className="flex-[2]"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeVariant(idx)}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addVariant}>
          + Add variant
        </Button>
      </div>

      <div className="col-span-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          className="border px-2 py-1 w-full rounded"
          required
        >
          <option value="">Choose category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 col-span-2">{error}</p>}

      <Button disabled={submitting} className="col-span-2">
        {submitting ? "Saving…" : initial ? "Update Product" : "Save Product"}
      </Button>
    </form>
  );
}

function TextInput({
  id,
  name,
  label,
  type = "text",
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} required={required} />
    </div>
  );
}
