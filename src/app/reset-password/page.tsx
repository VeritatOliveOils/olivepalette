"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

/** Landing page for the "set your password" email link. */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    // The client reads the token from the link automatically.
    supabase.auth.getSession().then(({ data }) => data.session && setReady(true));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady(true);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Use at least 6 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    const { error } = await getSupabase().auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-olive-200 bg-white p-8">
      <h1 className="mb-1 font-serif text-2xl font-bold text-olive-900">Set your password</h1>
      {!ready ? (
        <p className="text-sm text-olive-600">
          Open this page from the link in your email. If the link has expired, go to the
          login page and click &ldquo;Forgot password?&rdquo; again.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="label">New password</label>
            <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Repeat password</label>
            <input className="input" type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "One moment…" : "Save password and continue"}
          </button>
        </form>
      )}
    </div>
  );
}
