"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  CATEGORIES,
  FLAVOR_TAGS,
  INTENSITIES,
  INTENSITY_LABELS,
  PACKAGING_OPTIONS,
} from "@/lib/constants";
import type { ParsedProduct } from "@/lib/types";

type Draft = {
  name: string;
  description: string;
  category: string;
  varietals: string;
  region: string;
  country: string;
  farm_name: string;
  harvest_year: string;
  intensity: string;
  flavor_tags: string[];
  tasting_notes: string;
  pairings: string;
  fruitiness: string;
  bitterness: string;
  pungency: string;
  polyphenols_ppm: string;
  size_ml: string;
  packaging: string;
  price_usd: string;
  buy_url: string;
  image_url: string;
  organic: boolean;
  awards: string;
  acidity: string;
};

const EMPTY: Draft = {
  name: "",
  description: "",
  category: "",
  varietals: "",
  region: "",
  country: "",
  farm_name: "",
  harvest_year: "",
  intensity: "",
  flavor_tags: [],
  tasting_notes: "",
  pairings: "",
  fruitiness: "",
  bitterness: "",
  pungency: "",
  polyphenols_ppm: "",
  size_ml: "",
  packaging: "",
  price_usd: "",
  buy_url: "",
  image_url: "",
  organic: false,
  awards: "",
  acidity: "",
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() === "" || Number.isNaN(n) ? null : n;
}

