"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  CATEGORIES,
  CURRENCIES,
  FLAVOR_TAGS,
  INTENSITIES,
  INTENSITY_LABELS,
  PACKAGING_OPTIONS,
} from "@/lib/constants";
import AwardsEditor from "@/components/AwardsEditor";
import type { Award, ParsedProduct } from "@/lib/types";

type Draft = {
  name: string;
  description: string;
  category: string;
  varietals: string;
  region: string;
  country: string;
  farm_name: string;
  harvest_year: string;
  harvest_date: string;
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
  currency: string;
  buy_url: string;
  image_url: string;
  organic: boolean;
  awards: string;
  awards_json: Award[];
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
  harvest_date: "",
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
  currency: "USD",
  buy_url: "",
  image_url: "",
  organic: false,
  awards: "",
  awards_json: [],
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
  const [fetchedFrom, setFetchedFrom] = useState<string | null>(null);
  const [fromLabel, setFromLabel] = useState(false);
  const [labelPhotos, setLabelPhotos] = useState<
    { media_type: string; data: string; preview: string }[]
  >([]);
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
          harvest_date: p.harvest_date ?? "",
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
          currency: p.currency ?? "USD",
          buy_url: p.buy_url ?? "",
          image_url: p.image_url ?? "",
          organic: !!p.organic,
          awards: p.awards ?? "",
          awards_json: (p.awards_json as Award[]) ?? [],
          acidity: p.acidity ?? "",
        });
      }
    })();
  }, [editId]);

  async function addLabelPhotos(files: FileList | null) {
    if (!files) return;
    const accepted = Array.from(files).slice(0, 3);
    const encoded = await Promise.all(
      accepted.map(
        (file) =>
          new Promise<{ media_type: string; data: string; preview: string } | null>(
            (resolve) => {
              if (file.size > 5 * 1024 * 1024) {
                resolve(null); // skip anything over 5MB
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const result = String(reader.result);
                const base64 = result.split(",")[1] ?? "";
                resolve({
                  media_type: file.type || "image/jpeg",
                  data: base64,
                  preview: result,
                });
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(file);
            }
          )
      )
    );
    const ok = encoded.filter(Boolean) as {
      media_type: string;
      data: string;
      preview: string;
    }[];
    if (ok.length < accepted.length) {
      setParseError("Some photos were skipped — each must be under 5MB.");
    }
    setLabelPhotos((prev) => [...prev, ...ok].slice(0, 3));
  }

  /** Read label photos and fill ONLY the fields still empty — never overwrite the producer. */
  async function readLabelIntoDraft() {
    if (labelPhotos.length === 0) return;
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
        body: JSON.stringify({
          images: labelPhotos.map(({ media_type, data }) => ({ media_type, data })),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Couldn't read that label");
      const p: ParsedProduct = body.parsed ?? {};

      const added: string[] = [];
      setDraft((d) => {
        const next = { ...d };
        const put = (key: keyof Draft, value: string | undefined) => {
          if (value && !String(next[key] ?? "").trim()) {
            (next[key] as string) = value;
            added.push(key);
          }
        };
        put("name", p.name);
        put("description", p.description);
        put("category", p.category);
        put("varietals", p.varietals?.join(", "));
        put("region", p.region);
        put("country", p.country);
        put("farm_name", p.farm_name);
        put("harvest_year", p.harvest_year?.toString());
        put("harvest_date", p.harvest_date);
        put("intensity", p.intensity);
        put("tasting_notes", p.tasting_notes);
        put("pairings", p.pairings?.join(", "));
        put("polyphenols_ppm", p.polyphenols_ppm?.toString());
        put("size_ml", p.size_ml?.toString());
        put("packaging", p.packaging);
        put("price_usd", p.price_usd?.toString());
        put("acidity", p.acidity);
        put("awards", p.awards);
        if (p.flavor_tags?.length && next.flavor_tags.length === 0) {
          next.flavor_tags = p.flavor_tags;
          added.push("flavor_tags");
        }
        if (p.organic && !next.organic) next.organic = true;
        return next;
      });

      setFilledFields((prev) => Array.from(new Set([...prev, ...added])));
      setFromLabel(true);
      if (added.length === 0) {
        setParseError(
          "We read the label but everything it showed is already filled in above."
        );
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Couldn't read that label");
    } finally {
      setParsing(false);
    }
  }

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
        body: JSON.stringify({
          text: pasteText,
          images: labelPhotos.map(({ media_type, data }) => ({ media_type, data })),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Parsing failed");
      const p: ParsedProduct = body.parsed ?? {};
      const filled: string[] = Object.keys(p);
      setFilledFields(filled);
      setFetchedFrom(body.fetchedFrom ?? null);
      setFromLabel(!!body.fromLabel);
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
        harvest_date: p.harvest_date ?? "",
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
        currency: p.currency ?? "USD",
        buy_url: p.buy_url ?? "",
        image_url: p.image_url ?? "",
        organic: !!p.organic,
        awards: p.awards ?? "",
        awards_json: (p.awards_json ?? []).map((a) => ({ ...a, verified: false })),
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
      const hy = num(draft.harvest_year);
      if (hy === null) {
        throw new Error(
          "Harvest year is required — Veritat does not certify oils without a stated harvest. A 'best by' date is not a harvest date."
        );
      }
      const thisYear = new Date().getFullYear();
      if (hy < 1990 || hy > thisYear + 1) {
        throw new Error(`Please check the harvest year — ${hy} doesn't look right.`);
      }
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
        harvest_date: draft.harvest_date.trim() || null,
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
        currency: draft.currency || "USD",
        buy_url: draft.buy_url.trim() || null,
        image_url: draft.image_url.trim() || null,
        organic: draft.organic,
        awards: draft.awards.trim() || null,
        awards_json: draft.awards_json.filter((a) => a.competition.trim()),
        acidity: draft.acidity.trim() || null,
      };
      const { error } = editId
        ? await supabase.from("products").update(row).eq("id", editId)
        : await supabase.from("products").insert(row);
      if (error) {
        // Supabase errors aren't Error instances — surface the real detail
        throw new Error(
          [error.message, error.details, error.hint].filter(Boolean).join(" · ") ||
            "The database refused the save."
        );
      }
      router.push("/dashboard");
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "message" in e
            ? String((e as { message: unknown }).message)
            : "Could not save."
      );
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
        <p className="mb-2 text-olive-600">
          <strong>Copy. Paste. Done.</strong> Paste the text from your website product
          page, tech sheet, or back label — or just paste the link to your product page
          and we&apos;ll read it for you.
        </p>
        <p className="mb-6 text-sm text-olive-500">
          We only fill in what your text actually says — never invented details. Anything
          we can&apos;t find, you add yourself.
        </p>
        <textarea
          className="input min-h-64 font-mono text-xs"
          placeholder={`Paste your product page text — or just its link, e.g. https://yourfarm.com/shop/novello\n\nExample text:\n\nNovello Robust Blend — 2025 Harvest\nOur signature early-harvest oil from Picual and Frantoio olives grown in our Sonoma groves. Bold and peppery with notes of fresh-cut grass, artichoke, and green almond. Acidity 0.18%. Gold medal, NYIOOC 2025.\n500ml — $32. Pairs beautifully with grilled steak and hearty soups.`}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <div className="mt-5 rounded-2xl border border-olive-200 bg-white p-5">
          <p className="font-semibold text-olive-900">
            📷 Or photograph your back label
          </p>
          <p className="mt-1 text-sm text-olive-600">
            The harvest date, acidity and polyphenols are usually printed on the bottle.
            Add up to 3 close-up photos and we&apos;ll read them straight off the label —
            any language.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              Add label photo
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addLabelPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {labelPhotos.map((p, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.preview}
                  alt={`Label ${i + 1}`}
                  className="h-16 w-16 rounded-lg border border-olive-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setLabelPhotos((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-olive-800 text-xs text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {parseError && <p className="mt-2 text-sm text-red-700">{parseError}</p>}
        <div className="mt-4 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={runSmartPaste}
            disabled={
              parsing || (pasteText.trim().length < 10 && labelPhotos.length === 0)
            }
          >
            {parsing
              ? labelPhotos.length > 0
                ? "Reading your label…"
                : "Reading your text…"
              : "✨ Smart Paste"}
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
          We filled <strong>{filledFields.length}</strong> fields
          {fromLabel
            ? " from your label photo"
            : fetchedFrom
              ? " from that page"
              : " from your paste"}{" "}
          (highlighted in gold).
          Please check every one against your own records before submitting — then tweak
          and save.
        </p>
      )}
      <div
        className={
          "mb-6 rounded-2xl border p-5 " +
          (draft.harvest_year.trim()
            ? "border-olive-200 bg-white"
            : "border-gold/60 bg-gold/10")
        }
      >
        <p className="font-semibold text-olive-900">
          📷 {draft.harvest_year.trim() ? "Read your label" : "Missing the harvest date?"}
        </p>
        <p className="mt-1 text-sm text-olive-600">
          {draft.harvest_year.trim()
            ? "Add close-ups of the label and we'll fill any details still blank — we never overwrite what you've already entered."
            : "Harvest year is required for certification. It's almost always printed on the back label — photograph it and we'll read it for you."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="btn-secondary cursor-pointer">
            Add label photo
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addLabelPhotos(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          {labelPhotos.map((p, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.preview}
                alt={`Label ${i + 1}`}
                className="h-16 w-16 rounded-lg border border-olive-200 object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setLabelPhotos((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-olive-800 text-xs text-white"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
          {labelPhotos.length > 0 && (
            <button
              type="button"
              className="btn-primary !py-1.5"
              onClick={readLabelIntoDraft}
              disabled={parsing}
            >
              {parsing ? "Reading label…" : "✨ Fill blanks from label"}
            </button>
          )}
        </div>
        {parseError && <p className="mt-2 text-sm text-red-700">{parseError}</p>}
      </div>

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
            <label className="label">Harvest year * (required for certification)</label>
            <input
              className={"input" + wasFilled("harvest_year")}
              inputMode="numeric"
              placeholder="e.g. 2025"
              value={draft.harvest_year}
              onChange={(e) => setDraft({ ...draft, harvest_year: e.target.value })}
            />
            <p className="mt-1 text-xs text-olive-500">
              The year the olives were milled — not a &quot;best by&quot; date.
            </p>
          </div>
          <div>
            <label className="label">
              Harvest month / day — add if printed on the label
            </label>
            <input
              className={"input" + wasFilled("harvest_date")}
              placeholder="e.g. November 2025, or 12 Nov 2025"
              value={draft.harvest_date}
              onChange={(e) => setDraft({ ...draft, harvest_date: e.target.value })}
            />
            <p className="mt-1 text-xs text-olive-500">
              Buyers love precision — it shows the oil is fresh.
            </p>
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
            <label className="label">Other recognition (optional, free text)</label>
            <input
              className={"input" + wasFilled("awards")}
              placeholder="Anything without a link"
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
            <label className="label">Price</label>
            <div className="flex gap-2">
              <select
                className="input !w-28"
                value={draft.currency}
                onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <input
                className={"input" + wasFilled("price_usd")}
                inputMode="decimal"
                placeholder="49.50"
                value={draft.price_usd}
                onChange={(e) => setDraft({ ...draft, price_usd: e.target.value })}
              />
            </div>
            <p className="mt-1 text-xs text-olive-500">
              Price it in your own currency — buyers see it as you sell it.
            </p>
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
            <label className="label">Bottle photo (image link)</label>
            <input
              className={"input" + wasFilled("image_url")}
              placeholder="https://…/bottle.jpg"
              value={draft.image_url}
              onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
            />
            {draft.image_url ? (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.image_url}
                  alt="Bottle preview"
                  className="h-20 w-20 rounded-lg border border-olive-200 object-cover"
                />
                <button
                  type="button"
                  className="text-xs text-olive-600 underline"
                  onClick={() => setDraft({ ...draft, image_url: "" })}
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <p className="mt-1 text-xs text-olive-500">
                Right-click any photo on your website → &quot;Copy Image Address&quot; →
                paste here.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-olive-100 pt-6">
          <AwardsEditor
            awards={draft.awards_json}
            onChange={(awards_json) => setDraft({ ...draft, awards_json })}
          />
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
