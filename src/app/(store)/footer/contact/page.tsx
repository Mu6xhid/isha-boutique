/* ------------------------------------------------------------------
   Contact Us – info-only layout with brand‑blue accents (#6483ff)
------------------------------------------------------------------- */
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <main>
      {/* ── hero banner ─────────────────────────────────────────── */}
      <section className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src="/hero3.png"      // Replace with your own banner
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6483ff]/70 to-[#6483ff]/20" />
        <h1 className="relative z-10 flex h-full items-center justify-center text-3xl md:text-5xl font-bold text-white">
          Contact Us
        </h1>
      </section>

      {/* ── contact info section ──────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8 rounded-lg border bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#6483ff]">
            Get in touch
          </h2>

          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-[#6483ff]" />
            <a
              href="mailto:info@ishaboutique.in"
              className="hover:underline"
            >
              info@ishaboutique.in
            </a>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-[#6483ff]" />
            <a href="tel:+919946225678" className="hover:underline">
              +91 99462 25678
            </a>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-[#6483ff]" />
            <address className="not-italic">
              Mathilakam<br />
              Thrissur, Kerala 680001<br />
              India
            </address>
          </div>
        </div>

        {/* ── map ─────────────────────────────────────────────── */}
        <div className="mt-8 rounded-lg border overflow-hidden">
          <iframe
            title="Isha Boutique map"
            src="https://maps.google.com/maps?q=Mathilakam%20Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
