"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, ShoppingCart, User2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/CartProvider";
import { usePathname, useRouter } from "next/navigation";
import SearchInput from "@/components/SearchInput";

/* ---------- helpers ---------- */
type Cat = { id: string; name: string; slug: string };

/* ─────────────────────────────────────────────────────────────
 * category dropdown (gap‑safe)
 * ──────────────────────────────────────────────────────────── */
function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* fetch once when first opened */
  useEffect(() => {
    if (!open || cats.length) return;
    (async () => {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (res.ok) setCats(await res.json());
    })();
  }, [open, cats.length]);

  /* gap‑forgiving enter/leave */
  const cancelClose = () => timerRef.current && clearTimeout(timerRef.current);
  const scheduleClose = () => {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <span className="cursor-pointer font-semibold hover:text-[#6483ff] whitespace-nowrap">
        SHOP BY CATEGORY
      </span>

      {open && cats.length > 0 && (
        <ul
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute left-0 top-full mt-0.5 w-56 max-h-80 overflow-y-auto
                     rounded-md border bg-white py-2 shadow-lg z-50"
        >
{cats.map((c) => (
  <li key={c.id || c.slug}>
    <Link href={`/category/${c.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-100">
      {c.name}
    </Link>
  </li>
))}

        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * main navbar
 * ──────────────────────────────────────────────────────────── */
export default function NavBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null; // hide on admin pages

  /* cart qty */
  const { items } = useCart();
  const cartQty = items.reduce((n, i) => n + i.qty, 0);

  /* auth */
  const { data: session, status } = useSession();
  const [firstName, setFirstName] = useState("Account");
  useEffect(() => {
    if (session?.user?.name) {
      setFirstName(session.user.name.split(" ")[0]);
    }
  }, [session?.user?.name]);

  /* user dropdown */
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const router = useRouter();

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      {/* logo (no drag / no context) */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={140}
        height={40}
        priority
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* centre navigation links */}
      <div className="hidden lg:flex items-center gap-10">
        <CategoryDropdown />
        <Link
  href="/new-arrivals"
  className="hover:text-[#6483ff] whitespace-nowrap"
>
  NEW ARRIVALS
</Link>


        <Link href="/best-sellers" className="hover:text-[#6483ff] whitespace-nowrap">
          MOST SELLING
        </Link>
        {/* add more static links here if needed */}
      </div>

      {/* right block */}
      <div className="flex items-center gap-6">
        {/* search (hidden < md) */}
        <SearchInput className="hidden md:block w-64" />
</div>
        <div className="flex items-center gap-6">
        <Link href="/" className="relative">
          <HomeIcon className="h-6 w-6" />
        </Link>

        {/* home icon (small screens only) */}
        <Link href="/" className="lg:hidden">
          <HomeIcon className="h-6 w-6" />
        </Link>

        {/* cart */}
        <Link href="/cart" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cartQty > 0 && (
            <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center
                             justify-center rounded-full bg-[#6483ff] px-1 text-[11px]
                             leading-none text-white">
              {cartQty}
            </span>
          )}
        </Link>

        {/* auth area */}
        {status === "loading" ? null : session?.user ? (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium hover:opacity-80"
            >
              <User2 className="h-5 w-5" />
              {firstName}
            </button>

            {open && (
              <ul className="absolute right-0 mt-2 w-56 divide-y rounded-md border
                             bg-white shadow-lg z-50 text-sm">
                {[
                  { href: "/account", txt: "Dashboard" },
                  { href: "/account/address", txt: "Delivery Address" },
                  { href: "/account/orders", txt: "My Orders" },
                  { href: "/account/details", txt: "Account Details" },
                  { href: "/account/password", txt: "Change Password" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {l.txt}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex gap-4 text-sm font-medium">
            <Link href="/login" className="hover:text-[#6483ff]">
              Sign&nbsp;in
            </Link>
            <Link href="/register" className="hover:text-[#6483ff]">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
