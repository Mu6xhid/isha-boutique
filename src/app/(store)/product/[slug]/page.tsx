import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./_components/ProductClient";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return notFound();

  return (
    <ProductClient
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images as string[],
        colors: product.colors as string[],
        sizes: product.sizes as string[],
        inStock: product.stock > 0,
        category: product.category?.name ?? "—",
      }}
    />
  );
}
