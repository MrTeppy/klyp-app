"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const profileId = String(params.id || "");

  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [friendship, setFriendship] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Loading profile...");

  useEffect(() => {
    load();
  }, [profileId]);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setMe(user);

    const { data: prof, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError) {
      setStatus(profileError.message);
      return;
    }

    if (!prof) {
      setStatus("Profile not found.");
      return;
    }

    setProfile(prof);

    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    setPosts(postData || []);

    if (user && user.id !== profileId) {
      const { data: friends } = await supabase
        .from("friendships")
        .select("*")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${profileId}),and(requester_id.eq.${profileId},addressee_id.eq.${user.id})`
        )
        .maybeSingle();

      setFriendship(friends || null);
    }

    setStatus("");
  }

  async function addFriend() {
    if (!me) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: me.id,
      addressee_id: profileId,
      status: "pending",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    await load();
  }

  async function blockUser() {
    if (!me) {
      router.push("/login");
      return;
    }

    if (!confirm("Block this user?")) return;

    const { error } = await supabase.from("user_blocks").insert({
      blocker_id: me.id,
      blocked_id: profileId,
    });

    setStatus(error ? error.message : "User blocked.");
    setMenuOpen(false);
  }

  async function reportUser() {
    if (!me) {
      router.push("/login");
      return;
    }

    const reason = prompt("Why are you reporting this profile?") || "No reason given";

    const { error } = await supabase.from("reports").insert({
      reporter_id: me.id,
      reported_id: profileId,
      reason,
    });

    setStatus(error ? error.message : "Report sent.");
    setMenuOpen(false);
  }

  const isMe = me?.id === profileId;

  const friendLabel =
    friendship?.status === "accepted"
      ? "Friends"
      : friendship?.requester_id === me?.id
      ? "Requested"
      : friendship?.addressee_id === me?.id
      ? "Requested you"
      : "Add Friend";

  return (
    <RetroShell title={profile?.display_name || profile?.username || "Profile"} subtitle="music profile">
      {status ? <RetroBox title="Status">{status}</RetroBox> : null}

      {profile ? (
        <div className="grid gap-2 md:grid-cols-[180px_1fr_240px]">
          <aside>
            <RetroBox title="Picture">
              <div className="mb-2">
                <MiniAvatar
                  label={profile.display_name || profile.username || "US"}
                  src={profile.avatar_url}
                  size="lg"
                />
              </div>

              {!isMe ? (
                <div className="relative flex flex-wrap gap-1">
                  <RetroButton primary onClick={() => router.push(`/messages?to=${profileId}`)}>
                    Message
                  </RetroButton>

                  <RetroButton disabled={!!friendship} onClick={addFriend}>
                    {friendLabel}
                  </RetroButton>

                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="border border-[#7aacca] bg-gradient-to-b from-[#f0f6fc] to-[#dce8f4] px-2 py-1 text-[11px] text-[#1a3a66]"
                  >
                    ⋯
                  </button>

                  {menuOpen ? (
                    <div className="absolute right-0 top-7 z-20 w-28 border border-[#b0c8e0] bg-white text-[11px] shadow">
                      <button onClick={blockUser} className="block w-full px-2 py-1 text-left text-[#660000] hover:bg-[#fff0f0]">
                        Block
                      </button>
                      <button onClick={reportUser} className="block w-full px-2 py-1 text-left text-[#660000] hover:bg-[#fff0f0]">
                        Report
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <RetroButton onClick={() => router.push("/profile")}>Edit my profile</RetroButton>
              )}
            </RetroBox>
          </aside>

          <section>
            <RetroBox title="Profile">
              <div className="text-[15px] font-bold text-[#1a4a99]">
                {profile.display_name || profile.username || "klyp user"}
              </div>
              <div className="mb-2 text-[11px] text-[#666]">
                @{profile.username || profile.id.slice(0, 6)}
              </div>

              {profile.music ? (
                <div className="mb-2 border border-[#dce8f5] bg-[#f8fcff] p-2 text-[12px]">
                  <strong>Favourite music:</strong> {profile.music}
                </div>
              ) : null}

              <div className="whitespace-pre-line text-[12px] leading-5">
                {profile.bio || "No bio yet."}
              </div>
            </RetroBox>

            <RetroBox title={`Posts (${posts.length})`}>
              {posts.length === 0 ? <div className="text-[#888]">no posts yet</div> : null}

              {posts.map((p) => (
                <div key={p.id} className="mb-2 border-b border-[#dce8f5] pb-2">
                  <div className="flex gap-2">
                    <MiniAvatar label={profile.display_name || profile.username || "user"} />
                    <div>
                      <div className="text-[12px] font-bold text-[#1a4a99]">
                        {profile.display_name || profile.username}
                      </div>
                      {p.song_title ? (
                        <div className="text-[11px] text-[#557799]">
                          ♪ {p.song_title} — {p.song_artist}
                        </div>
                      ) : null}
                      {p.caption ? (
                        <div className="mt-1 whitespace-pre-line text-[12px]">{p.caption}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </RetroBox>
          </section>

          <aside>
            <RetroBox title="Information">
              <table className="w-full text-[11px]">
                <tbody>
                  <tr><td className="bg-[#dce8f5] p-1 font-bold text-[#2a5080]" colSpan={2}>Account Info:</td></tr>
                  <tr><td className="w-[75px] p-1 text-[#666]">Username:</td><td className="p-1">@{profile.username || "—"}</td></tr>
                  <tr><td className="bg-[#dce8f5] p-1 font-bold text-[#2a5080]" colSpan={2}>Personal Info:</td></tr>
                  <tr><td className="p-1 text-[#666]">Music:</td><td className="p-1">{profile.music || "—"}</td></tr>
                  <tr><td className="p-1 text-[#666]">About:</td><td className="p-1">{profile.bio || "—"}</td></tr>
                </tbody>
              </table>
            </RetroBox>
          </aside>
        </div>
      ) : null}
    </RetroShell>
  );
}
