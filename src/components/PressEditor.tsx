"use client";

import type { PressItem } from "@/lib/types";

interface Props {
  press: PressItem[];
  onChange: (press: PressItem[]) => void;
}

const EMPTY: PressItem = {
  outlet: "",
  title: "",
  date: "",
  url: "",
  verified: false,
};

export default function PressEditor({ press, onChange }: Props) {
  const update = (i: number, patch: Partial<PressItem>) =>
    onChange(press.map((p, idx) => (idx === i ? { ...p, ...patch, verified: false } : p)));

  return (
    <div>
      <label className="label">Press &amp; features</label>
      <p className="mb-3 text-xs text-olive-500">
        Articles, interviews, podcasts or videos about your farm or your oil. Add the link
        so we can check it — verified pieces show a ✓ on your profile.
      </p>

      <div className="space-y-3">
        {press.map((p, i) => (
          <div key={i} className="rounded-xl border border-olive-200 bg-olive-50/60 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label !mb-1">Publication</label>
                <input
                  className="input"
                  placeholder="e.g. Olive Oil Times"
                  value={p.outlet}
                  onChange={(e) => update(i, { outlet: e.target.value })}
                />
              </div>
              <div>
                <label className="label !mb-1">Date (optional)</label>
                <input
                  className="input"
                  placeholder="March 2026"
                  value={p.date ?? ""}
                  onChange={(e) => update(i, { date: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label !mb-1">Headline (optional)</label>
                <input
                  className="input"
                  placeholder="Title of the article or video"
                  value={p.title ?? ""}
                  onChange={(e) => update(i, { title: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label !mb-1">Link *</label>
                <input
                  className="input"
                  placeholder="https://…"
                  value={p.url ?? ""}
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {p.verified ? (
                <span className="tag !bg-olive-800 !text-white">✓ verified</span>
              ) : (
                <span className="text-xs text-olive-500">Awaiting verification</span>
              )}
              <button
                type="button"
                className="text-xs font-medium text-red-700 hover:underline"
                onClick={() => onChange(press.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-secondary mt-3 !py-1.5"
        onClick={() => onChange([...press, { ...EMPTY }])}
      >
        + Add press coverage
      </button>
    </div>
  );
}
