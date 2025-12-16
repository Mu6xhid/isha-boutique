import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  /* ───────── server‑side auth gate ───────── */
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/checkout");
  }

  /* session is guaranteed here */
  return <CheckoutClient />;
}
