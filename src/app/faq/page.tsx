import Link from "next/link";
import type { Metadata } from "next";
import Faq from "@/components/Faq";
import { BUYER_FAQ, PRODUCER_FAQ } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Olive Oil Questions Answered — Veritat, The Olive Oil Buyer's Guide",
  description:
    "How to tell real extra virgin olive oil from fake, why the harvest date matters more than 'best by', whether the fridge test works, and how to store, cook with and buy olive oil well. Answered by an olive oil sommelier.",
  keywords: [
    "how to tell if olive oil is real",
    "fake olive oil",
    "olive oil harvest date",
    "does olive oil expire",
    "can you cook with extra virgin olive oil",
    "olive oil fridge test",
    "is product of italy olive oil italian",
    "olive oil polyphenols",
  ],
  alternates: { canonical: "https://veritat.com/faq" },
};

export default function FaqPage() {
  return (
    <div className="mt-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-olive-500">
          The Olive Oil Buyer&apos;s Guide
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-olive-900 sm:text-5xl">
          Olive oil questions, answered
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-olive-600">
          Everything worth knowing before you buy a bottle — written by an olive oil
          sommelier, in plain language.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-3 border-b border-olive-200 pb-2 font-serif text-2xl font-bold text-olive-900">
          For buyers
        </h2>
        <Faq items={BUYER_FAQ} schema />

        <h2 className="mb-3 mt-12 border-b border-olive-200 pb-2 font-serif text-2xl font-bold text-olive-900">
          For producers
        </h2>
        <Faq items={PRODUCER_FAQ} />
      </div>

      <section className="mt-16 rounded-[2rem] bg-olive-900 px-6 py-12 text-center text-white sm:px-8 sm:py-14">
        <h2 className="font-serif text-3xl font-bold">Now find a bottle worth buying</h2>
        <p className="mx-auto mt-3 max-w-xl text-olive-100">
          Every oil on Veritat states its harvest date and its origin — checked by hand
          before it appears.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/discover"
            className="btn-primary !bg-gold !px-8 !py-3 !text-olive-950 hover:!bg-yellow-500"
          >
            Explore certified oils
          </Link>
          <Link
            href="/producers"
            className="btn-secondary !border-olive-600 !bg-transparent !px-8 !py-3 !text-white hover:!bg-olive-800"
          >
            Meet the producers
          </Link>
        </div>
      </section>
    </div>
  );
}
