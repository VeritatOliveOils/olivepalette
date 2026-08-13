"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function Nav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setLoggedIn(!!session)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-olive-200 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl font-bold text-olive-800">
          🫒 Veritat
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-olive-700">
          <Link href="/discover" className="hover:text-olive-950">
            Discover
          </Link>
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary !py-1.5">
              My Products
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-olive-950">
                Log in
              </Link>
              <Link href="/login?mode=signup" className="btn-primary !py-1.5">
                For Producers
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
