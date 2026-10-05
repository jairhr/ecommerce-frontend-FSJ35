import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { redirect } from "next/navigation";

import { getAuthToken } from "@/lib/auth";
import { getOrders } from "@/lib/api";

export const metadata = {
  title: "Mis compras | ShopNext",
  description: "Historial de compras",
};

export default async function OrdersPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  const orders = await getOrders(token);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Mis compras
        </h1>

        <p className="mt-2 text-slate-600">
          Consulta el historial de tus pedidos.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <PackageOpen className="h-10 w-10 text-slate-500" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Todavía no tienes compras
          </h2>

          <p className="mt-3 text-slate-600">
            Cuando realices tu primera compra aparecerá
            aquí.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalItems = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return (
              <article
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Orden
                    </p>

                    <h2 className="text-xl font-bold text-slate-900">
                      #{order.id}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "producto"
                        : "productos"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-slate-500">
                      Total
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      $
                      {Number(order.total).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}