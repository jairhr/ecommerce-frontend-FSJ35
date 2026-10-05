"use client";

import { useState } from "react";

import type { Order } from "@/lib/types";
import { createPaymentIntent } from "@/actions/payments";
import StripeCheckout from "./StripeCheckout";

interface CheckoutPaymentProps {
  order: Order;
}

export default function CheckoutPayment({
  order,
}: CheckoutPaymentProps) {
  const [clientSecret, setClientSecret] =
    useState<string | null>(null);

  const [isPreparing, setIsPreparing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handlePreparePayment() {
    setIsPreparing(true);
    setError("");

    const result =
      await createPaymentIntent(order.id);

    if (!result.success || !result.data) {
      setError(result.message);
      setIsPreparing(false);
      return;
    }

    setClientSecret(
      result.data.client_secret
    );

    setIsPreparing(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Pago */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Método de pago
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Tu información de pago es procesada de
          forma segura por Stripe.
        </p>

        {!clientSecret ? (
          <div className="mt-8">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePreparePayment}
              disabled={isPreparing}
              className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPreparing
                ? "Preparando pago..."
                : "Continuar al pago"}
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <StripeCheckout
              clientSecret={clientSecret}
              orderId={order.id}
            />
          </div>
        )}
      </section>

      {/* Resumen */}
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Resumen de orden
        </h2>

        <div className="mt-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {item.product.name}
                </p>

                <p className="text-slate-500">
                  {item.quantity} × $
                  {Number(item.unit_price).toFixed(2)}
                </p>
              </div>

              <span className="font-semibold text-slate-900">
                $
                {Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-xl font-bold">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}