"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import {
  FLAVOR_TAGS,
  HIGH_POLYPHENOL_THRESHOLD,
  INTENSITIES,
  SHIPPING_REGIONS,
} from "@/lib/constants";
import type { Product } from "@/lib/types";

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [intensity, setIntensity] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [womenLed, setWomenLed] = useState(false);
  const [highPolyphenol, setHighPolyphenol] = useState(false);
  const [organic, setOrganic] = useState(false);
  const [shipsTo, setShipsTo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supabase = getSupabase();
      let query = supabase
        .from("products")
        .select("*, producers(*)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (intensity) query = query.eq("intensity", intensity);
      if (tags.length > 0) query = query.overlaps("flavor_tags", tags);
      const { data } = await query;
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    })();
  }, [intensity, tags]);

  const visible = products.filter((p) => {
    if (womenLed && !p.producers?.is_women_led) return false;
    if (organic && !p.organic) return false;
    if (
      highPolyphenol &&
      (p.polyphenols_ppm == null || p.polyphenols_ppm < HIGH_POLYPHENOL_THRESHOLD)
    )
      return false;
    if (
      shipsTo &&
      !(p.producers?.shipping_regions ?? []).some(
        (r) => r.toLowerCase() === shipsTo.toLowerCase()
      )
    )
      return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.region ?? "").toLowerCase().includes(q) ||
      (p.country ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q) ||
      p.varietals.some((v) => v.toLowerCase().includes(q)) ||
      (p.producers?.name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="mt-4">
      <h1 className="font-serif text-3xl font-bold text-olive-900">Discover oils</h1>
      <p className="mb-6 text-olive-600">Find your next favorite by taste, region, or maker.</p>

      <div className="mb-6 space-y-4 rounded-2xl border border-olive-200 bg-white p-5">
        <input
          className="input"
          placeholder="Search by name, region, varietal, or producer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-olive-500">
            Intensity:
          </span>
          {INTENSITIES.map((i) => (
            <button
              key={i}
              onClick={() => setIntensity(intensity === i ? null : i)}
              className={
                "rounded-full border px-3 py-1 text-sm capitalize transition " +
                (intensity === i
                  ? "border-olive-700 bg-olive-700 text-white"
                  : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
              }
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-olive-500">
            Ships to:
          </span>
          {SHIPPING_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setShipsTo(shipsTo === r ? null : r)}
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (shipsTo === r
                  ? "border-olive-700 bg-olive-700 text-white"
                  : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
              }
            >
              {r}
            </button>
          ))}
          <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-olive-500">
            More:
          </span>
          {[
            { label: "🚺 Women-led", on: womenLed, toggle: () => setWomenLed(!womenLed) },
            { label: "🌿 Organic", on: organic, toggle: () => setOrganic(!organic) },
            {
              label: "💪 High-polyphenol",
              on: highPolyphenol,
              toggle: () => setHighPolyphenol(!highPolyphenol),
            },
          ].map((f) => (
            <button
              key={f.label}
              onClick={f.toggle}
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (f.on
                  ? "border-olive-700 bg-olive-700 text-white"
                  : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-olive-500">
            Flavor:
          </span>
          {FLAVOR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag])
              }
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (tags.includes(tag)
                  ? "border-olive-700 bg-olive-700 text-white"
                  : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-olive-500">Loading oils…</p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-olive-300 p-12 text-center text-olive-500">
          No oils match those filters yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
