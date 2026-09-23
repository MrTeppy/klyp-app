"use client";

import { useEffect, useState } from "react";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [music, setMusic] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (!data.user) {
      setStatus("Log in to edit your profile.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setMusic(profile.music || "");
      setAvatarUrl(profile.avatar_url || "");
    } else {
      setDisplayName(data.user.user_metadata?.display_name || data.user.email || "");
      setUsername(data.user.user_metadata?.username || data.user.email?.split("@")[0] || "");
    }

    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    setPosts(postData || []);
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Only JPG, PNG, or WEBP images allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("Profile picture must be under 5MB.");
      return;
    }

    setStatus("Uploading profile picture...");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setStatus("Profile picture uploaded. Press Save Profile.");
  }

  async function save() {
    if (!user) return;

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      username: cleanUsername,
      bio,
      music,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

    setStatus(error ? error.message : "Profile saved.");
  }

  return (
    <RetroShell title="My Profile" subtitle="old-school profile page">
      <div className="grid gap-2 md:grid-cols-[180px_1fr_240px]">
        <aside>
          <RetroBox title="Picture">
            <div className="mb-2">
              <MiniAvatar
                label={displayName || username || "ME"}
                src={avatarUrl}
                size="lg"
              />
            </div>

            <label className="mb-2 block cursor-pointer border border-[#7aacca] bg-gradient-to-b from-[#f0f6fc] to-[#dce8f4] px-3 py-1 text-center text-[11px] text-[#1a3a66]">
              Change picture
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
            <RetroButton onClick={save} primary>Save Profile</RetroButton>
            {status ? <div className="mt-2 text-[11px] text-[#557799]">{status}</div> : null}
          </RetroBox>
        </aside>

        <section>
          <RetroBox title="Edit Profile">
            {!user ? (
              <div>Log in to edit your profile.</div>
            ) : (
              <>
                <label className="mb-1 block text-[11px] font-bold">Display name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

                <label className="mb-1 block text-[11px] font-bold">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

                <label className="mb-1 block text-[11px] font-bold">Favourite music</label>
                <input value={music} onChange={(e) => setMusic(e.target.value)} placeholder="Blur, Mac Miller, Radiohead..." className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

                <label className="mb-1 block text-[11px] font-bold">About me</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[90px] w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />
              </>
            )}
          </RetroBox>

          <RetroBox title={`My Posts (${posts.length})`}>
            {posts.length === 0 ? <div className="text-[#888]">no posts yet</div> : null}
            {posts.map((p) => (
              <div key={p.id} className="mb-2 border-b border-[#dce8f5] pb-2">
                <div className="flex gap-2">
                  <MiniAvatar label={displayName || username || "ME"} />
                  <div>
                    <div className="text-[12px] font-bold text-[#1a4a99]">{displayName || username || "me"}</div>
                    {p.song_title ? <div className="text-[11px] text-[#557799]">♪ {p.song_title} — {p.song_artist}</div> : null}
                    {p.caption ? <div className="mt-1 whitespace-pre-line text-[12px]">{p.caption}</div> : null}
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
                <tr><td className="p-1 text-[#666]">Username:</td><td className="p-1">@{username || "—"}</td></tr>
                <tr><td className="bg-[#dce8f5] p-1 font-bold text-[#2a5080]" colSpan={2}>Personal Info:</td></tr>
                <tr><td className="p-1 text-[#666]">Music:</td><td className="p-1">{music || "—"}</td></tr>
                <tr><td className="p-1 text-[#666]">About:</td><td className="p-1">{bio || "—"}</td></tr>
              </tbody>
            </table>
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
