import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { getAuthToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ShopNext | Ecommerce",
  description: "Tienda online desarrollada con Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getAuthToken();
  const isAuthenticated = Boolean(token);

  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar isAuthenticated={isAuthenticated} />

          <main>{children}</main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} ShopNext. Todos los derechos
              reservados.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
