"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface Props {
  /** Where on the site this form sits — helps you see what converts. */
  source: string;
  variant?: "panel" | "inline";
  heading?: string;
  blurb?: string;
}

export default function NewsletterSignup({
  source,
  variant = "panel",
  heading = "The Olive Vine",
  blurb = "New harvests, producer stories, and how to spot a bottle worth buying. A few times a month, never spam.",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("saving");
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("subscribers").insert({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        source,
      });
      // 23505 = already on the list; treat that as success, not failure
      if (error && error.code !== "23505") throw error;
      setState("done");
      setMessage(
        error?.code === "23505"
          ? "You're already on the list — lovely to have you."
          : "Welcome to The Olive Vine 🫒"
      );
    } catch {
      setState("error");
      setMessage("Something went wrong. Try again in a moment?");
    }
  }

  if (state === "done") {
    return (
      <div
        className={
          variant === "panel"
            ? "card p-7 text-center"
            : "rounded-xl border border-olive-200 bg-white p-5 text-center"
        }
      >
        <p className="text-2xl">🫒</p>
        <p className="mt-2 font-serif text-xl font-bold text-olive-900">{message}</p>
        <p className="mt-1 text-sm text-olive-600">
          Look out for the next issue — and reply any time, I read everything.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        variant === "panel"
          ? "card p-7"
          : "rounded-xl border border-olive-200 bg-white p-5"
      }
    >
      <h3 className="font-serif text-2xl font-bold text-olive-900">{heading}</h3>
      <p className="mt-1 text-sm leading-relaxed text-olive-600">{blurb}</p>

      <form onSubmit={subscribe} className="mt-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input sm:max-w-[10rem]"
            placeholder="First name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-primary shrink-0" disabled={state === "saving"}>
            {state === "saving" ? "One moment…" : "Subscribe"}
          </button>
        </div>
        {state === "error" && <p className="text-sm text-red-700">{message}</p>}
        <p className="text-xs text-olive-500">
          No spam, ever. Unsubscribe with one click. We never sell or share your email.
        </p>
      </form>
    </div>
  );
}
