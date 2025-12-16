import HeroBanner from "@/components/HeroBanner";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CategoryGrid from "@/components/CategoryGrid";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        take: 4, // show top 4 per category
      },
    },
  });

  return (
    <div className="main">
      <HeroBanner />
      <CategoryGrid />
      {categories.map((cat) =>
        cat.products.length ? (
          <section key={cat.id} className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{cat.name}</h2>
              <a
                href={`/category/${cat.slug}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View all →
              </a>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {cat.products.map((product) => {
                const images = Array.isArray(product.images)
                  ? (product.images as string[])
                  : [];
                const img = images.length > 0 ? images[0] : "/placeholder.jpg";

                return (
                  <a
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="border rounded-xl shadow hover:shadow-lg transition block"
                  >
                    <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden rounded-t-xl bg-white">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="(min-width:640px) 33vw, 100vw"
                        className="object-contain"
                        unoptimized={img === "/placeholder.jpg"}
                        priority
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h2 className="text-xl font-semibold truncate">
                        {product.name}
                      </h2>
                      <p className="text-gray-500 line-clamp-2">
                        {product.description || "No description"}
                      </p>
                      <p className="text-green-600 font-bold">
                        ₹{(product.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
