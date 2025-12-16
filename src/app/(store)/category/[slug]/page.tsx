import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FilterPanel from "@/components/FilterPanel";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  /* 1️⃣  category */
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) notFound();

  /* 2️⃣  URL filters */
  const minPrice = Number(searchParams.min) || 0;
  const maxPrice = Number(searchParams.max) || 20_000;
  const colors =
    typeof searchParams.color === "string"
      ? [searchParams.color]
      : Array.isArray(searchParams.color)
      ? searchParams.color
      : [];

  /* 3️⃣  fetch products */
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      price: {
        gte: minPrice * 100,
        lte: maxPrice * 100,
      },
      ...(colors.length ? { colors: { hasSome: colors } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  /* 4️⃣  build color facets */
  const variants = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: { colors: true },
  });
  const allColors = Array.from(
    new Set(variants.flatMap((v) => v.colors ?? [])),
  );

  return (
    <main className="flex flex-col md:flex-row gap-8 p-6">
      {/* sidebar filters */}
      <FilterPanel
        colors={allColors.map((c) => ({ label: c, value: c }))}
      />

      {/* product grid */}
      <section className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

        {products.length === 0 ? (
          <p>No products match the selected filters.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {products.map((p) => {
              const img =
                Array.isArray(p.images) && p.images.length
                  ? (p.images[0] as string)
                  : "/placeholder.jpg";

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="block border rounded-xl hover:shadow transition"
                >
                  <div className="relative w-full pt-[90%] bg-white rounded-t-xl">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-contain"
                      unoptimized={img === "/placeholder.jpg"}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h2 className="font-semibold truncate">{p.name}</h2>
                    <p className="text-green-600 font-bold">
                      ₹{(p.price / 100).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
