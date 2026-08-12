import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  let featured: Product[] = [];
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("products")
      .select("*, producers(*)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);
    featured = (data as Product[]) ?? [];
  } catch {
    // Supabase not configured yet — show landing without products
  }

  return (
    <div>
      <section className="mt-8 rounded-3xl bg-olive-800 px-8 py-16 text-center text-white">
        <h1 className="mx-auto max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
          Taste olive oil like an expert.
          <br />
          Buy it straight from the maker.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-olive-100">
          Explore certified artisanal extra virgin olive oils by flavor profile — grassy,
          peppery, buttery — and discover the people and groves behind every bottle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/discover" className="btn-primary !bg-gold !text-olive-950 hover:!bg-yellow-500">
            Explore oils
          </Link>
          <Link
            href="/login?mode=signup"
            className="btn-secondary !border-olive-500 !bg-transparent !text-white hover:!bg-olive-700"
          >
            I&apos;m a producer
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold text-olive-900">Latest oils</h2>
          <Link href="/discover" className="text-sm font-medium text-olive-700 hover:underline">
            See all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-olive-300 p-10 text-center text-olive-500">
            No oils listed yet — be the first producer to add yours.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          {
            emoji: "📋",
            title: "Copy. Paste. Listed.",
            body: "Producers paste their existing website or label text and Smart Paste turns it into a rich product page — no forms to fight.",
          },
          {
            emoji: "✓",
            title: "Certified legit",
            body: "Every listed oil is vetted and certified by our olive oil sommelier before it goes live — no fakes, full provenance.",
          },
          {
            emoji: "🤝",
            title: "Direct from makers",
            body: "Every bottle links straight to the producer's own shop — many women-led. No middlemen, full story.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-olive-200 bg-white p-6">
            <p className="text-3xl">{f.emoji}</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-olive-900">{f.title}</h3>
            <p className="mt-1 text-sm text-olive-600">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
