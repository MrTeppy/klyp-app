"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppHeader({ subtitle = "KLYP" }: { subtitle?: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="mb-10 flex items-center justify-between rounded-full border border-black/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
          K
        </div>
        <div>
          <div className="text-sm font-semibold">KLYP</div>
          <div className="text-xs text-black/45">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-black/65 transition hover:bg-black/5">
          Home
        </Link>

        <Link href="/feed" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-black/65 transition hover:bg-black/5">
          Feed
        </Link>

        <Link href="/profile" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-black/65 transition hover:bg-black/5">
          Profile
        </Link>

        <Link href="/search" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-black/65 transition hover:bg-black/5">
          Search
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-black/65 transition hover:bg-black/5"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Account
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
