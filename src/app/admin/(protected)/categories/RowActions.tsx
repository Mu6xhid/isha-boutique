"use client";

import { deleteCategory } from "./actions";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@prisma/client";

export default function RowActions({ row }: { row: Category }) {
  return (
    <div className="flex gap-2">
      {/* EDIT */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Category</DialogTitle>
          <CategoryForm initial={row} />
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Button
        size="sm"
        variant="destructive"
        onClick={async () => {
          if (confirm("Delete this category?")) await deleteCategory(row.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
}
