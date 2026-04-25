"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AppHeader({ subtitle = "Your Space" }: { subtitle?: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="mb-6 rounded-[24px] border border-black/10 bg-white/85 px-4 py-3 shadow-sm backdrop-blur sm:mb-10 sm:rounded-full sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/feed" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
            K
          </div>
          <div>
            <div className="text-sm font-semibold">KLYP</div>
            <div className="text-xs text-black/45">{subtitle}</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/" className="rounded-full px-4 py-2 text-sm text-black/65 hover:bg-black/5">
            Home
          </Link>

          <Link href="/feed" className="rounded-full px-4 py-2 text-sm text-black/65 hover:bg-black/5">
            Feed
          </Link>

          <Link href="/search" className="rounded-full px-4 py-2 text-sm text-black/65 hover:bg-black/5">
            Explore
          </Link>

          <Link href="/profile" className="rounded-full px-4 py-2 text-sm text-black/65 hover:bg-black/5">
            Profile
          </Link>

          <Link href="/upload" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            + Post
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/65 hover:bg-black/5"
            >
              Log Out
            </button>
          ) : (
            <Link href="/login" className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/65 hover:bg-black/5">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
