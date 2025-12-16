"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, Category } from "@prisma/client";
import RowActions from "./RowActions";

type ProductWithCategory = Product & { category: Category | null };

/* Thumbnail with fallback */
function Thumb({ images }: { images: unknown }) {
  const url =
    Array.isArray(images) &&
    typeof images[0] === "string" &&
    images[0].trim() !== ""
      ? images[0]
      : "/placeholder.jpg";

  return (
    <img
      src={url}
      alt="Product"
      className="h-12 w-12 object-cover rounded-md border"
    />
  );
}

/**
 * Build column defs — `categories` param is optional for future use
 */
export function adminProductColumns(
  _categories?: Category[]
): ColumnDef<ProductWithCategory>[] {
  return [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ getValue }) => <Thumb images={getValue()} />,
    },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `₹${(row.original.price / 100).toFixed(2)}`,
    },
    { accessorKey: "stock", header: "Stock" },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => row.original.category?.name ?? "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <RowActions id={row.original.id} />,
    },
  ];
}
