import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProductForm from "../EditProductForm"; // one‑level up

export default async function EditProductPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  // URL example → /admin/products/edit?id=abc123
  const id = searchParams.id;
  if (!id) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return notFound();

  /* ───── ensure JSON fields are arrays of strings ───── */
  const productForForm = {
    ...product,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    colors: Array.isArray(product.colors) ? (product.colors as string[]) : [],
    sizes: Array.isArray(product.sizes) ? (product.sizes as string[]) : [],
  };

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <EditProductForm product={productForForm} categories={categories} />
    </main>
  );
}