function list(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function NewProductForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");

  const [step, setStep] = useState<"paste" | "review">(editId ? "review" : "paste");
  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing product when editing
  useEffect(() => {
    if (!editId) return;
    (async () => {
      const supabase = getSupabase();
      const { data: p } = await supabase
        .from("products")
        .select("*")
        .eq("id", editId)
        .maybeSingle();
      if (p) {
        setDraft({
          name: p.name ?? "",
          description: p.description ?? "",
          category: p.category ?? "",
          varietals: (p.varietals ?? []).join(", "),
          region: p.region ?? "",
          country: p.country ?? "",
          farm_name: p.farm_name ?? "",
          harvest_year: p.harvest_year?.toString() ?? "",
          intensity: p.intensity ?? "",
          flavor_tags: p.flavor_tags ?? [],
          tasting_notes: p.tasting_notes ?? "",
          pairings: (p.pairings ?? []).join(", "),
          fruitiness: p.fruitiness?.toString() ?? "",
          bitterness: p.bitterness?.toString() ?? "",
          pungency: p.pungency?.toString() ?? "",
          polyphenols_ppm: p.polyphenols_ppm?.toString() ?? "",
          size_ml: p.size_ml?.toString() ?? "",
          packaging: p.packaging ?? "",
          price_usd: p.price_usd?.toString() ?? "",
          buy_url: p.buy_url ?? "",
          image_url: p.image_url ?? "",
          organic: !!p.organic,
          awards: p.awards ?? "",
          acidity: p.acidity ?? "",
        });
      }
    })();
  }, [editId]);

  async function runSmartPaste() {
    setParsing(true);
    setParseError(null);
    try {
      const supabase = getSupabase();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: pasteText }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Parsing failed");
      const p: ParsedProduct = body.parsed ?? {};
      const filled: string[] = Object.keys(p);
      setFilledFields(filled);
      setDraft({
        ...EMPTY,
        name: p.name ?? "",
        description: p.description ?? "",
        category: p.category ?? "",
        varietals: (p.varietals ?? []).join(", "),
        region: p.region ?? "",
        country: p.country ?? "",
        farm_name: p.farm_name ?? "",
        harvest_year: p.harvest_year?.toString() ?? "",
        intensity: p.intensity ?? "",
        flavor_tags: p.flavor_tags ?? [],
        tasting_notes: p.tasting_notes ?? "",
        pairings: (p.pairings ?? []).join(", "),
        fruitiness: p.fruitiness?.toString() ?? "",
        bitterness: p.bitterness?.toString() ?? "",
        pungency: p.pungency?.toString() ?? "",
        polyphenols_ppm: p.polyphenols_ppm?.toString() ?? "",
        size_ml: p.size_ml?.toString() ?? "",
        packaging: p.packaging ?? "",
        price_usd: p.price_usd?.toString() ?? "",
        buy_url: p.buy_url ?? "",
        image_url: "",
        organic: !!p.organic,
        awards: p.awards ?? "",
        acidity: p.acidity ?? "",
      });
      setStep("review");
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Parsing failed");
    } finally {
      setParsing(false);
    }
  }

  function toggleTag(tag: string) {
    setDraft((d) => ({
      ...d,
      flavor_tags: d.flavor_tags.includes(tag)
        ? d.flavor_tags.filter((t) => t !== tag)
        : [...d.flavor_tags, tag],
    }));
  }

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      if (!draft.name.trim()) throw new Error("Product name is required.");
      const supabase = getSupabase();
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }
      const row = {
        producer_id: user.id,
        status: "pending", // every save goes to the curator for review/certification
        name: draft.name.trim(),
        description: draft.description.trim() || null,
        category: draft.category || null,
        varietals: list(draft.varietals),
        region: draft.region.trim() || null,
        country: draft.country.trim() || null,
        farm_name: draft.farm_name.trim() || null,
        harvest_year: num(draft.harvest_year),
        intensity: draft.intensity || null,
        flavor_tags: draft.flavor_tags,
        tasting_notes: draft.tasting_notes.trim() || null,
        pairings: list(draft.pairings),
        fruitiness: num(draft.fruitiness),
        bitterness: num(draft.bitterness),
        pungency: num(draft.pungency),
        polyphenols_ppm: num(draft.polyphenols_ppm),
        size_ml: num(draft.size_ml),
        packaging: draft.packaging || null,
        price_usd: num(draft.price_usd),
        buy_url: draft.buy_url.trim() || null,
        image_url: draft.image_url.trim() || null,
        organic: draft.organic,
        awards: draft.awards.trim() || null,
        acidity: draft.acidity.trim() || null,
      };
      const { error } = editId
        ? await supabase.from("products").update(row).eq("id", editId)
        : await supabase.from("products").insert(row);
      if (error) throw error;
      router.push("/dashboard");
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  const wasFilled = (key: string) =>
    filledFields.includes(key) ? " ring-1 ring-gold/60 border-gold/60" : "";

  if (step === "paste") {
    return (
      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="mb-2 font-serif text-3xl font-bold text-olive-900">
          Add a product
        </h1>
        <p className="mb-6 text-olive-600">
          <strong>Copy. Paste. Done.</strong> Grab the text from your website product
          page, tech sheet, or even the back label — paste it below and we&apos;ll fill
          in every field for you to review.
        </p>
        <textarea
          className="input min-h-64 font-mono text-xs"
          placeholder={`Paste anything, for example:\n\nNovello Robust Blend — 2025 Harvest\nOur signature early-harvest oil from Picual and Frantoio olives grown in our Sonoma groves. Bold and peppery with notes of fresh-cut grass, artichoke, and green almond. Acidity 0.18%. Gold medal, NYIOOC 2025.\n500ml — $32. Pairs beautifully with grilled steak and hearty soups.\nBuy at https://yourfarm.com/shop/novello`}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        {parseError && <p className="mt-2 text-sm text-red-700">{parseError}</p>}
        <div className="mt-4 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={runSmartPaste}
            disabled={parsing || pasteText.trim().length < 10}
          >
            {parsing ? "Reading your text…" : "✨ Smart Paste"}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setDraft(EMPTY);
              setFilledFields([]);
              setStep("review");
            }}
          >
            Fill the form manually instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <h1 className="mb-2 font-serif text-3xl font-bold text-olive-900">
        {editId ? "Edit product" : "Review your product"}
      </h1>
      {!editId && filledFields.length > 0 && (
        <p className="mb-6 text-olive-600">
          We filled <strong>{filledFields.length}</strong> fields from your paste
          (highlighted in gold). Check them, tweak anything, and save.
        </p>
      )}
      <div className="space-y-6 rounded-2xl border border-olive-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Product name *</label>
            <input
              className={"input" + wasFilled("name")}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              className={"input min-h-20" + wasFilled("description")}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Varietals (comma-separated)</label>
            <input
              className={"input" + wasFilled("varietals")}
              placeholder="Picual, Arbequina"
              value={draft.varietals}
              onChange={(e) => setDraft({ ...draft, varietals: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Harvest year</label>
            <input
              className={"input" + wasFilled("harvest_year")}
              inputMode="numeric"
              value={draft.harvest_year}
              onChange={(e) => setDraft({ ...draft, harvest_year: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Region</label>
            <input
              className={"input" + wasFilled("region")}
              value={draft.region}
              onChange={(e) => setDraft({ ...draft, region: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Country</label>
            <input
              className={"input" + wasFilled("country")}
              value={draft.country}
              onChange={(e) => setDraft({ ...draft, country: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className={"input" + wasFilled("category")}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              <option value="">—</option>
              {Array.from(new Set([...CATEGORIES, ...(draft.category ? [draft.category] : [])])).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="label">Farm / estate</label>
            <input
              className={"input" + wasFilled("farm_name")}
              value={draft.farm_name}
              onChange={(e) => setDraft({ ...draft, farm_name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Intensity</label>
          <div className="flex flex-wrap gap-2">
            {INTENSITIES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDraft({ ...draft, intensity: draft.intensity === i ? "" : i })}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition " +
                  (draft.intensity === i
                    ? "border-olive-700 bg-olive-700 text-white"
                    : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
                }
                title={INTENSITY_LABELS[i]}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Flavor tags</label>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set([...FLAVOR_TAGS, ...draft.flavor_tags])).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={
                  "rounded-full border px-3 py-1 text-xs transition " +
                  (draft.flavor_tags.includes(tag)
                    ? "border-olive-700 bg-olive-700 text-white"
                    : "border-olive-300 bg-white text-olive-700 hover:bg-olive-50")
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Tasting notes</label>
          <textarea
            className={"input min-h-20" + wasFilled("tasting_notes")}
            value={draft.tasting_notes}
            onChange={(e) => setDraft({ ...draft, tasting_notes: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(["fruitiness", "bitterness", "pungency"] as const).map((k) => (
            <div key={k}>
              <label className="label capitalize">
                {k} {draft[k] && `(${draft[k]}/10)`}
              </label>
              <input
                type="range"
                min={0}
                max={10}
                className="w-full accent-olive-700"
                value={draft[k] === "" ? 0 : Number(draft[k])}
                onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Food pairings (comma-separated)</label>
            <input
              className={"input" + wasFilled("pairings")}
              placeholder="grilled fish, burrata, crusty bread"
              value={draft.pairings}
              onChange={(e) => setDraft({ ...draft, pairings: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Awards</label>
            <input
              className={"input" + wasFilled("awards")}
              value={draft.awards}
              onChange={(e) => setDraft({ ...draft, awards: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Bottle size (ml)</label>
            <input
              className={"input" + wasFilled("size_ml")}
              inputMode="numeric"
              value={draft.size_ml}
              onChange={(e) => setDraft({ ...draft, size_ml: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Packaging</label>
            <select
              className={"input" + wasFilled("packaging")}
              value={draft.packaging}
              onChange={(e) => setDraft({ ...draft, packaging: e.target.value })}
            >
              <option value="">—</option>
              {Array.from(
                new Set([...PACKAGING_OPTIONS, ...(draft.packaging ? [draft.packaging] : [])])
              ).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Price (USD)</label>
            <input
              className={"input" + wasFilled("price_usd")}
              inputMode="decimal"
              value={draft.price_usd}
              onChange={(e) => setDraft({ ...draft, price_usd: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Acidity</label>
            <input
              className={"input" + wasFilled("acidity")}
              placeholder="0.2%"
              value={draft.acidity}
              onChange={(e) => setDraft({ ...draft, acidity: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Polyphenols (mg/kg)</label>
            <input
              className={"input" + wasFilled("polyphenols_ppm")}
              inputMode="numeric"
              placeholder="e.g. 350"
              value={draft.polyphenols_ppm}
              onChange={(e) => setDraft({ ...draft, polyphenols_ppm: e.target.value })}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-olive-800">
              <input
                type="checkbox"
                className="h-4 w-4 accent-olive-700"
                checked={draft.organic}
                onChange={(e) => setDraft({ ...draft, organic: e.target.checked })}
              />
              Certified organic
            </label>
          </div>
          <div>
            <label className="label">Buy link (your shop URL)</label>
            <input
              className={"input" + wasFilled("buy_url")}
              placeholder="https://yourfarm.com/shop/…"
              value={draft.buy_url}
              onChange={(e) => setDraft({ ...draft, buy_url: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Image URL (bottle photo)</label>
            <input
              className="input"
              placeholder="https://…/bottle.jpg"
              value={draft.image_url}
              onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
            />
          </div>
        </div>

        {saveError && <p className="text-sm text-red-700">{saveError}</p>}
        <p className="text-sm text-olive-500">
          Saved oils are reviewed by our curator before going live — certified listings
          get the ✓ Certified badge.
        </p>
        <div className="flex gap-3">
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Submit for certification"}
          </button>
          {!editId && (
            <button className="btn-secondary" onClick={() => setStep("paste")}>
              ← Back to paste
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense>
      <NewProductForm />
    </Suspense>
  );
}
