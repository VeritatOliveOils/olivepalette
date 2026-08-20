import Link from "next/link";
import type { Metadata } from "next";
import TasteProfile from "@/components/TasteProfile";

export const metadata: Metadata = {
  title: "What a great listing looks like — Veritat",
  description:
    "A sample Veritat listing, annotated. See exactly what producers provide and what buyers see.",
};

/** Small annotation bubble pointing out why a detail matters. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-olive-800">
      <span className="font-semibold">Why it matters — </span>
      {children}
    </p>
  );
}

export default function ExamplePage() {
  return (
    <div className="mt-6">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-olive-500">
          For producers
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-olive-900 sm:text-5xl">
          What a great listing looks like
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-olive-600">
          Below is a complete Veritat listing, annotated. Nothing here is invented by us —
          every detail comes from the producer&apos;s own page or label.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-olive-300 bg-olive-50 px-5 py-3 text-center text-sm text-olive-700">
        ⓘ This is a <strong>sample</strong> — an illustration, not a real product. Every
        oil in our directory is a real, certified bottle you can buy.
      </div>

      {/* The mock listing */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="flex h-80 items-center justify-center rounded-3xl bg-gradient-to-b from-olive-100 to-olive-200 text-8xl">
            🫒
          </div>
          <Note>
            A clean photo of the bottle — producers paste an image link, or we pull it
            automatically from their product page.
          </Note>

          <div className="card mt-6 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-olive-500">
              Meet the maker
            </p>
            <p className="font-serif text-xl font-bold text-olive-900">
              Casa de la Luz
            </p>
            <p className="text-sm text-olive-600">Jaén, Spain</p>
            <p className="mt-3 text-sm leading-relaxed text-olive-700">
              Three generations on the same hillside. María took over the mill in 2016 and
              moved the harvest three weeks earlier to chase polyphenols instead of yield.
            </p>
          </div>
          <Note>
            The story sells the oil. Producers paste their &quot;About&quot; page — no
            writing required.
          </Note>
        </div>

        <div>
          <h2 className="font-serif text-4xl font-bold text-olive-900">
            Temprano Picual
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="tag !bg-olive-800 !text-white">✓ Veritat Certified</span>
            <span className="tag">🚺 women-led</span>
            <span className="tag">extra virgin</span>
            <span className="tag">robust</span>
            <span className="tag !bg-gold/20 !text-olive-900">organic</span>
            <span className="tag">💪 high-polyphenol</span>
            <span className="tag">grassy</span>
            <span className="tag">artichoke</span>
            <span className="tag">peppery</span>
          </div>
          <Note>
            Buyers filter by these. The more accurate the tags, the more often an oil is
            found.
          </Note>

          <p className="mt-5 leading-relaxed text-olive-700">
            An early-harvest Picual pressed within four hours of picking. Bold, green and
            unmistakably peppery — the kind of oil that makes plain bread worth eating.
          </p>

          <div className="mt-6">
            <h3 className="mb-1 font-serif text-lg font-bold text-olive-900">
              Tasting notes
            </h3>
            <p className="leading-relaxed text-olive-700">
              Fresh-cut grass and green tomato leaf on the nose. Artichoke and almond
              through the middle, finishing with a clean peppery sting at the back of the
              throat that lingers for several seconds.
            </p>
          </div>

          <div className="mt-6">
            <TasteProfile fruitiness={8} bitterness={6} pungency={7} />
          </div>
          <Note>
            The taste sliders let shoppers match an oil to their palate — the closest
            thing to tasting before buying.
          </Note>

          <dl className="card mt-6 grid grid-cols-2 gap-x-6 gap-y-3 p-6 text-sm">
            <dt className="font-semibold text-olive-500">Harvest</dt>
            <dd className="font-semibold text-olive-900">28 October 2025</dd>
            <dt className="font-semibold text-olive-500">Varietals</dt>
            <dd className="text-olive-900">Picual</dd>
            <dt className="font-semibold text-olive-500">Origin</dt>
            <dd className="text-olive-900">Molino Santa Luz, Jaén, Spain</dd>
            <dt className="font-semibold text-olive-500">Acidity</dt>
            <dd className="text-olive-900">0.16%</dd>
            <dt className="font-semibold text-olive-500">Polyphenols</dt>
            <dd className="text-olive-900">642 mg/kg</dd>
            <dt className="font-semibold text-olive-500">Size</dt>
            <dd className="text-olive-900">500ml · glass</dd>
            <dt className="font-semibold text-olive-500">Ships to</dt>
            <dd className="text-olive-900">US, Canada, EU, UK</dd>
            <dt className="font-semibold text-olive-500">Awards</dt>
            <dd className="text-olive-900">Gold, NYIOOC 2026</dd>
            <dt className="font-semibold text-olive-500">Pairs with</dt>
            <dd className="text-olive-900">grilled vegetables, aged manchego, gazpacho</dd>
          </dl>
          <Note>
            <strong>The harvest date is required.</strong> No harvest date, no
            certification — a &quot;best by&quot; date is not a harvest date. It is the
            single clearest signal of a real, fresh oil.
          </Note>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-serif text-3xl font-bold text-olive-900">$34.00</span>
            <span className="btn-primary !px-8 !py-3 cursor-default opacity-90">
              Buy from Casa de la Luz →
            </span>
          </div>
          <Note>
            The button goes straight to the producer&apos;s own shop. Veritat never takes
            a cut of the sale — we just count the click so producers can see the traffic
            we send.
          </Note>
        </div>
      </div>

      {/* Checklist */}
      <section className="mx-auto mt-20 max-w-3xl">
        <div className="rule-ornament mb-6">🫒</div>
        <h2 className="text-center font-serif text-3xl font-bold text-olive-900">
          Your listing checklist
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Harvest date", "Required. Month and year is fine; exact date is better."],
            ["Varietals", "Which olives — Picual, Koroneiki, Arbequina, a blend."],
            ["Region & farm", "Where the trees actually grow."],
            ["Tasting notes", "Your own words. What does it taste like?"],
            ["Flavour tags & intensity", "How buyers filter to find you."],
            ["Acidity / polyphenols", "If you have lab results, they build trust fast."],
            ["Price, size, packaging", "So buyers know before they click."],
            ["Buy link", "Your own shop page for this oil."],
            ["Bottle photo", "One clean image is enough."],
            ["Shipping regions", "Where you can send it — buyers filter by this."],
          ].map(([title, body]) => (
            <div key={title} className="card p-4">
              <p className="font-semibold text-olive-900">✓ {title}</p>
              <p className="mt-0.5 text-sm text-olive-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-[2rem] bg-olive-900 px-8 py-14 text-center text-white">
        <h2 className="font-serif text-3xl font-bold">
          Most of this fills itself in
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-olive-100">
          Paste your product page — or photograph your back label — and Veritat reads the
          details for you. You check them, we certify, and your oil goes live. Founding
          producers list free, forever.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login?mode=signup"
            className="btn-primary !bg-gold !px-8 !py-3 !text-olive-950 hover:!bg-yellow-500"
          >
            List your oil
          </Link>
          <Link
            href="/discover"
            className="btn-secondary !border-olive-600 !bg-transparent !px-8 !py-3 !text-white hover:!bg-olive-800"
          >
            Browse certified oils
          </Link>
        </div>
      </section>
    </div>
  );
}
