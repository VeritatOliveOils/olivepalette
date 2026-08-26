"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Faq from "@/components/Faq";
import { PRODUCER_FAQ } from "@/lib/faq-content";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [producerName, setProducerName] = useState("");
  const [joinNewsletter, setJoinNewsletter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = getSupabase();
    try {
      if (mode === "signup") {
        if (!producerName.trim()) throw new Error("Please enter your producer/brand name.");
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Opt-in newsletter signup — separate from the account itself
        if (joinNewsletter) {
          const { error: subErr } = await supabase.from("subscribers").insert({
            email: email.trim().toLowerCase(),
            name: producerName.trim() || null,
            source: "producer-signup",
          });
          // 23505 just means they're already subscribed
          if (subErr && subErr.code !== "23505") {
            console.error("Newsletter signup failed:", subErr);
          }
        }
        if (data.user && data.session) {
          const { error: pErr } = await supabase
            .from("producers")
            .insert({ id: data.user.id, name: producerName.trim() });
          if (pErr && pErr.code !== "23505") throw pErr;
          router.push("/dashboard");
        } else {
          setError("Check your email to confirm your account, then log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-olive-200 bg-white p-8">
      <h1 className="mb-1 font-serif text-2xl font-bold text-olive-900">
        {mode === "signup" ? "Join as a Producer" : "Welcome back"}
      </h1>
      <p className="mb-6 text-sm text-olive-600">
        {mode === "signup"
          ? "List your oils in under a minute with Smart Paste."
          : "Log in to manage your products."}
      </p>
      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="label">Producer / brand name</label>
            <input
              className="input"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
              placeholder="e.g. Willow Creek Olive Estate"
            />
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode === "signup" && (
          <label className="flex items-start gap-2.5 rounded-xl bg-olive-50 p-3 text-sm text-olive-800">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-olive-700"
              checked={joinNewsletter}
              onChange={(e) => setJoinNewsletter(e.target.checked)}
            />
            <span>
              Send me <strong>The Olive Vine</strong> — harvest news, producer stories and
              buying advice, a few times a month.
            </span>
          </label>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "One moment…" : mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>
      <button
        className="mt-4 w-full text-center text-sm text-olive-600 hover:text-olive-900"
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
      >
        {mode === "signup"
          ? "Already have an account? Log in"
          : "New producer? Create an account"}
      </button>
    </div>

    {mode === "signup" && (
      <section className="mx-auto mt-12 max-w-2xl">
        <h2 className="mb-4 text-center font-serif text-2xl font-bold text-olive-900">
          Before you join
        </h2>
        <Faq items={PRODUCER_FAQ.slice(0, 5)} />
        <p className="mt-4 text-center text-sm text-olive-600">
          <Link href="/example" className="font-semibold underline">
            See what a finished listing looks like
          </Link>{" "}
          ·{" "}
          <Link href="/faq" className="font-semibold underline">
            All questions
          </Link>
        </p>
      </section>
    )}
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
