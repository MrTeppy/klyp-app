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
    <main className="min-h-screen bg-[#f5f1e8] text-[#151515]">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Profile" />

        {!loaded ? (
          <div className="rounded-[32px] border border-black/10 bg-white/88 p-8 shadow-sm">
            <p className="text-black/60">Loading profile…</p>
          </div>
        ) : user ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <section className="space-y-6">
              <div className="rounded-[32px] border border-black/10 bg-white/88 p-8 shadow-sm backdrop-blur">
                <div className="text-[12px] uppercase tracking-[0.18em] text-black/35">
                  Account
                </div>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                  Your Profile
                </h1>
                <p className="mt-3 text-black/60">
                  Signed in as{" "}
                  <span className="font-medium text-black">{user.email}</span>
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-[#faf8f4] p-5">
                    <div className="text-[13px] text-black/45">Current Atmosphere</div>
                    <div className="mt-2 text-[17px] font-medium">
                      Late Train / City Lights
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#faf8f4] p-5">
                    <div className="text-[13px] text-black/45">Most Replayed Mood</div>
                    <div className="mt-2 text-[17px] font-medium">
                      Quiet Replay / Grey Glow
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#faf8f4] p-5">
                    <div className="text-[13px] text-black/45">Profile Type</div>
                    <div className="mt-2 text-[17px] font-medium">
                      Friends-first
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-black/10 bg-white/88 p-8 shadow-sm backdrop-blur">
                <div className="text-[12px] uppercase tracking-[0.18em] text-black/35">
                  Settings
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-[20px] bg-[#faf8f4] p-4">
                    <div>
                      <div className="text-[15px] font-medium">Theme</div>
                      <div className="text-[13px] text-black/50">Light mode for now</div>
                    </div>
                    <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/65">
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-[20px] bg-[#faf8f4] p-4">
                    <div>
                      <div className="text-[15px] font-medium">Privacy</div>
                      <div className="text-[13px] text-black/50">Friends can klyp your posts</div>
                    </div>
                    <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/65">
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-[20px] bg-[#faf8f4] p-4">
                    <div>
                      <div className="text-[15px] font-medium">Sound Preferences</div>
                      <div className="text-[13px] text-black/50">Music-first posts enabled</div>
                    </div>
                    <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/65">
                      Adjust
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside>
              <SpotifyInsights />
            </aside>
          </div>
        ) : (
          <div className="rounded-[32px] border border-black/10 bg-white/88 p-8 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.18em] text-black/35">
              Profile
            </div>
            <h1 className="mt-3 text-3xl font-semibold">You’re not logged in</h1>
            <p className="mt-3 text-black/60">
              Log in first, then your profile and Spotify cards will appear here.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/login"
                className="rounded-full bg-black px-5 py-3 text-sm text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-black/70"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
