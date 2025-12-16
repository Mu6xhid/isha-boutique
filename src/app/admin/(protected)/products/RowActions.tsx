"use client";

import { useState, startTransition } from "react";
import { deleteProduct } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RowActions({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    startTransition(async () => {
      await deleteProduct(id);
    });
  }

  return (
    <div className="flex items-center gap-2">
<Link href={`/admin/products/edit?id=${id}`}>
  <Button size="sm" variant="outline">Edit</Button>
</Link>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        disabled={pending}
      >
        {pending ? "..." : "Delete"}
      </Button>
    </div>
  );
}
