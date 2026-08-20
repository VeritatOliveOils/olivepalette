import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/oil/${product.id}`} className="card card-hover group flex flex-col p-5">
      <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-olive-50 to-olive-100 text-5xl">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="opacity-60">🫒</span>
        )}
      </div>

      {product.producers && (
        <p className="text-xs font-semibold uppercase tracking-wider text-olive-500">
          {product.producers.name}
        </p>
      )}
      <h3 className="mt-0.5 font-serif text-xl font-bold leading-snug text-olive-900 group-hover:text-olive-700">
        {product.name}
      </h3>

      <p className="mt-1 text-sm text-olive-600">
        {[
          product.harvest_date || (product.harvest_year ? `${product.harvest_year} harvest` : null),
          [product.region, product.country].filter(Boolean).join(", ") || null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.status === "approved" && (
          <span className="tag !bg-olive-800 !text-white">✓ Certified</span>
        )}
        {product.producers?.is_women_led && <span className="tag">🚺 women-led</span>}
        {product.intensity && <span className="tag capitalize">{product.intensity}</span>}
        {product.flavor_tags.slice(0, 2).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-baseline justify-between border-t border-olive-100 pt-4">
        <span className="font-serif text-xl font-bold text-olive-900">
          {product.price_usd != null ? `$${Number(product.price_usd).toFixed(2)}` : "—"}
        </span>
        {product.size_ml != null && (
          <span className="text-xs text-olive-500">{product.size_ml}ml</span>
        )}
      </div>
    </Link>
  );
}
