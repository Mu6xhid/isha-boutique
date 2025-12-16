"use client";

import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import RowActions from "./RowActions";

export const categoryColumns: ColumnDef<Category>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "slug", header: "Slug" },
  {
    accessorKey: "cover",
    header: "Cover",
    cell: ({ getValue }) => (getValue() ? "✅" : "—"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row.original} />,
  },
];
