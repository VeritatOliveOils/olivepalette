import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/oil/${product.id}`}
      className="group flex flex-col rounded-2xl border border-olive-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-olive-50 text-5xl">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span>🫒</span>
        )}
      </div>
      <h3 className="font-serif text-lg font-bold text-olive-900 group-hover:text-olive-700">
        {product.name}
      </h3>
      {product.producers && (
        <p className="text-sm text-olive-600">{product.producers.name}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {product.status === "approved" && (
          <span className="tag !bg-olive-700 !text-white">✓ Certified</span>
        )}
        {product.producers?.is_women_led && <span className="tag">🚺 women-led</span>}
        {product.intensity && <span className="tag capitalize">{product.intensity}</span>}
        {product.flavor_tags.slice(0, 2).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-3 text-sm font-semibold text-olive-800">
        {product.price_usd != null && <>${Number(product.price_usd).toFixed(2)}</>}
        {product.size_ml != null && (
          <span className="font-normal text-olive-500"> · {product.size_ml}ml</span>
        )}
      </div>
    </Link>
  );
}
