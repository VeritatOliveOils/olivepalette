import { WIOO_PRODUCER_IDS } from "@/lib/wioo";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerSupabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "For Women in Olive Oil members — Veritat, The Olive Oil Buyer's Guide",
  description:
    "Women in Olive Oil producer-members can list one extra virgin olive oil on Veritat free, permanently, with a member mark, wholesale visibility and click analytics.",
  alternates: { canonical: "https://veritat.com/wioo" },
};

const BENEFITS = [
  {
    title: "One oil listed free, permanently",
    body: "A full Veritat Certified listing for one oil. Not a trial, and no card needed.",
  },
  {
    title: "A WIOO member mark",
    body: "Your listing and producer profile show that you are a member of Women in Olive Oil.",
  },
  {
    title: "Seen by wholesale buyers",
    body: "Mark your oil as available for trade and buyers can find and contact you directly.",
  },
  {
    title: "Click analytics",
    body: "See how many shoppers Veritat sends to your own shop. You keep every sale and every customer.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create your producer account",
    body: "Use the email you share with Women in Olive Oil, so membership can be confirmed.",
  },
  {
    n: "2",
    title: "Add your oil in about ten minutes",
    body: "Paste your product page or the text from your back label. The form fills itself in for you to check.",
  },
  {
    n: "3",
    title: "Sommelier review",
    body: "Each oil is reviewed by hand: harvest date, origin, varieties and any awards are checked before the Certified mark goes live.",
  },
];

export default async function WiooPage() {
  let oils: Product[] = [];
  try {
    if (WIOO_PRODUCER_IDS.length > 0) {
      const supabase = getServerSupabase();
      const { data } = await supabase
        .from("products")
        .select("*, producers(*)")
        .eq("status", "approved")
        .in("producer_id", WIOO_PRODUCER_IDS)
        .order("created_at", { ascending: false });
      oils = (data as Product[]) ?? [];
    }
  } catch {
    // Collection not available yet
  }

  return (
    <div className="mt-6">
      <section className="rounded-3xl bg-olive-900 px-5 py-14 text-center text-white sm:rounded-[2rem] sm:px-12 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-olive-200">
          For members of Women in Olive Oil
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">
          Your oil, found by people who care what&apos;s in the bottle.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-olive-100 sm:text-lg">
          Producer-members can list one extra virgin olive oil on Veritat free, for good.
          Buyers click through to your own shop. Veritat never takes the sale.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/login?mode=signup&ref=wioo" className="btn-primary !bg-gold !px-8 !py-3 !text-olive-950 hover:!bg-yellow-500">
            List your oil, free
          </Link>
          <Link href="/example" className="btn-secondary !border-olive-600 !bg-transparent !px-8 !py-3 !text-white hover:!bg-olive-800">
            What a listing looks like
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center font-serif text-3xl font-bold text-olive-900">
          What members receive
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card p-7">
              <h3 className="font-serif text-xl font-bold text-olive-900">{b.title}</h3>
              <p className="mt-2 text-olive-600">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center font-serif text-3xl font-bold text-olive-900">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-7">
              <p className="font-serif text-3xl font-bold text-olive-400">{s.n}</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-olive-900">{s.title}</h3>
              <p className="mt-2 text-olive-600">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-olive-600">
          The one rule that never bends: no verified harvest date, no certification.
        </p>
      </section>

      <section className="mt-20">
        <div className="mb-6 border-b border-olive-200 pb-4">
          <h2 className="font-serif text-3xl font-bold text-olive-900">Member oils</h2>
          <p className="text-sm text-olive-600">
            Certified oils from Women in Olive Oil producer-members.
          </p>
        </div>
        {oils.length === 0 ? (
          <div className="card px-8 py-14 text-center">
            <h3 className="font-serif text-2xl font-bold text-olive-900">
              The first member oils are being reviewed now
            </h3>
            <p className="mx-auto mt-2 max-w-md text-olive-600">
              Certified oils from members will appear here as each one passes review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {oils.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
