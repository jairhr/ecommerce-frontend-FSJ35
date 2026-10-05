"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">⚠️</div>

        <h1 className="text-3xl font-bold text-slate-900">
          Algo salió mal
        </h1>

        <p className="mt-3 text-slate-500">
          No pudimos cargar esta sección. Intenta nuevamente.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
}