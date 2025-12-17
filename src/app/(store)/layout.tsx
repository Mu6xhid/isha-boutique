// src/app/(store)/layout.tsx
export const dynamic = 'force-dynamic';

import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>
      <NavBar />
      {children}
      <Footer />
    </ClientLayout>
  );
}
