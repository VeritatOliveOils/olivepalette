import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import TasteProfile from "@/components/TasteProfile";
import OilQrCode from "@/components/OilQrCode";
import { HIGH_POLYPHENOL_THRESHOLD } from "@/lib/constants";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function OilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*, producers(*)")
    .eq("id", id)
    .maybeSingle();

  const product = data as Product | null;
  if (!product) notFound();

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="flex h-80 items-center justify-center rounded-3xl bg-olive-50 text-8xl">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full rounded-3xl object-cover"
            />
          ) : (
            <span>🫒</span>
          )}
        </div>
        {product.producers && (
          <div className="mt-6 rounded-2xl border border-olive-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-olive-500">
              Meet the maker
            </p>
            <Link
              href={`/producer/${product.producers.id}`}
              className="font-serif text-xl font-bold text-olive-900 hover:text-olive-700"
            >
              {product.producers.name}
            </Link>
            <p className="text-sm text-olive-600">
              {[product.producers.region, product.producers.country]
                .filter(Boolean)
                .join(", ")}
            </p>
            {product.producers.story && (
              <p className="mt-3 line-clamp-4 text-sm text-olive-700">
                {product.producers.story}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-serif text-4xl font-bold text-olive-900">{product.name}</h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.status === "approved" && (
            <span className="tag !bg-olive-700 !text-white">✓ Certified</span>
          )}
          {product.producers?.is_women_led && <span className="tag">🚺 women-led</span>}
          {product.category && <span className="tag capitalize">{product.category}</span>}
          {product.intensity && <span className="tag capitalize">{product.intensity}</span>}
          {product.organic && <span className="tag !bg-gold/20 !text-olive-900">organic</span>}
          {product.polyphenols_ppm != null &&
            product.polyphenols_ppm >= HIGH_POLYPHENOL_THRESHOLD && (
              <span className="tag">💪 high-polyphenol</span>
            )}
          {product.flavor_tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {product.description && (
          <p className="mt-4 text-olive-700">{product.description}</p>
        )}

        {product.tasting_notes && (
          <div className="mt-6">
            <h2 className="mb-1 font-serif text-lg font-bold text-olive-900">
              Tasting notes
            </h2>
            <p className="text-olive-700">{product.tasting_notes}</p>
          </div>
        )}

        <div className="mt-6">
          <TasteProfile
            fruitiness={product.fruitiness}
            bitterness={product.bitterness}
            pungency={product.pungency}
          />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-olive-200 bg-white p-6 text-sm">
          {product.varietals.length > 0 && (
            <>
              <dt className="font-semibold text-olive-500">Varietals</dt>
              <dd className="text-olive-900">{product.varietals.join(", ")}</dd>
            </>
          )}
          {(product.region || product.country) && (
            <>
              <dt className="font-semibold text-olive-500">Origin</dt>
              <dd className="text-olive-900">
                {[product.farm_name, product.region, product.country]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </>
          )}
          {product.harvest_year && (
            <>
              <dt className="font-semibold text-olive-500">Harvest</dt>
              <dd className="text-olive-900">{product.harvest_year}</dd>
            </>
          )}
          {product.acidity && (
            <>
              <dt className="font-semibold text-olive-500">Acidity</dt>
              <dd className="text-olive-900">{product.acidity}</dd>
            </>
          )}
          {product.polyphenols_ppm != null && (
            <>
              <dt className="font-semibold text-olive-500">Polyphenols</dt>
              <dd className="text-olive-900">{product.polyphenols_ppm} mg/kg</dd>
            </>
          )}
          {product.size_ml && (
            <>
              <dt className="font-semibold text-olive-500">Size</dt>
              <dd className="text-olive-900">
                {product.size_ml}ml{product.packaging ? ` · ${product.packaging}` : ""}
              </dd>
            </>
          )}
          {(product.producers?.shipping_regions?.length ?? 0) > 0 && (
            <>
              <dt className="font-semibold text-olive-500">Ships to</dt>
              <dd className="text-olive-900">
                {product.producers!.shipping_regions.join(", ")}
              </dd>
            </>
          )}
          {product.awards && (
            <>
              <dt className="font-semibold text-olive-500">Awards</dt>
              <dd className="text-olive-900">{product.awards}</dd>
            </>
          )}
          {product.pairings.length > 0 && (
            <>
              <dt className="font-semibold text-olive-500">Pairs with</dt>
              <dd className="text-olive-900">{product.pairings.join(", ")}</dd>
            </>
          )}
        </dl>

        <div className="mt-8 flex items-center gap-4">
          {product.price_usd != null && (
            <span className="font-serif text-3xl font-bold text-olive-900">
              ${Number(product.price_usd).toFixed(2)}
            </span>
          )}
          {product.buy_url ? (
            <a href={`/go/${product.id}`} className="btn-primary !px-8 !py-3">
              Buy from {product.producers?.name ?? "the producer"} →
            </a>
          ) : (
            <span className="text-sm text-olive-500">
              Contact the producer to purchase.
            </span>
          )}
        </div>

        <div className="mt-8 max-w-xs">
          <OilQrCode productId={product.id} name={product.name} />
        </div>
      </div>
    </div>
  );
}
