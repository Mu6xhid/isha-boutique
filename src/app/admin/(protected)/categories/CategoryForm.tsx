"use client";

import { useRef, useState } from "react";
import { createCategory, updateCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoryForm({
  initial,
}: {
  initial?: { id: string; name: string; slug: string; cover: string | null };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [coverUrl, setCoverUrl] = useState(initial?.cover ?? "");
  const [uploading, setUploading] = useState(false);

  /* ---- file upload handler ---- */
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setCoverUrl(data.url);
    setUploading(false);
  }

  /* ---- submit (server action) ---- */
  async function handleSubmit(fd: FormData) {
    fd.set("cover", coverUrl); // inject the uploaded URL
    if (initial) {
      await updateCategory(initial.id, fd);
    } else {
      await createCategory(fd);
      formRef.current?.reset();
      setCoverUrl("");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-3">
      {/* name */}
      <div>
        <Label>Name</Label>
        <Input
          name="name"
          required
          defaultValue={initial?.name}
          onChange={(e) => {
            const slugField = formRef.current?.elements.namedItem("slug") as
              | HTMLInputElement
              | null;
            if (!initial && slugField) {
              slugField.value = e.target.value
                .toLowerCase()
                .replace(/\s+/g, "-");
            }
          }}
        />
      </div>

      {/* slug */}
      <div>
        <Label>Slug</Label>
        <Input name="slug" required defaultValue={initial?.slug} />
      </div>

      {/* cover upload */}
      <div className="space-y-1">
        <Label>Cover image</Label>
        {coverUrl && (
          <img
            src={coverUrl}
            alt="cover preview"
            className="h-24 w-full object-cover rounded border"
          />
        )}
        <Input type="file" accept="image/*" onChange={handleFile} />
        <p className="text-xs text-gray-500">
          {uploading ? "Uploading…" : "Choose an image (JPEG/PNG)"}
        </p>
      </div>

      {/* hidden cover field so server action receives it */}
      <input type="hidden" name="cover" value={coverUrl} />

      <Button disabled={uploading} className="mt-2">
        {initial ? "Update Category" : "Add Category"}
      </Button>
    </form>
  );
}
