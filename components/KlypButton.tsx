"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function KlypButton({ postSlug }: { postSlug: string }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  async function loadCount() {
    const { count } = await supabase
      .from("klyps")
      .select("*", { count: "exact", head: true })
      .eq("post_slug", postSlug);

    setCount(count || 0);
  }

  useEffect(() => {
    loadCount();
  }, [postSlug]);

  async function handleKlyp() {
    setStatus("Adding…");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first");
      return;
    }

    const { error } = await supabase.from("klyps").insert({
      post_slug: postSlug,
      user_id: user.id,
    });

    if (error) {
      setStatus("Could not add");
      return;
    }

    setStatus("Added");
    loadCount();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleKlyp}
        className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Add to Klyp
      </button>
      <span className="text-sm text-black/50">{count}</span>
      {status ? <span className="text-xs text-black/40">{status}</span> : null}
    </div>
  );
}
