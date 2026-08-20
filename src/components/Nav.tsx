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
    <header className="sticky top-0 z-40 border-b border-olive-200/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-2xl font-bold tracking-tight text-olive-900 group-hover:text-olive-700">
            Veritat
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-olive-500">
            The Olive Oil Buyer&apos;s Guide
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-olive-700">
          <Link href="/discover" className="hover:text-olive-950">
            Discover
          </Link>
          <Link href="/producers" className="hover:text-olive-950">
            Producers
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
