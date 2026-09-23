"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function FriendsPage() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    setMe(userData.user);

    if (!userData.user) {
      setStatus("Log in to see friends.");
      return;
    }

    const { data, error } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${userData.user.id},addressee_id.eq.${userData.user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const rows = data || [];
    setFriendships(rows);

    const ids = Array.from(
      new Set(
        rows
          .flatMap((f: any) => [f.requester_id, f.addressee_id])
          .filter((id: string) => id !== userData.user.id)
      )
    );

    if (ids.length) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name, music")
        .in("id", ids);

      const map: Record<string, any> = {};
      (profileData || []).forEach((p: any) => (map[p.id] = p));
      setProfiles(map);
    } else {
      setProfiles({});
    }

    setStatus("");
  }

  async function accept(id: string) {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) setStatus(error.message);
    else await load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("friendships").delete().eq("id", id);

    if (error) setStatus(error.message);
    else await load();
  }

  function otherId(f: any) {
    return f.requester_id === me?.id ? f.addressee_id : f.requester_id;
  }

  const accepted = friendships.filter((f) => f.status === "accepted");
  const incoming = friendships.filter((f) => f.status === "pending" && f.addressee_id === me?.id);
  const outgoing = friendships.filter((f) => f.status === "pending" && f.requester_id === me?.id);

  function Row({ f, mode }: { f: any; mode: "friend" | "incoming" | "outgoing" }) {
    const id = otherId(f);
    const p = profiles[id];

    return (
      <div
        onClick={() => router.push(`/profile/${id}`)}
        className="mb-1 flex cursor-pointer items-center gap-2 border border-[#dce8f5] bg-[#f8fcff] p-2 hover:bg-[#f0f6fc]"
      >
        <MiniAvatar label={p?.display_name || p?.username || "user"} />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold text-[#1a4a99]">
            {p?.display_name || p?.username || `user.${id.slice(0, 4)}`}
          </div>
          <div className="text-[11px] text-[#666]">@{p?.username || id.slice(0, 6)}</div>
          {p?.music ? <div className="text-[10px] text-[#557799]">music: {p.music}</div> : null}
        </div>

        <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
          {mode === "incoming" ? <RetroButton primary onClick={() => accept(f.id)}>Accept</RetroButton> : null}
          {mode === "outgoing" ? <span className="text-[11px] text-[#557799]">pending</span> : null}
          <RetroButton danger onClick={() => remove(f.id)}>
            {mode === "friend" ? "Remove" : "Cancel"}
          </RetroButton>
        </div>
      </div>
    );
  }

  return (
    <RetroShell title="Friends" subtitle={`${accepted.length} friend${accepted.length === 1 ? "" : "s"}`}>
      <div className="grid gap-2 md:grid-cols-[170px_1fr_220px]">
        <aside>
          <RetroBox title="Find Friends">
            <button onClick={() => router.push("/search")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Search People</button>
            <button onClick={() => router.push("/messages")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Messages</button>
            <button onClick={() => router.push("/feed")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Back to Feed</button>
          </RetroBox>
        </aside>

        <section>
          {status ? <RetroBox title="Status">{status}</RetroBox> : null}

          <RetroBox title={`Friend Requests (${incoming.length})`}>
            {incoming.length === 0 ? <div className="text-[#888]">no incoming requests</div> : null}
            {incoming.map((f) => <Row key={f.id} f={f} mode="incoming" />)}
          </RetroBox>

          <RetroBox title={`My Friends (${accepted.length})`}>
            {accepted.length === 0 ? <div className="text-[#888]">no friends yet</div> : null}
            {accepted.map((f) => <Row key={f.id} f={f} mode="friend" />)}
          </RetroBox>

          <RetroBox title={`Sent Requests (${outgoing.length})`}>
            {outgoing.length === 0 ? <div className="text-[#888]">no sent requests</div> : null}
            {outgoing.map((f) => <Row key={f.id} f={f} mode="outgoing" />)}
          </RetroBox>
        </section>

        <aside>
          <RetroBox title="Friend System">
            <p className="text-[11px] text-[#555]">
              Click a friend row to open their profile. Use Message from their profile.
            </p>
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
