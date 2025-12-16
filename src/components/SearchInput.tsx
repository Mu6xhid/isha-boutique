"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput({
  placeholder = "Search products…",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  /* 1️⃣  hydrate‑safe initial state */
  const [query, setQuery] = useState("");

  /* 2️⃣  after hydration, sync the ?q= param   */
  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
  }, [params]);

  /* 3️⃣  debounce navigation */
  useEffect(() => {
    const id = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [query, router]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
