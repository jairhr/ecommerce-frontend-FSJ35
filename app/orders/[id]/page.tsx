import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { redirect } from "next/navigation";

import { getAuthToken } from "@/lib/auth";
import { getOrder } from "@/lib/api";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return {
    title: `Orden #${id} | ShopNext`,
    description: `Detalle de la orden #${id}`,
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    redirect("/orders");
  }

  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  const order = await getOrder(String(orderId), token);

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagada",
    cancelled: "Cancelada",
  };

  const statusClass: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis compras
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Detalle de compra
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Orden #{order.id}
          </h1>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
            statusClass[order.status] ??
            "bg-slate-100 text-slate-700"
          }`}
        >
          {statusLabel[order.status] ??
            order.status}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Productos */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Package className="h-5 w-5" />
              Productos
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.product.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.quantity} × $
                    {Number(item.unit_price).toFixed(2)}
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  $
                  {Number(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Resumen */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Resumen
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-slate-600">
              <span>Productos</span>

              <span>
                {order.items.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  $
                  {Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {order.status === "pending" && (
            <Link
              href={`/checkout?orderId=${order.id}`}
              className="mt-6 block w-full rounded-lg bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700"
            >
              Continuar con el pago
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}