"use client";

import { useEffect, useState } from "react";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const [me, setMe] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    setMe(userData.user);

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, music, bio")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setPeople(profiles || []);

    if (userData.user) {
      const { data: friends } = await supabase
        .from("friendships")
        .select("*")
        .or(`requester_id.eq.${userData.user.id},addressee_id.eq.${userData.user.id}`);

      setFriendships(friends || []);
    }
  }

  function friendshipWith(id: string) {
    return friendships.find(
      (f) =>
        (f.requester_id === me?.id && f.addressee_id === id) ||
        (f.addressee_id === me?.id && f.requester_id === id)
    );
  }

  async function addFriend(id: string) {
    if (!me) {
      setStatus("Log in first.");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: me.id,
      addressee_id: id,
      status: "pending",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Friend request sent.");
    await load();
  }

  const filtered = people.filter((p) => {
    if (p.id === me?.id) return false;
    const q = query.toLowerCase().trim();
    const text = `${p.display_name || ""} ${p.username || ""} ${p.music || ""} ${p.bio || ""}`.toLowerCase();
    return !q || text.includes(q);
  });

  return (
    <RetroShell title="Search People" subtitle="find people to add">
      <div className="grid gap-2 md:grid-cols-[170px_1fr_220px]">
        <aside>
          <RetroBox title="Search By">
            <div className="text-[11px] text-[#555]">▸ Name / username</div>
            <div className="text-[11px] text-[#555]">▸ Favourite music</div>
            <div className="text-[11px] text-[#555]">▸ Bio</div>
          </RetroBox>
        </aside>

        <section>
          <RetroBox title="Find People">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search people..." className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

            {status ? <div className="mb-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[11px] text-[#557799]">{status}</div> : null}
            {!me ? <div className="mb-2 text-[11px] text-[#cc0000]">Log in to add friends.</div> : null}

            {filtered.length === 0 ? <div className="text-[#888]">No people found yet.</div> : null}

            {filtered.map((p) => {
              const f = friendshipWith(p.id);
              const label = f?.status === "accepted" ? "Friends" : f ? "Requested" : "Add Friend";

              return (
                <div key={p.id} className="mb-1 flex items-center gap-2 border border-[#dce8f5] bg-[#f8fcff] p-2">
                  <MiniAvatar label={p.display_name || p.username || "user"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[#1a4a99]">{p.display_name || p.username || "klyp user"}</div>
                    <div className="text-[11px] text-[#666]">@{p.username || p.id.slice(0, 6)}</div>
                    {p.music ? <div className="text-[10px] text-[#557799]">music: {p.music}</div> : null}
                  </div>
                  <RetroButton disabled={!me || !!f} onClick={() => addFriend(p.id)}>{label}</RetroButton>
                </div>
              );
            })}
          </RetroBox>
        </section>

        <aside>
          <RetroBox title="Tips">
            <p className="mb-1">Search real profiles from Supabase.</p>
            <p>Add Friend creates a Supabase friendship row.</p>
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
