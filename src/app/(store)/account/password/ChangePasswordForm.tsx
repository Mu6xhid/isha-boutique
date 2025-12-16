"use client";

import { useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

function SubmitBtn() {
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

export default function ChangePasswordForm({
  onSubmit,
}: {
  onSubmit: (fd: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // display toast on success / error
  async function action(fd: FormData) {
    try {
      await onSubmit(fd);
      toast.success("Password updated");
      formRef.current?.reset();
    } catch (e: any) {
      toast.error(e.message || "Unable to change password");
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input
        type="password"
        name="current"
        placeholder="Current password"
        required
        className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-black"
      />
      <input
        type="password"
        name="next"
        placeholder="New password"
        required
        className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-black"
      />
      <input
        type="password"
        name="confirm"
        placeholder="Confirm new password"
        required
        className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-black"
      />

      <SubmitBtn />
    </form>
  );
}
