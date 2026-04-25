"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoaded(true);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#111]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-5">

        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111] text-2xl font-bold text-[#d7a96b] shadow-md">
              K
            </div>
            <div className="tracking-[0.45em] text-lg font-semibold">KLYP</div>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="rounded-full border border-[#e0d6ca] bg-[#fffaf3] px-5 py-2 text-sm font-medium text-[#111] shadow-sm active:opacity-70"
            >
              Log Out
            </button>
          )}
        </header>

        {!loaded ? (
          <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-6">
            <p className="text-sm text-[#82766b]">Loading…</p>
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* Avatar + name */}
            <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-6 shadow-[0_12px_35px_rgba(55,39,20,0.08)]">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#d7a96b] to-[#111]" />
                <div>
                  <p className="text-lg font-semibold">{user.email?.split("@")[0]}</p>
                  <p className="text-sm text-[#82766b]">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-[20px] bg-[#f4efe8] p-3">
                  <div className="text-xl font-semibold">12</div>
                  <div className="text-xs text-[#82766b]">Posts</div>
                </div>
                <div className="rounded-[20px] bg-[#f4efe8] p-3">
                  <div className="text-xl font-semibold">48</div>
                  <div className="text-xs text-[#82766b]">Friends</div>
                </div>
                <div className="rounded-[20px] bg-[#f4efe8] p-3">
                  <div className="text-xl font-semibold">31</div>
                  <div className="text-xs text-[#82766b]">Klyps</div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-5 shadow-[0_12px_35px_rgba(55,39,20,0.08)]">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#82766b]">Settings</p>

              {[
                { label: "Spotify", sub: "Connect your listening" },
                { label: "Privacy", sub: "Friends can Klyp your posts" },
                { label: "Sound Preferences", sub: "Music-first posts enabled" },
              ].map((item) => (
                <div key={item.label} className="mt-3 flex items-center justify-between rounded-[20px] bg-[#f4efe8] p-4">
                  <div>
                    <div className="text-[15px] font-medium">{item.label}</div>
                    <div className="text-xs text-[#82766b]">{item.sub}</div>
                  </div>
                  <button
                    onClick={() => item.label === "Spotify" ? router.push("/spotify") : null}
                    className="rounded-full border border-[#e0d6ca] bg-white px-4 py-2 text-xs text-[#82766b] active:opacity-70"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-6 shadow-[0_12px_35px_rgba(55,39,20,0.08)]">
            <h1 className="text-2xl font-semibold">Not logged in</h1>
            <p className="mt-2 text-sm text-[#82766b]">Log in to see your profile.</p>
            <div className="mt-5 flex gap-3">
              <Link href="/login" className="rounded-full bg-[#111] px-5 py-2 text-sm text-white">Log In</Link>
              <Link href="/signup" className="rounded-full border border-[#e0d6ca] bg-white px-5 py-2 text-sm text-[#111]">Sign Up</Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#ded2c5] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md justify-around px-6 py-4 text-sm">
          <button onClick={() => router.push("/")} className="text-[#82766b]">Home</button>
          <button onClick={() => router.push("/search")} className="text-[#82766b]">Explore</button>
          <button onClick={() => router.push("/upload")} className="rounded-full bg-[#111] px-5 py-2 text-white active:opacity-70">+</button>
          <button onClick={() => router.push("/feed")} className="text-[#82766b]">Feed</button>
          <button className="font-medium text-[#111]">Profile</button>
        </div>
      </div>
    </main>
  );
}
