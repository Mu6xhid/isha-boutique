/* -------------------------------------------------------------
 * Global store footer – dark, 4‑column, responsive
 * ------------------------------------------------------------*/
"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-neutral-900 text-neutral-100 text-sm">
      {/* top grid  */}
      <div className="mx-auto grid max-w-7xl gap-8 p-8 sm:grid-cols-2 md:grid-cols-4">
        {/* ─────────────── column 1 ─────────────── */}
        <div>
          <h3 className="mb-4 text-base font-semibold">CUSTOMER SERVICES</h3>
          <ul className="space-y-2">
            <li><Link href="/account/orders"   className="hover:underline">Orders</Link></li>
            <li><Link href="/footer/contact"          className="hover:underline">Contact us</Link></li>
            <li><Link href="/footer/shipping-policy"  className="hover:underline">Shipping policy</Link></li>
            <li><Link href="/footer/refunds"          className="hover:underline">Refund & Cancellations</Link></li>
          </ul>
        </div>

        {/* ─────────────── column 2 ─────────────── */}
        <div>
          <h3 className="mb-4 text-base font-semibold">QUICK LINKS</h3>
          <ul className="space-y-2">
            <li><Link href="/footer/about"            className="hover:underline">About us</Link></li>
            <li><Link href="/footer/privacy-policy"   className="hover:underline">Privacy policy</Link></li>
            <li><Link href="/footer/terms"            className="hover:underline">Terms & Condition</Link></li>
            <li><Link href="/account"          className="hover:underline">My Account</Link></li>
          </ul>
        </div>

        {/* ─────────────── column 3 ─────────────── */}
        <div>
          <h3 className="mb-4 text-base font-semibold">TOP CATEGORIES</h3>
          <ul className="space-y-2 capitalize">
            <li><Link href="/category/kurtas" className="hover:underline">Kurtas</Link></li>
            <li><Link href="/category/tops"       className="hover:underline">Tops</Link></li>
            <li><Link href="/category/sarees" className="hover:underline">Sarees</Link></li>
            <li><Link href="/category/churidhar"   className="hover:underline">Churidhar</Link></li>
          </ul>
        </div>

        {/* ─────────────── column 4 ─────────────── */}
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">Email us</p>
            <Link href="mailto:info@ishaboutique.in" className="hover:underline">info@ishaboutique.in</Link>
          </div>

          <div>
            <p className="font-medium mb-1">Call us</p>
            <Link href="tel:+919946225678" className="hover:underline">+919946225678</Link>
          </div>

          {/* social icons */}
          <div className="flex gap-4 pt-2">
            <Link href="https://facebook.com"  aria-label="Facebook"><Facebook  className="size-5 hover:text-blue-400" /></Link>
            <Link href="https://instagram.com" aria-label="Instagram"><Instagram className="size-5 hover:text-pink-400" /></Link>
            <Link href="https://youtube.com"   aria-label="YouTube"><Youtube   className="size-5 hover:text-red-500"  /></Link>
          </div>
        </div>
      </div>

      {/* bottom strip */}
      <div className="border-t border-neutral-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} Isha Boutique. All rights reserved.
      </div>
    </footer>
  );
}
