"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  async function handleSearch() {
    setStatus("Searching...");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`)
      .limit(20);

    if (error) {
      setStatus(error.message);
      return;
    }

    setResults(data || []);
    setStatus("");
  }

  async function addFriend(receiverId: string) {
    const { data: userData } = await supabase.auth.getUser();
    const senderId = userData.user?.id;
    if (!senderId) {
      setStatus("Log in first.");
      return;
    }

    const { error } = await supabase.from("friend_requests").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });

    setStatus(error ? error.message : "Friend request sent.");
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Search" />

        <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
            Find People
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username..."
              className="flex-1 rounded-full border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
            />
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Search
            </button>
          </div>

          {status ? <p className="mt-4 text-sm text-black/55">{status}</p> : null}

          <div className="mt-6 space-y-3">
            {results.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-[22px] border border-black/10 bg-[#faf8f4] p-4"
              >
                <div>
                  <div className="text-[15px] font-medium">{user.display_name}</div>
                  <div className="text-[13px] text-black/55">@{user.username}</div>
                </div>
                <button
                  onClick={() => addFriend(user.id)}
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
