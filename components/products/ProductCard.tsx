import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={`https://picsum.photos/seed/product-${product.id}/600/600`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
            {product.name}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
            {product.description || "Sin descripción disponible."}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.stock > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} disponibles`
                : "Agotado"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}