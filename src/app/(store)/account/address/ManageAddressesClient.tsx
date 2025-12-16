"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddressCard from "@/components/AddressCard";
import AddressForm, { Addr } from "@/components/AddressForm";
import { saveAddress, deleteAddress } from "./actions";   // ✅ unchanged

interface Props {
  initial: any[]; // Prisma address[]
}

export default function ManageAddressesClient({ initial }: Props) {
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [showForm,  setShowForm]    = useState(false);
  const router                      = useRouter();

  const editingAddress = initial.find(a => a.id === editingId);

  return (
    <main className="mx-auto max-w-xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Manage Addresses</h1>

      {/* list */}
      {initial.length > 0 && (
        <div className="space-y-4">
          {initial.map(a => (
            <AddressCard
              key={a.id}
              addr={{
                ...a,
                addrType: a.addrType as "HOME" | "WORK",
              }}
              onEdit={() => {
                setEditingId(a.id);
                setShowForm(true);
              }}
              onDelete={async () => {
                await deleteAddress(a.id);
                router.refresh();             // refresh list after delete
              }}
            />
          ))}
        </div>
      )}

      {/* “add address” button */}
      {!showForm && (
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="rounded border border-black px-4 py-2 text-sm font-semibold"
        >
          + Add Address
        </button>
      )}

      {/* form */}
      {showForm && (
        <div className="border rounded-md p-4">
          <h2 className="mb-4 text-sm font-semibold">
            {editingId ? "Edit Address" : "Add Address"}
          </h2>

          <AddressForm
            initial={editingAddress as Partial<Addr> | undefined}
            onSubmit={async fd => {
              if (editingId) fd.set("id", editingId);
              await saveAddress(fd);
              setShowForm(false);
              setEditingId(null);
              router.refresh();               // show updated list
            }}
          />

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            className="mt-3 text-xs underline"
          >
            Cancel
          </button>
        </div>
      )}
    </main>
  );
}
