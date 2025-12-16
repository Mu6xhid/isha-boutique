import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[] | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length)
    return <p className="text-center text-gray-500">No products found.</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
      {products.map((p) => {
        const src =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images[0]
            : '/placeholder.jpg';

        return (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="block border rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="relative w-full h-56 sm:h-64 md:h-72 bg-white rounded-t-xl overflow-hidden">
              <Image
                src={src}
                alt={p.name}
                fill
                sizes="(min-width:640px) 33vw, 100vw"
                className="object-contain"
                unoptimized={src === '/placeholder.jpg'}
                priority
              />
            </div>
            <div className="p-4 space-y-1">
              <h2 className="text-xl font-semibold truncate">{p.name}</h2>
              <p className="text-gray-500 line-clamp-2">
                {p.description || 'No description'}
              </p>
              <p className="text-green-600 font-bold">
                ₹{(p.price / 100).toFixed(2)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
