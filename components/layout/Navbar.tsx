"use client";

import Link from "next/link";
import { ShoppingCart, Store, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({
  isAuthenticated,
}: NavbarProps) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <Store size={24} />
          ShopNext
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Productos
          </Link>

          {isAuthenticated && (
            <Link
              href="/orders"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <User size={18} />
              Mis compras
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ShoppingCart size={18} />

            Carrito

            {totalItems > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <LogOut size={16} />
                Salir
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
