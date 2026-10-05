import { Suspense } from "react";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api";

async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">
          No hay productos disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-slate-200" />

          <div className="space-y-3 p-5">
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-300">
              ShopNext
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Todo lo que necesitas,
              <span className="block text-slate-400">
                en un solo lugar.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Descubre nuestros productos, agrégalos al carrito
              y disfruta de una experiencia de compra rápida y
              sencilla.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Nuestros productos
          </h2>

          <p className="mt-2 text-slate-500">
            Explora nuestro catálogo disponible.
          </p>
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}