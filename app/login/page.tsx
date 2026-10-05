import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | ShopNext",
  description: "Inicia sesión en ShopNext",
};

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const redirectTo =
    params.redirect &&
    params.redirect.startsWith("/")
      ? params.redirect
      : "/";

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-slate-600">
            Ingresa a tu cuenta para continuar.
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
