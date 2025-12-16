import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { categoryColumns } from "./columns";
import CategoryForm from "./CategoryForm";

export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle className="mb-4 text-lg font-medium">
              Add Category
            </DialogTitle>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={categoryColumns} data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
