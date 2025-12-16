// src/app/admin/products/EditProductForm.tsx
"use client";

import ProductForm from "./ProductForm";

export default function EditProductForm({
  product,
  categories,
}: {
  product: {
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
  categories: { id: string; name: string }[];
}) {
  return <ProductForm categories={categories} initial={product} />;
}
