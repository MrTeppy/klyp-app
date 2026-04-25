"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("Searching...");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`)
      .limit(20);

    if (error) { setStatus(error.message); return; }
    setResults(data || []);
    setStatus(data?.length === 0 ? "No results." : "");
  }

  async function addFriend(receiverId: string) {
    const { data: userData } = await supabase.auth.getUser();
    const senderId = userData.user?.id;
    if (!senderId) { setStatus("Log in first."); return; }

    const { error } = await supabase.from("friend_requests").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });

    setStatus(error ? error.message : "Friend request sent.");
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
        </header>

        <section className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-5 shadow-[0_12px_35px_rgba(55,39,20,0.08)]">
          <p className="text-[12px] uppercase tracking-[0.16em] text-[#82766b]">Find People</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Search</h1>

          <div className="mt-4 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search username..."
              className="flex-1 rounded-full border border-[#e0d6ca] bg-[#f4efe8] px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={handleSearch}
              className="rounded-full bg-[#111] px-5 py-3 text-sm font-medium text-white active:opacity-70"
            >
              Go
            </button>
          </div>

          {status ? <p className="mt-3 text-sm text-[#82766b]">{status}</p> : null}

          <div className="mt-4 space-y-3">
            {results.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-[20px] bg-[#f4efe8] p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d7a96b] to-[#111]" />
                  <div>
                    <div className="text-[15px] font-medium">{user.display_name}</div>
                    <div className="text-xs text-[#82766b]">@{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => addFriend(user.id)}
                  className="rounded-full bg-[#111] px-4 py-2 text-xs font-medium text-white active:opacity-70"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#ded2c5] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md justify-around px-6 py-4 text-sm">
          <button onClick={() => router.push("/")} className="text-[#82766b]">Home</button>
          <button className="font-medium text-[#111]">Explore</button>
          <button onClick={() => router.push("/upload")} className="rounded-full bg-[#111] px-5 py-2 text-white active:opacity-70">+</button>
          <button onClick={() => router.push("/feed")} className="text-[#82766b]">Feed</button>
          <button onClick={() => router.push("/profile")} className="text-[#82766b]">Profile</button>
        </div>
      </div>
    </main>
  );
}
