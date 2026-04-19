"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppHeader from "@/components/AppHeader";
import SpotifyInsights from "@/components/SpotifyInsights";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoaded(true);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#efe9df] text-[#171717]">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
        <AppHeader subtitle="Profile" />

        {!loaded ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-black/60">Loading profile…</p>
          </div>
        ) : user ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-6">
              <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
                <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Account</div>
                <h1 className="mt-3 text-3xl font-semibold">Your Profile</h1>
                <p className="mt-3 text-black/60">
                  Signed in as <span className="font-medium text-black">{user.email}</span>
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-[#f8f5ef] p-5">
                    <div className="text-[13px] text-black/45">Current Atmosphere</div>
                    <div className="mt-2 text-[18px] font-medium">Late Train / City Lights</div>
                  </div>
                  <div className="rounded-[24px] bg-[#f8f5ef] p-5">
                    <div className="text-[13px] text-black/45">Most Replayed Mood</div>
                    <div className="mt-2 text-[18px] font-medium">Quiet Replay / Grey Glow</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
                <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">KLYP+</div>
                <h2 className="mt-3 text-2xl font-semibold">Prototype Tier</h2>
                <p className="mt-3 max-w-xl text-black/60 leading-7">
                  Deeper mood summaries, stronger weekly recaps, and richer profile atmosphere.
                </p>
              </div>
            </section>

            <aside>
              <SpotifyInsights />
            </aside>
          </div>
        ) : (
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Profile</div>
            <h1 className="mt-3 text-3xl font-semibold">You’re not logged in</h1>
            <p className="mt-3 text-black/60">
              Log in first, then your profile and Spotify cards will appear here.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/login" className="rounded-full bg-black px-5 py-3 text-sm text-white">
                Log In
              </Link>
              <Link href="/signup" className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-black/70">
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


<div className="mt-8 rounded-2xl bg-white p-6 text-black">
  <div className="text-sm font-semibold mb-4">Settings</div>

  <div className="flex justify-between items-center mb-3">
    <span>Dark Mode</span>
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
      className="bg-black text-white px-3 py-1 rounded-full text-xs"
    >
      Toggle
    </button>
  </div>

  <div className="flex justify-between items-center">
    <span>Private Profile</span>
    <button className="border px-3 py-1 rounded-full text-xs">
      Off
    </button>
  </div>
</div>
