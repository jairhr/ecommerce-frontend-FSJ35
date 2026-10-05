"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const unavailable = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => addItem(product)}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      <ShoppingCart size={20} />

      {unavailable
        ? "Producto agotado"
        : "Agregar al carrito"}
    </button>
  );
}