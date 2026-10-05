"use client";

import Link from "next/link";

export default function OrderDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          No pudimos cargar esta orden
        </h2>

        <p className="mt-3 text-slate-600">
          La orden no pudo ser consultada.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Intentar nuevamente
          </button>

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