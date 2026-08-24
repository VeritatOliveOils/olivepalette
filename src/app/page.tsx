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
      {/* Hero */}
      <section className="relative mt-4 overflow-hidden rounded-3xl bg-olive-900 px-5 py-14 text-center text-white sm:mt-6 sm:rounded-[2rem] sm:px-12 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c4cd93 0, transparent 45%), radial-gradient(circle at 80% 70%, #c9a227 0, transparent 40%)",
          }}
        />
        <div className="relative">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-olive-200">
            The Olive Oil Buyer&apos;s Guide
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold leading-[1.08] sm:text-7xl">
            Find real
            <br />
            olive oil.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-olive-100 sm:mt-6 sm:text-lg">
            Most bottles won&apos;t tell you when the olives were picked. Every oil here
            will — certified by an olive oil sommelier, and sold direct by the family who
            made it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/discover"
              className="btn-primary !bg-gold !px-8 !py-3 !text-olive-950 hover:!bg-yellow-500"
            >
              Explore the oils
            </Link>
            <Link
              href="/producers"
              className="btn-secondary !border-olive-600 !bg-transparent !px-8 !py-3 !text-white hover:!bg-olive-800"
            >
              Meet the producers
            </Link>
          </div>
        </div>
      </section>

      {/* The problem — editorial statement */}
      <section className="mx-auto mt-20 max-w-3xl text-center">
        <div className="rule-ornament mb-6">🫒</div>
        <p className="px-2 font-serif text-xl leading-relaxed text-olive-800 sm:text-3xl">
          Most bottles labelled <em>extra virgin</em> can&apos;t tell you when the olives
          were picked. Ours can — or they don&apos;t get listed.
        </p>
      </section>

      {/* Latest oils */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between border-b border-olive-200 pb-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-olive-900">
              Certified oils
            </h2>
            <p className="text-sm text-olive-600">
              Each one reviewed and approved by hand.
            </p>
          </div>
          <Link
            href="/discover"
            className="whitespace-nowrap text-sm font-semibold text-olive-700 hover:underline"
          >
            See all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="card px-8 py-16 text-center">
            <p className="text-4xl">🫒</p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-olive-900">
              The first bottles are being certified now
            </h3>
            <p className="mx-auto mt-2 max-w-md text-olive-600">
              Veritat is opening with a small group of founding producers. If you make
              exceptional olive oil, there&apos;s a place for you here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/login?mode=signup" className="btn-primary">
                List your oil — free
              </Link>
              <Link href="/example" className="btn-secondary">
                See a sample listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mt-24">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-olive-900">
            How Veritat works
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "I",
              title: "Producers list in minutes",
              body: "Paste your product page, or photograph your back label. We read the harvest date, varietals and acidity straight from your own words — never invented.",
            },
            {
              n: "II",
              title: "Every oil is certified",
              body: "A sommelier reviews each listing before it appears. No harvest date, no certification. The ✓ mark means someone checked.",
            },
            {
              n: "III",
              title: "Buyers go direct to you",
              body: "Shoppers filter by taste, origin and shipping, then click through to your own shop. We never touch the sale or your customer.",
            },
          ].map((f) => (
            <div key={f.n} className="card p-7">
              <p className="font-serif text-3xl font-bold text-gold">{f.n}</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-olive-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-olive-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Producer CTA */}
      <section className="mt-24 overflow-hidden rounded-[2rem] border border-olive-200 bg-white px-8 py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-olive-500">
          For producers
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight text-olive-900">
          Your oil deserves to be found by people who care what&apos;s in the bottle.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-olive-600">
          Founding producers list free, forever. Ten minutes to add your first oil — and
          you keep the sale, the customer and the story.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/login?mode=signup" className="btn-primary !px-8 !py-3">
            Join as a founding producer
          </Link>
          <Link href="/example" className="btn-secondary !px-8 !py-3">
            What a listing looks like
          </Link>
        </div>
      </section>
    </div>
  );
}
