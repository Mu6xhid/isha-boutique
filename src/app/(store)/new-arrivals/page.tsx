import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/ProductGrid';

export const metadata = { title: 'New Arrivals' };

export default async function NewArrivalsPage() {
  const rawProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 24,
  });

  const products = rawProducts.map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
  }));

  return (
    <section className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">New Arrivals</h1>
      <ProductGrid products={products} />
    </section>
  );
}
