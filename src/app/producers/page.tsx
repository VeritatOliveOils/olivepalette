"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { SHIPPING_REGIONS } from "@/lib/constants";
import type { Producer } from "@/lib/types";

interface ProducerRow extends Producer {
  oil_count: number;
}

export default function ProducersPage() {
  const [producers, setProducers] = useState<ProducerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [womenLed, setWomenLed] = useState(false);
  const [wholesale, setWholesale] = useState(false);
  const [shipsTo, setShipsTo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const [{ data: prods }, { data: oils }] = await Promise.all([
        supabase.from("producers").select("*").order("name"),
        supabase.from("products").select("producer_id").eq("status", "approved"),
      ]);
      const counts = new Map<string, number>();
      (oils ?? []).forEach((o: { producer_id: string }) =>
        counts.set(o.producer_id, (counts.get(o.producer_id) ?? 0) + 1)
      );
      setProducers(
        ((prods as Producer[]) ?? []).map((p) => ({
          ...p,
          oil_count: counts.get(p.id) ?? 0,
        }))
      );
      setLoading(false);
    })();
  }, []);

  const countries = useMemo(
    () =>
      Array.from(
        new Set(producers.map((p) => p.country).filter((c): c is string => !!c))
      ).sort(),
    [producers]
  );

  const visible = producers.filter((p) => {
    if (country && p.country !== country) return false;
    if (womenLed && !p.is_women_led) return false;
    if (wholesale && !p.wholesale_available) return false;
    if (
      shipsTo &&
      !(p.shipping_regions ?? []).some((r) => r.toLowerCase() === shipsTo.toLowerCase())
    )
      return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.country ?? "").toLowerCase().includes(q) ||
      (p.region ?? "").toLowerCase().includes(q)
    );
  });

  const chip = (on: boolean) =>
    "rounded-full border px-3 py-1 text-sm transition " +
    (on
      ? "border-olive-700 bg-olive-700 text-white"
      : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50");

  return (
    <div className="mt-4">
      <h1 className="font-serif text-3xl font-bold text-olive-900">Producers</h1>
      <p className="mb-6 max-w-2xl text-olive-600">
        Every producer on Veritat, by country. Shops, restaurants and importers: filter
        by <strong>Wholesale</strong> to find producers who welcome trade enquiries.
      </p>

      <div className="mb-6 space-y-4 rounded-2xl border border-olive-200 bg-white p-5">
        <input
          className="input"
          placeholder="Search by name, country or region…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {countries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-olive-500">
              Country:
            </span>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(country === c ? null : c)}
                className={chip(country === c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-olive-500">
            Ships to:
          </span>
          {SHIPPING_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setShipsTo(shipsTo === r ? null : r)}
              className={chip(shipsTo === r)}
            >
              {r}
            </button>
          ))}
          <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-olive-500">
            More:
          </span>
          <button onClick={() => setWomenLed(!womenLed)} className={chip(womenLed)}>
            🚺 Women-led
          </button>
          <button onClick={() => setWholesale(!wholesale)} className={chip(wholesale)}>
            🏪 Wholesale
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-olive-500">Loading producers…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-olive-300 p-12 text-center">
          <p className="text-olive-600">No producers match those filters yet.</p>
          <Link href="/login?mode=signup" className="btn-primary mt-4">
            Are you a producer? Add your farm
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-olive-500">
            {visible.length} producer{visible.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl border border-olive-200 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  {p.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo_url}
                      alt={p.name}
                      className="h-12 w-12 rounded-lg border border-olive-100 object-contain"
                    />
                  )}
                  <div>
                    <Link
                      href={`/producer/${p.id}`}
                      className="font-serif text-lg font-bold text-olive-900 hover:text-olive-700"
                    >
                      {p.name}
                    </Link>
                    <p className="text-sm text-olive-600">
                      {[p.region, p.country].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.is_women_led && <span className="tag">🚺 women-led</span>}
                  {p.wholesale_available && (
                    <span className="tag !bg-gold/20 !text-olive-900">🏪 wholesale</span>
                  )}
                  {p.oil_count > 0 && (
                    <span className="tag">
                      {p.oil_count} certified oil{p.oil_count === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                {p.shipping_regions?.length > 0 && (
                  <p className="mt-2 text-xs text-olive-500">
                    Ships to {p.shipping_regions.join(", ")}
                  </p>
                )}
                {p.wholesale_available && p.trade_notes && (
                  <p className="mt-1 text-xs italic text-olive-600">{p.trade_notes}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-3 pt-4 text-sm font-medium">
                  <Link href={`/producer/${p.id}`} className="text-olive-700 hover:underline">
                    View profile →
                  </Link>
                  {p.wholesale_available && p.trade_contact_email && (
                    <a
                      href={`mailto:${p.trade_contact_email}?subject=Wholesale enquiry via Veritat`}
                      className="text-olive-700 hover:underline"
                    >
                      Trade enquiry ✉
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 rounded-2xl bg-olive-800 px-8 py-10 text-center text-white">
        <h2 className="font-serif text-2xl font-bold">Are you a producer?</h2>
        <p className="mx-auto mt-2 max-w-xl text-olive-100">
          Add your farm and your oils in about ten minutes — paste your product page or
          photograph your label and we&apos;ll do the rest. Founding members are free
          forever.
        </p>
        <Link
          href="/login?mode=signup"
          className="btn-primary mt-5 !bg-gold !text-olive-950 hover:!bg-yellow-500"
        >
          Join the directory
        </Link>
      </div>
    </div>
  );
}
