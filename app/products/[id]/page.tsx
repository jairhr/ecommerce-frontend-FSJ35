import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/lib/api";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: `${product.name} | ShopNext`,
    description:
      product.description ??
      `Compra ${product.name} en ShopNext`,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={`https://picsum.photos/seed/product-${product.id}/900/900`}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Producto
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {product.name}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {product.description ||
              "No hay descripción disponible para este producto."}
          </p>

          <div className="my-8 border-y border-slate-200 py-6">
            <p className="text-4xl font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {product.stock > 0
                ? `${product.stock} unidades disponibles`
                : "Producto agotado"}
            </p>
          </div>

          <AddToCartButton product={product} />

          <Link
            href="/cart"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver carrito
          </Link>
        </div>
      </div>
    </main>
  );
}