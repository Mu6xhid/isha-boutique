'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

/* -------------------------------------------------- */
/* helpers                                            */
type Category = { id: string; name: string; slug: string; cover: string | null };

const getPerView = (w: number) =>
  w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 768 ? 3 : w >= 640 ? 2 : 1;
/* -------------------------------------------------- */

export default function CategoryGrid() {
  /* ------------- state ------------- */
  const [cats, setCats] = useState<Category[]>([]);
  const [index, setIndex] = useState(0);             // current stop
  const [perView, setPerView] = useState(
    typeof window === 'undefined' ? 1 : getPerView(window.innerWidth),
  );
  const [stepPx, setStepPx] = useState(0);           // card width + gap

  const rowRef = useRef<HTMLDivElement>(null);

  /* ------------- data fetch ------------- */
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: Category[]) => setCats(data));
  }, []);

  /* ------------- measure & resize ------------- */
  const measure = () => {
    if (!rowRef.current || !rowRef.current.children.length) return;
    const card = rowRef.current.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(rowRef.current).gap || '0');
    setStepPx(card.offsetWidth + gap);
    setPerView(getPerView(window.innerWidth));
  };

  useEffect(() => {
    measure();                             // first paint
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cats.length]);

  /* ------------- page count & clamping ------------- */
  const pageCount = Math.max(1, cats.length - perView + 1);
  const safeIndex = Math.min(index, pageCount - 1);

  /* keep index in range when perView changes */
  useEffect(() => setIndex((i) => Math.min(i, pageCount - 1)), [pageCount]);

  /* ------------- auto‑advance ------------- */
  useEffect(() => {
    if (pageCount <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % pageCount),
      5000,
    );
    return () => clearInterval(id);
  }, [pageCount]);

  /* ------------- derived transform ------------- */
  const translate = -(safeIndex * stepPx);

  if (!cats.length) return null;

  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>

      {/* -------- slider row -------- */}
      <div className="relative overflow-hidden">
        <div
          ref={rowRef}
          className="flex gap-6 transition-transform duration-700"
          style={{ transform: `translateX(${translate}px)` }}
        >
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className={clsx(
                'flex-shrink-0 block border rounded-lg overflow-hidden hover:shadow-lg transition',
                'basis-full',      // <640
                'sm:basis-1/2',    // ≥640
                'md:basis-1/3',    // ≥768
                'lg:basis-1/4',    // ≥1024
                'xl:basis-1/5',    // ≥1280
              )}
            >
              <div className="relative w-full pt-[100%] bg-gray-50">
                <Image
                  src={c.cover || '/placeholder.jpg'}
                  alt={c.name}
                  fill
                  className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center font-semibold text-base">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* -------- dots -------- */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={clsx(
              'h-2 w-2 rounded-full',
              i === safeIndex ? 'bg-black' : 'bg-black/40',
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
