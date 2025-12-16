// SERVER COMPONENT
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ManageAddressesClient from "./ManageAddressesClient";

export const metadata = { title: "Manage Addresses" };

export default async function ManageAddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/address");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return <ManageAddressesClient initial={addresses} />;
}