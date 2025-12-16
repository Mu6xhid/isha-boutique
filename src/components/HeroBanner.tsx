"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type Slide = {
  img: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
};

const SLIDES: Slide[] = [
  {
    img: "/hero.jpg",
    title: "Launching soon!",
    subtitle: "Discover the latest arrivals and exclusive offers",
    cta: "Shop Now",
    href: "/",
  },
  {
    img: "/hero2.jpg",
    title: "Elegant Kurtas",
    subtitle: "Hand‑picked designs for every occasion",
    cta: "Shop Kurtas",
    href: "/category/kurtas",
  },
  {
    img: "/hero3.png",
    title: "Graceful Sarees",
    subtitle: "Tradition meets modern elegance",
    cta: "Shop Sarees",
    href: "/category/sarees",
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);

  /* auto‑advance */
  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[75vh] mb-10 overflow-hidden">
      {/* images */}
      {SLIDES.map((s, i) => (
        <Image
          key={s.img}
          src={s.img}
          alt=""
          fill
          priority={i === 0}
          className={clsx(
            "object-cover transition-opacity duration-1000",
            i === active ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {/* overlay text */}
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          className={clsx(
            "absolute inset-0 bg-black/20 flex flex-col justify-center px-4 md:px-20 text-white transition-opacity duration-700",
            i === active ? "opacity-100" : "opacity-0 pointer-events-none",
            i === 1 ? "items-start text-left" : "items-end text-right"
          )}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{s.title}</h1>
          <p className="text-lg md:text-xl mb-6">{s.subtitle}</p>
          <Link
            href={s.href}
            className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            {s.cta}
          </Link>
        </div>
      ))}

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={clsx(
              "h-2 w-2 rounded-full",
              i === active ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
