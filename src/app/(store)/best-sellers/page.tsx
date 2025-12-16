import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/ProductGrid';

const normalizeImages = (img: unknown): string[] =>
  Array.isArray(img) ? (img as string[]) : [];

export const metadata = { title: 'Most Selling Products' };

export default async function BestSellersPage() {
  const raw = await prisma.product.findMany({
    orderBy: { soldCount: 'desc' },
    take: 24,
  });

  const products = raw.map((p) => ({
    ...p,
    images: normalizeImages(p.images),
  }));

  return (
    <section className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Most Selling</h1>
      <ProductGrid products={products} />
    </section>
  );
}
