import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface Props {
  addr: {
    id: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postcode: string;
    addrType: "HOME" | "WORK";
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({ addr, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [showConfirm, setConfirm] = useState(false);

  /* -------------------------------------------------- */

  return (
    <div className="relative rounded-md border p-4">
      {/* ⋮ menu trigger */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="absolute right-3 top-3 text-gray-500"
      >
        <MoreVertical size={18} />
      </button>

      {/* dropdown menu */}
      {menuOpen && (
        <ul className="absolute right-3 top-9 w-28 rounded-md border bg-white shadow">
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Edit
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuOpen(false);
                setConfirm(true);          // open custom confirm
              }}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </li>
        </ul>
      )}

      {/* custom confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg space-y-4">
            <p className="text-sm text-gray-800">
              Are you sure you want to delete this address?
            </p>

            <div className="flex justify-end gap-3 text-sm">
              <button
                onClick={() => setConfirm(false)}
                className="rounded border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirm(false);
                  onDelete();                // finally delete
                }}
                className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* badge */}
      <span className="inline-block rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
        {addr.addrType}
      </span>

      {/* address body */}
      <div className="mt-2 font-semibold">
        {addr.name} <span className="ml-4">{addr.phone}</span>
      </div>

      <p className="mt-1 text-sm text-gray-800">
        {addr.line1}
        {addr.line2 && `, ${addr.line2}`},<br />
        {addr.city}, {addr.state}, India – <strong>{addr.postcode}</strong>
      </p>
    </div>
  );
}
