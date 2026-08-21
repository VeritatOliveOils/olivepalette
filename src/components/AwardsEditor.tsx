"use client";

import { AWARD_LEVELS, COMPETITIONS } from "@/lib/constants";
import type { Award } from "@/lib/types";

interface Props {
  awards: Award[];
  onChange: (awards: Award[]) => void;
}

const EMPTY_AWARD: Award = {
  competition: "",
  year: null,
  category: "",
  award: "",
  url: "",
  verified: false,
};

export default function AwardsEditor({ awards, onChange }: Props) {
  const update = (i: number, patch: Partial<Award>) =>
    onChange(awards.map((a, idx) => (idx === i ? { ...a, ...patch, verified: false } : a)));

  return (
    <div>
      <label className="label">Competition awards</label>
      <p className="mb-3 text-xs text-olive-500">
        Add a link to the result on the competition&apos;s own website so we can verify
        it. Verified awards get a ✓ on your listing — unverified ones are shown plainly.
      </p>

      <datalist id="competition-list">
        {COMPETITIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="award-level-list">
        {AWARD_LEVELS.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>

      <div className="space-y-3">
        {awards.map((a, i) => (
          <div key={i} className="rounded-xl border border-olive-200 bg-olive-50/60 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label !mb-1">Competition</label>
                <input
                  className="input"
                  list="competition-list"
                  placeholder="Start typing — e.g. NYIOOC"
                  value={a.competition}
                  onChange={(e) => update(i, { competition: e.target.value })}
                />
              </div>
              <div>
                <label className="label !mb-1">Year</label>
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="2026"
                  value={a.year ?? ""}
                  onChange={(e) =>
                    update(i, {
                      year: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div>
                <label className="label !mb-1">Award</label>
                <input
                  className="input"
                  list="award-level-list"
                  placeholder="Gold, Silver, 3 stars…"
                  value={a.award ?? ""}
                  onChange={(e) => update(i, { award: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label !mb-1">Category / class (optional)</label>
                <input
                  className="input"
                  placeholder="e.g. Robust · Picual · Spain"
                  value={a.category ?? ""}
                  onChange={(e) => update(i, { category: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label !mb-1">Link to the result *</label>
                <input
                  className="input"
                  placeholder="https://competition-website.com/results/…"
                  value={a.url ?? ""}
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {a.verified ? (
                <span className="tag !bg-olive-800 !text-white">✓ verified</span>
              ) : (
                <span className="text-xs text-olive-500">
                  Awaiting verification by the curator
                </span>
              )}
              <button
                type="button"
                className="text-xs font-medium text-red-700 hover:underline"
                onClick={() => onChange(awards.filter((_, idx) => idx !== i))}
              >
                Remove award
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-secondary mt-3 !py-1.5"
        onClick={() => onChange([...awards, { ...EMPTY_AWARD }])}
      >
        + Add an award
      </button>
    </div>
  );
}
