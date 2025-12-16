"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartProvider";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </SessionProvider>
  );
}
