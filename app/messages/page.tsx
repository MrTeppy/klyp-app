"use client";

import { useEffect, useState } from "react";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  music: string | null;
};

type DirectMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

function timeSmall(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const [me, setMe] = useState<any>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Loading messages...");

  useEffect(() => {
    loadPeople();
  }, []);

  useEffect(() => {
    if (!me || !selectedId) return;

    loadMessages(me.id, selectedId);

    const channel = supabase
      .channel("klyp-dms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_messages" },
        () => {
          loadMessages(me.id, selectedId);
          loadPeople();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [me, selectedId]);

  async function loadPeople() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setMe(user);

    if (!user) {
      setStatus("Log in to use messages.");
      return;
    }

    const rawUrlTo =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("to")
        : null;

    const urlTo =
      rawUrlTo && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawUrlTo)
        ? rawUrlTo
        : null;

    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const friendIds = (friendships || []).map((f: any) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    const { data: messageRows } = await supabase
      .from("direct_messages")
      .select("sender_id, receiver_id, created_at")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const messageIds = (messageRows || []).map((m: any) =>
      m.sender_id === user.id ? m.receiver_id : m.sender_id
    );

    const ids = Array.from(
      new Set([...friendIds, ...messageIds, ...(urlTo ? [urlTo] : [])])
    ).filter((id) => id && id !== user.id);

    if (ids.length === 0) {
      setPeople([]);
      setMessages([]);
      setSelectedId("");
      setStatus("No conversations yet. Go to a profile and press Message.");
      return;
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, music")
      .in("id", ids);

    if (error) {
      setStatus(error.message);
      return;
    }

    const profileList = (profiles || []) as Profile[];

    const sorted = ids
      .map((id) => profileList.find((p) => p.id === id))
      .filter(Boolean) as Profile[];

    setPeople(sorted);
    setSelectedId((current) => current || urlTo || sorted[0]?.id || "");
    setStatus("");
  }

  async function loadMessages(myId: string, otherId: string) {
    const { data, error } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${myId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${myId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      setStatus(error.message);
      return;
    }

    setMessages((data || []) as DirectMessage[]);
    setStatus("");
  }

  async function sendMessage() {
    if (!me || !selectedId) {
      setStatus("Choose someone first.");
      return;
    }

    const clean = body.trim();
    if (!clean) return;

    setBody("");

    const { error } = await supabase.from("direct_messages").insert({
      sender_id: me.id,
      receiver_id: selectedId,
      body: clean,
    });

    if (error) {
      setStatus(error.message);
      setBody(clean);
      return;
    }

    await loadMessages(me.id, selectedId);
    await loadPeople();
  }

  const selectedPerson = people.find((p) => p.id === selectedId);

  return (
    <RetroShell title="Messages" subtitle="private notes between klyp friends">
      <div className="grid gap-2 md:grid-cols-[260px_1fr_200px]">
        <aside>
          <RetroBox title="Conversations">
            {people.length === 0 ? (
              <div className="text-[11px] text-[#888]">No messages yet.</div>
            ) : null}

            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => setSelectedId(person.id)}
                className={`mb-1 flex w-full items-center gap-2 border p-2 text-left ${
                  selectedId === person.id
                    ? "border-[#4878aa] bg-[#dce8f5]"
                    : "border-[#dce8f5] bg-[#f8fcff] hover:bg-[#f0f6fc]"
                }`}
              >
                <MiniAvatar label={person.display_name || person.username || "user"} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-bold text-[#1a4a99]">
                    {person.display_name || person.username || "klyp user"}
                  </div>
                  <div className="truncate text-[10px] text-[#666]">
                    @{person.username || person.id.slice(0, 6)}
                  </div>
                  <div className="truncate text-[10px] text-[#557799]">
                    {person.music || "tap to chat"}
                  </div>
                </div>
              </button>
            ))}
          </RetroBox>
        </aside>

        <section>
          <RetroBox
            title={
              selectedPerson
                ? `Chat with ${selectedPerson.display_name || selectedPerson.username}`
                : "Chat"
            }
          >
            {status ? (
              <div className="mb-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[11px] text-[#557799]">
                {status}
              </div>
            ) : null}

            {!selectedPerson ? (
              <div className="text-[#888]">Choose a conversation.</div>
            ) : (
              <>
                <div className="mb-2 h-[460px] overflow-y-auto border border-[#b0c8e0] bg-[#eef6ff] p-2">
                  {messages.length === 0 ? (
                    <div className="p-4 text-center text-[12px] text-[#888]">
                      No messages yet. Send the first one.
                    </div>
                  ) : null}

                  {messages.map((msg) => {
                    const mine = msg.sender_id === me?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`mb-2 flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[78%] border p-2 ${
                            mine
                              ? "border-[#4878aa] bg-[#dce8f5]"
                              : "border-[#b0c8e0] bg-white"
                          }`}
                        >
                          <div className="whitespace-pre-line text-[12px] leading-5">
                            {msg.body}
                          </div>
                          <div className="mt-1 text-right text-[9px] text-[#777]">
                            {timeSmall(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="write a message..."
                    className="min-h-[54px] flex-1 border border-[#8aacca] bg-white px-2 py-2 text-[12px]"
                  />
                  <RetroButton primary onClick={sendMessage}>
                    Send
                  </RetroButton>
                </div>
              </>
            )}
          </RetroBox>
        </section>

        <aside>
          <RetroBox title="Classic Actions">
            <div className="space-y-1 text-[11px] text-[#555]">
              <div>▸ Enter to send</div>
              <div>▸ Shift + Enter for new line</div>
              <div>▸ Message from profiles</div>
            </div>
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
