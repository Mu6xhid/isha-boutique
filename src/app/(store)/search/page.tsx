import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FilterPanel from "@/components/FilterPanel";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────*/
type SearchParams = {
  q?: string;
  min?: string;
  max?: string;
  color?: string | string[];
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /* ---------- parse query params ---------- */
  const q       = searchParams.q?.trim() ?? "";
  const min     = Number(searchParams.min ?? 0) * 100;          // paise
  const max     = Number(searchParams.max ?? 0) * 100 || null;
  const colors  = Array.isArray(searchParams.color)
    ? searchParams.color
    : searchParams.color
    ? [searchParams.color]
    : [];

  /* ---------- facets (distinct colors) ------ */
  const colorFacetRows = await prisma.product.findMany({
    select: { colors: true },
  });
  const colorSet = new Set<string>();
  colorFacetRows.forEach((r) =>
    r.colors.forEach((c) => colorSet.add(c)),
  );
  const colorFacets = [...colorSet].sort().map((c) => ({
    label: c.charAt(0).toUpperCase() + c.slice(1).toLowerCase(),
    value: c,
  }));

  /* ---------- build Prisma where ----------- */
  const where: any = {};
  if (q)
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];

  if (colors.length) where.colors = { hasSome: colors };

  if (searchParams.min || searchParams.max) {
    where.price = {};
    if (searchParams.min) where.price.gte = min;
    if (searchParams.max) where.price.lte = max;
  }

  /* ---------- fetch products ---------------- */
  const products =
    q || colors.length || searchParams.min || searchParams.max
      ? await prisma.product.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: { category: true },
        })
      : [];

  /* ---------- UI ---------------------------- */
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Filter sidebar ── */}
        <FilterPanel colors={colorFacets} />

        {/* ── Result grid ── */}
        <div className="flex-1 space-y-6">
          {q === "" && colors.length === 0 && !searchParams.min && !searchParams.max ? (
            <p className="text-center text-gray-500">
              Type something or use filters to search.
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">
              No results found.
            </p>
          ) : (
            <>
              <h1 className="text-xl font-semibold">
                {products.length} result{products.length > 1 && "s"}
                {q && <> for “{q}”</>}
              </h1>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                {products.map((p) => {
                  const img =
                    Array.isArray(p.images) && p.images.length
                      ? (p.images[0] as string)
                      : "/placeholder.jpg";

                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="block border rounded hover:shadow"
                    >
                      <div className="relative w-full pt-[85%] bg-white rounded-t">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-contain"
                          unoptimized={img === "/placeholder.jpg"}
                        />
                      </div>
                      <div className="p-2 space-y-0.5">
                        <h2 className="font-medium truncate">{p.name}</h2>
                        <p className="text-sm text-gray-500 truncate">
                          {p.category?.name}
                        </p>
                        <p className="text-green-600 font-semibold">
                          ₹{(p.price / 100).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
