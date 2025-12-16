"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { adminProductColumns } from "./columns";

export default function AdminProductTable({
  products,
  categories,
}: {
  products: any[];
  categories: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Add Product</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogTitle className="text-lg font-medium mb-4">
              Add Product
            </DialogTitle>

            {/* Pass onSaved callback to close */}
            <ProductForm
              categories={categories}
              onSaved={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        <DataTable columns={adminProductColumns(categories)} data={products} />
      </div>
    </>
  );
}
