import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Producer, Product } from "@/lib/types";

export const revalidate = 60;

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getServerSupabase();

  const [{ data: producerData }, { data: productsData }] = await Promise.all([
    supabase.from("producers").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("products")
      .select("*, producers(*)")
      .eq("producer_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
  ]);

  const producer = producerData as Producer | null;
  if (!producer) notFound();
  const products = (productsData as Product[]) ?? [];

  return (
    <div className="mt-6">
      <div className="rounded-3xl bg-olive-800 px-8 py-12 text-white">
        <div className="flex items-start gap-5">
          {producer.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={producer.logo_url}
              alt={`${producer.name} logo`}
              className="h-16 w-16 rounded-xl bg-white object-contain p-1"
            />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-olive-300">
              Producer
            </p>
            <h1 className="mt-1 font-serif text-4xl font-bold">{producer.name}</h1>
            <p className="mt-1 text-olive-200">
              {[producer.region, producer.country].filter(Boolean).join(", ")}
              {producer.ships_from ? (
                <span className="text-olive-300"> · ships from {producer.ships_from}</span>
              ) : null}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {producer.is_women_led && (
            <span className="tag !bg-olive-700 !text-olive-100">🚺 women-led</span>
          )}
          {producer.certifications_text && (
            <span className="tag !bg-olive-700 !text-olive-100">
              {producer.certifications_text}
            </span>
          )}
          {producer.shipping_regions.length > 0 && (
            <span className="tag !bg-olive-700 !text-olive-100">
              Ships to {producer.shipping_regions.join(", ")}
            </span>
          )}
          {producer.wholesale_available && (
            <span className="tag !bg-gold !text-olive-950">🏪 wholesale enquiries welcome</span>
          )}
        </div>
        <div className="mt-4 flex gap-5">
          {producer.website && (
            <a
              href={producer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gold hover:underline"
            >
              Visit website →
            </a>
          )}
          {producer.instagram_url && (
            <a
              href={producer.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gold hover:underline"
            >
              Instagram →
            </a>
          )}
        </div>
      </div>

      {producer.wholesale_available && (
        <div className="mt-8 rounded-2xl border border-gold/50 bg-gold/10 p-6">
          <h2 className="font-serif text-lg font-bold text-olive-900">
            🏪 For shops, restaurants &amp; importers
          </h2>
          <p className="mt-1 text-sm text-olive-700">
            {producer.name} welcomes wholesale and trade enquiries.
            {producer.trade_notes ? ` ${producer.trade_notes}` : ""}
          </p>
          {producer.trade_contact_email && (
            <a
              href={`mailto:${producer.trade_contact_email}?subject=Wholesale enquiry via Veritat`}
              className="btn-primary mt-3 !py-2"
            >
              Send a trade enquiry
            </a>
          )}
        </div>
      )}

      {(producer.press?.length ?? 0) > 0 && (
        <div className="mt-8 max-w-3xl">
          <h2 className="mb-3 font-serif text-2xl font-bold text-olive-900">
            In the press
          </h2>
          <ul className="space-y-2">
            {producer.press.map((p, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline gap-x-2 rounded-xl border border-olive-200 bg-white px-4 py-3 text-sm"
              >
                <span className="font-semibold text-olive-900">{p.outlet}</span>
                {p.date && <span className="text-olive-500">{p.date}</span>}
                {p.title && <span className="italic text-olive-700">“{p.title}”</span>}
                {p.verified && (
                  <span className="tag !bg-olive-800 !text-white">✓ verified</span>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-medium text-olive-700 underline"
                  >
                    Read it ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {producer.story && (
        <div className="mt-8 max-w-3xl">
          <h2 className="mb-2 font-serif text-2xl font-bold text-olive-900">Our story</h2>
          <p className="whitespace-pre-line text-olive-700">{producer.story}</p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-olive-900">
          Oils ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-olive-300 p-10 text-center text-olive-500">
            No oils listed yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
