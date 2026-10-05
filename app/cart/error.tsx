"use client";

export default function CartError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          No pudimos cargar el carrito
        </h2>

        <p className="mt-2 text-slate-600">
          Ocurrió un problema inesperado.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
        >
          Intentar nuevamente
        </button>
      </div>
    </main>
  );
}