"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/actions/auth";

interface LoginFormProps {
  redirectTo?: string;
}

interface LoginState {
  success: boolean;
  message: string;
}

const initialState: LoginState = {
  success: false,
  message: "",
};

export default function LoginForm({
  redirectTo = "/",
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="redirectTo"
        value={redirectTo}
      />

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="••••••••"
        />
      </div>

      {state.message && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>

      <div className="text-center text-sm text-slate-600">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-slate-900 hover:underline"
        >
          Regístrate
        </Link>
      </div>
    </form>
  );
}
