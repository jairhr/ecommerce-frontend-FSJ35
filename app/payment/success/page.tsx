import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { getOrder } from "@/lib/api";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export const metadata = {
  title: "Pago exitoso | ShopNext",
  description: "Confirmación de tu compra",
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  const orderId = Number(params.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">
            Orden no válida
          </h1>

          <p className="mt-3 text-red-700">
            No pudimos identificar la orden asociada al pago.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const token = await getAuthToken();

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Pago procesado
          </h1>

          <p className="mt-3 text-slate-600">
            Tu pago fue enviado correctamente.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  let order;

  try {
    order = await getOrder(String(orderId), token);
  } catch {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Pago procesado
          </h1>

          <p className="mt-3 text-slate-600">
            Tu pago fue enviado correctamente.
            La confirmación final puede tardar unos
            segundos.
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Ver mis compras
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          {isPaid
            ? "¡Pago confirmado!"
            : "¡Pago enviado!"}
        </h1>

        <p className="mt-3 text-slate-600">
          {isPaid
            ? "Tu compra fue procesada correctamente."
            : "Tu pago fue recibido y estamos esperando la confirmación final."}
        </p>

        <div className="mt-8 rounded-lg bg-slate-50 p-5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-600">
              Orden
            </span>

            <span className="font-semibold text-slate-900">
              #{order.id}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-slate-600">
              Estado
            </span>

            <span className="font-semibold capitalize text-slate-900">
              {order.status}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-slate-600">
              Total
            </span>

            <span className="font-bold text-slate-900">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/orders/${order.id}`}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Ver mi orden
          </Link>

          <Link
            href="/orders"
            className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mis compras
          </Link>
        </div>
      </div>
    </main>
  );
}