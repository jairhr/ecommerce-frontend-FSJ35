import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthToken } from "@/lib/auth";
import { getOrder } from "@/lib/api";

import CheckoutPayment from "@/components/checkout/CheckoutPayment";

interface CheckoutPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export const metadata = {
  title: "Checkout | ShopNext",
  description: "Completa tu compra",
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  const orderId = Number(params.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    redirect("/cart");
  }

  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  let order;

  try {
    order = await getOrder(String(orderId), token);
  } catch {
    redirect("/orders");
  }

  if (order.status !== "pending") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Esta orden no está disponible para pago
          </h1>

          <p className="mt-3 text-slate-600">
            El estado actual de la orden es:{" "}
            <strong>{order.status}</strong>
          </p>

          <Link
            href={`/orders/${order.id}`}
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Ver orden
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Checkout
        </h1>

        <p className="mt-2 text-slate-600">
          Completa los datos para realizar tu pago.
        </p>
      </div>

      <CheckoutPayment order={order} />
    </main>
  );
}