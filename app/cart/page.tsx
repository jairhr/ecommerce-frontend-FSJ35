"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { createOrder } from "@/actions/orders";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const router = useRouter();

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrder = async () => {
    if (!items.length) {
      return;
    }

    setError("");
    setIsCreatingOrder(true);

    const result = await createOrder(
      items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    );

    if (!result.success || !result.data) {
      setError(result.message);
      setIsCreatingOrder(false);
      return;
    }

    clearCart();

    router.push(`/checkout?orderId=${result.data.id}`);
  };

  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-10 w-10 text-slate-500" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-slate-600">
            Agrega algunos productos para comenzar tu compra.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Ver productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Mi carrito
        </h1>

        <p className="mt-2 text-slate-600">
          {totalItems}{" "}
          {totalItems === 1 ? "producto" : "productos"} en tu carrito
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Productos */}
        <section className="space-y-4">
          {items.map((item) => {
            const subtotal = item.product.price * item.quantity;

            return (
              <article
                key={item.product.id}
                className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-slate-600"
                  >
                    {item.product.name}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    ${item.product.price.toFixed(2)} por unidad
                  </p>
                </div>

                {/* Cantidad */}
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-10 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity + 1,
                      )
                    }
                    disabled={item.quantity >= item.product.stock}
                    className="p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="min-w-24 text-right">
                  <p className="font-bold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="self-end rounded-lg p-2 text-red-500 hover:bg-red-50 sm:self-auto"
                  aria-label={`Eliminar ${item.product.name}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </article>
            );
          })}
        </section>

        {/* Resumen */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Resumen de compra
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-slate-600">
              <span>Productos</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
            className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingOrder
              ? "Creando orden..."
              : "Continuar con la compra"}
          </button>

          <button
            type="button"
            onClick={clearCart}
            disabled={isCreatingOrder}
            className="mt-3 w-full rounded-lg px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Vaciar carrito
          </button>
        </aside>
      </div>
    </main>
  );
}