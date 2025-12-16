import { prisma } from "@/lib/prisma";
import AdminProductTable from "./product-table";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 p-4">
      <AdminProductTable products={products} categories={categories} />
    </div>
  );
}
