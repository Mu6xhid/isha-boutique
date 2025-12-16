"use client";

import { useId, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { LocateFixed } from "lucide-react";

/* ---------- types ---------- */
export type Addr = {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  name: string;
  phone: string;
  altPhone?: string | null;
  addrType: "HOME" | "WORK";
  landmark?: string | null;
};

interface Props {
  initial?: Partial<Addr>;
  onSubmit: (formData: FormData) => void | Promise<void>;
}

/* ---------- reusable input ---------- */
/* ---------- reusable input ---------- */
function Field({
  name,
  label,
  placeholder = "",
  defaultValue,
  required = true,
}: {
  name: keyof Addr | string;
  label: string;          // still pass the label text
  placeholder?: string;   // not needed anymore, but kept for compatibility
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <input
        id={useId()}                                // keeps unique id
        name={name as string}
        required={required}
        defaultValue={defaultValue ?? undefined}
        placeholder={label}                         // show label text inside field
        className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-black"
      />
    </div>
  );
}


/* ---------- submit button ---------- */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/* ---------- main form ---------- */
export default function AddressForm({ initial, onSubmit }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  /* 🔄  reset form after successful submit */
  useEffect(() => {
    if (!pending) formRef.current?.reset();
  }, [pending]);

  /* helper to programmatically set a field value */
  const set = (name: string, value: string | undefined) => {
    const el = formRef.current?.elements.namedItem(name) as
      | HTMLInputElement
      | null;
    if (el && value) el.value = value;
  };

  /* auto‑fill from GPS */
  async function autofillFromGPS() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
          {
            headers: {
              "User-Agent": "isha-boutique/1.0 (support@yourdomain.com)",
            },
          }
        );
        const data = await resp.json();
        const a = data.address ?? {};

        set("line1", `${a.road ?? ""} ${a.neighbourhood ?? ""}`.trim());
        set("line2", a.suburb ?? a.hamlet ?? undefined);
        set("city", a.city || a.town || a.village || undefined);
        set("state", a.state ?? undefined);
        set("postcode", a.postcode ?? undefined);
        set("country", a.country ?? "India");
      } catch (err) {
        console.error(err);
        alert("Could not fetch address automatically.");
      }
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-6">

      {/* current‑location button */}
      <button
        type="button"
        onClick={autofillFromGPS}
        className="flex w-full items-center justify-center gap-2 rounded bg-black px-4 py-2 text-sm font-medium text-white"
      >
        <LocateFixed className="h-4 w-4" />
        Use my current location
      </button>

      {/* name / phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Name"
          placeholder="Name"
          defaultValue={initial?.name ?? undefined}
        />
        <Field
          name="phone"
          label="10‑digit mobile number"
          placeholder="10‑digit mobile number"
          defaultValue={initial?.phone ?? undefined}
        />
      </div>

      {/* pincode / locality */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="postcode"
          label="Pincode"
          placeholder="6‑digit pincode"
          defaultValue={initial?.postcode ?? undefined}
        />
        <Field
          name="line2"
          label="Locality"
          defaultValue={initial?.line2 ?? undefined}
          required={false}
        />
      </div>

      {/* address line1 */}
      <Field
        name="line1"
        label="Address (Area and Street)"
        placeholder="House, Street, Area"
        defaultValue={initial?.line1 ?? undefined}
      />

      {/* city / state */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="city"
          label="City / District / Town"
          defaultValue={initial?.city ?? undefined}
        />

        <select
  id="state-select"
  name="state"
  defaultValue={initial?.state ?? ""}
  required
  className="rounded border px-3 py-2 text-sm outline-none focus:border-black w-full"
>
  <option value="" disabled>
    Select State
  </option>
  <option>Kerala</option>
  <option>Tamil Nadu</option>
  <option>Karnataka</option>
  <option>Maharashtra</option>
  <option>Delhi</option>
</select>

      </div>

      {/* landmark / alt phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="landmark"
          label="Landmark (Optional)"
          defaultValue={initial?.landmark ?? undefined}
          required={false}
        />
        <Field
          name="altPhone"
          label="Alternate Phone (Optional)"
          defaultValue={initial?.altPhone ?? undefined}
          required={false}
        />
      </div>

      {/* address type */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-gray-700">Address Type</legend>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="addrType"
              value="HOME"
              defaultChecked={initial?.addrType !== "WORK"}
              className="accent-black"
            />
            Home
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="addrType"
              value="WORK"
              defaultChecked={initial?.addrType === "WORK"}
              className="accent-black"
            />
            Work
          </label>
        </div>
      </fieldset>

      {/* buttons */}
      <div className="flex items-center gap-4">
        <SubmitButton />
        <button
          type="reset"
          className="rounded border border-black px-4 py-2 text-sm font-semibold"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
