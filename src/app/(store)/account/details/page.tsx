// no "use client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = { title: "Account Details" };

export default async function AccountDetailsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/details");

  return (
    <main className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Account Details</h1>

      <section className="rounded border p-4 text-sm text-gray-700 space-y-1">
        <p>
          <strong>Name:</strong>{" "}
          {session.user.name ? session.user.name : "—"}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {session.user.email ? session.user.email : "—"}
        </p>
      </section>
    </main>
  );
}
