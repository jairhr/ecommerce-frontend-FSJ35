import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Crear cuenta | ShopNext",
  description: "Crea tu cuenta en ShopNext",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-128px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Crear cuenta
          </h1>

          <p className="mt-2 text-slate-500">
            Regístrate para comenzar a comprar.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}