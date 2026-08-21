"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Award, ClickEvent, Product } from "@/lib/types";

type Range = 7 | 30;

interface ClickRow {
  name: string;
  clicks: number;
}

function aggregate(events: ClickEvent[], key: "products" | "producers"): ClickRow[] {
  const counts = new Map<string, number>();
  for (const e of events) {
    const name = e[key]?.name ?? "(deleted)";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, clicks]) => ({ name, clicks }))
    .sort((a, b) => b.clicks - a.clicks);
}

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pending, setPending] = useState<Product[]>([]);
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [range, setRange] = useState<Range>(30);

  const load = useCallback(async (r: Range) => {
    const supabase = getSupabase();
    const since = new Date(Date.now() - r * 24 * 60 * 60 * 1000).toISOString();
    const [{ data: pendingData }, { data: clickData }] = await Promise.all([
      supabase
        .from("products")
        .select("*, producers(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("click_events")
        .select("*, products(name), producers(name)")
        .gte("clicked_at", since)
        .order("clicked_at", { ascending: false }),
    ]);
    setPending((pendingData as Product[]) ?? []);
    setEvents((clickData as ClickEvent[]) ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (!adminRow) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      await load(30);
    })();
  }, [router, load]);

  async function setStatus(id: string, status: "approved" | "rejected") {
    const supabase = getSupabase();
    await supabase.from("products").update({ status }).eq("id", id);
    setPending((p) => p.filter((x) => x.id !== id));
  }

  /** Mark one award on one product as checked-and-genuine. */
  async function toggleAwardVerified(productId: string, index: number) {
    const product = pending.find((p) => p.id === productId);
    if (!product) return;
    const next: Award[] = (product.awards_json ?? []).map((a, i) =>
      i === index ? { ...a, verified: !a.verified } : a
    );
    const supabase = getSupabase();
    await supabase.from("products").update({ awards_json: next }).eq("id", productId);
    setPending((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, awards_json: next } : p))
    );
  }

  if (isAdmin === null)
    return <p className="mt-16 text-center text-olive-500">Loading…</p>;
  if (!isAdmin)
    return (
      <p className="mt-16 text-center text-olive-600">
        This page is for the Veritat curator. If that&apos;s you, add your account
        to <code>admin_users</code> (see README).
      </p>
    );

  const byOil = aggregate(events, "products");
  const byProducer = aggregate(events, "producers");

  return (
    <div className="mt-4 space-y-10">
      <h1 className="font-serif text-3xl font-bold text-olive-900">Curator dashboard</h1>

      <section>
        <h2 className="mb-3 font-serif text-xl font-bold text-olive-900">
          Awaiting your review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-olive-300 p-8 text-center text-olive-500">
            Nothing pending — all caught up. 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-olive-200 bg-white px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-olive-900">{p.name}</p>
                    <p className="text-sm text-olive-600">
                      {p.producers?.name}
                      {p.region ? ` · ${p.region}` : ""}
                      {p.price_usd != null ? ` · $${Number(p.price_usd).toFixed(2)}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn-primary !py-1.5"
                      onClick={() => setStatus(p.id, "approved")}
                    >
                      ✓ Certify
                    </button>
                    <button
                      className="btn-secondary !py-1.5 !text-red-700"
                      onClick={() => setStatus(p.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {p.description && (
                  <p className="mt-2 text-sm text-olive-700">{p.description}</p>
                )}
                {p.tasting_notes && (
                  <p className="mt-1 text-sm italic text-olive-600">{p.tasting_notes}</p>
                )}
                <p className="mt-1 text-sm">
                  {p.harvest_year ? (
                    <span className="font-semibold text-olive-800">
                      🫒 Harvest: {p.harvest_date || p.harvest_year}
                    </span>
                  ) : (
                    <span className="font-semibold text-red-700">
                      ⚠️ No harvest date — do not certify
                    </span>
                  )}
                </p>
                <p className="mt-2 text-xs text-olive-500">
                  {[
                    p.category,
                    p.varietals.join("/") || null,
                    p.intensity,
                    p.polyphenols_ppm ? `${p.polyphenols_ppm} mg/kg polyphenols` : null,
                    p.acidity ? `acidity ${p.acidity}` : null,
                    p.awards,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {p.buy_url && (
                  <a
                    href={p.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-olive-700 underline"
                  >
                    Check buy link ↗
                  </a>
                )}

                {(p.awards_json?.length ?? 0) > 0 && (
                  <div className="mt-3 rounded-xl border border-olive-200 bg-olive-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-olive-600">
                      Awards to check
                    </p>
                    <ul className="space-y-2">
                      {p.awards_json.map((a, i) => (
                        <li key={i} className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-olive-900">
                            {[a.award, a.competition, a.year, a.category]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                          {a.url ? (
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-olive-700 underline"
                            >
                              open result ↗
                            </a>
                          ) : (
                            <span className="text-xs text-red-700">no link given</span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleAwardVerified(p.id, i)}
                            className={
                              "ml-auto rounded-full border px-3 py-0.5 text-xs transition " +
                              (a.verified
                                ? "border-olive-700 bg-olive-700 text-white"
                                : "border-olive-300 bg-white text-olive-700 hover:bg-olive-100")
                            }
                          >
                            {a.verified ? "✓ verified" : "mark verified"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-olive-900">
            Buy-link clicks ({events.length} in last {range} days)
          </h2>
          <div className="flex gap-2">
            {([7, 30] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  load(r);
                }}
                className={
                  "rounded-full border px-3 py-1 text-sm transition " +
                  (range === r
                    ? "border-olive-700 bg-olive-700 text-white"
                    : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
                }
              >
                {r} days
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "By oil", rows: byOil },
            { title: "By producer", rows: byProducer },
          ].map(({ title, rows }) => (
            <div key={title} className="rounded-2xl border border-olive-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-olive-500">
                {title}
              </h3>
              {rows.length === 0 ? (
                <p className="text-sm text-olive-500">No clicks yet in this period.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.name} className="border-b border-olive-100 last:border-0">
                        <td className="py-2 text-olive-900">{r.name}</td>
                        <td className="py-2 text-right font-semibold text-olive-800">
                          {r.clicks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
