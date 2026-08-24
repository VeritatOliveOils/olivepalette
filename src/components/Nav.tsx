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
    <header className="sticky top-0 z-40 border-b border-olive-200/70 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <Link href="/" className="group shrink-0 leading-none">
          <span className="block font-serif text-xl font-bold tracking-tight text-olive-900 group-hover:text-olive-700 sm:text-2xl">
            Veritat
          </span>
          {/* Strapline is decorative — hidden on small screens to protect tap targets */}
          <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-olive-500 sm:block">
            The Olive Oil Buyer&apos;s Guide
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-olive-700 sm:gap-5">
          <Link
            href="/discover"
            className="flex min-h-11 items-center px-1 hover:text-olive-950"
          >
            Oils
          </Link>
          <Link
            href="/producers"
            className="flex min-h-11 items-center px-1 hover:text-olive-950"
          >
            Producers
          </Link>
          <Link
            href="/journal"
            className="hidden min-h-11 items-center px-1 hover:text-olive-950 sm:flex"
          >
            Journal
          </Link>
          <Link
            href="/faq"
            className="hidden min-h-11 items-center px-1 hover:text-olive-950 sm:flex"
          >
            Guide
          </Link>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="btn-primary min-h-11 !px-4 !py-2 !text-xs sm:!px-6 sm:!text-sm"
            >
              My&nbsp;Oils
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-11 items-center px-1 hover:text-olive-950 sm:flex"
              >
                Log in
              </Link>
              <Link
                href="/login?mode=signup"
                className="btn-primary min-h-11 !px-4 !py-2 !text-xs sm:!px-6 sm:!text-sm"
              >
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">For Producers</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
