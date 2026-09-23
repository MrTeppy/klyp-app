"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell, MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

let currentAudio: HTMLAudioElement | null = null;

type Post = {
  id: string | number;
  created_at?: string;
  user_id?: string | null;
  image_url?: string | null;
  caption?: string | null;
  mood_line?: string | null;
  song_title?: string | null;
  song_artist?: string | null;
  album_art?: string | null;
  preview_url?: string | null;
  external_url?: string | null;
};

function timeAgo(date?: string) {
  if (!date) return "just now";
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
};

function nameFromPost(post: Post, profiles: Record<string, Profile>) {
  if (!post.user_id) return "klyp.user";

  const profile = profiles[post.user_id];

  return profile?.display_name || profile?.username || `user.${post.user_id.slice(0, 4)}`;
}

function Play({ src }: { src?: string | null }) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    if (!src) return;
    if (!audio.current) audio.current = new Audio(src);
    if (currentAudio && currentAudio !== audio.current) currentAudio.pause();

    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      currentAudio = audio.current;
      audio.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <button onClick={toggle} disabled={!src} className="h-8 w-8 border border-[#8aacca] bg-[#2f5c99] text-[11px] text-white disabled:opacity-40">
      {playing ? "Ⅱ" : "▶"}
    </button>
  );
}

function MusicCard({ post }: { post: Post }) {
  if (!post.song_title) return null;

  return (
    <div className="mb-2 flex items-center gap-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#2f5c99] text-white">
        {post.album_art ? <img src={post.album_art} alt="" className="h-full w-full object-cover" /> : "♪"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-bold text-[#1a3a66]">{post.song_title}</div>
        <div className="truncate text-[11px] text-[#557799]">{post.song_artist || "unknown artist"}</div>
        {post.external_url ? (
          <a href={post.external_url} target="_blank" className="text-[10px] text-[#1a4a99] hover:underline">
            open in Apple Music
          </a>
        ) : null}
      </div>
      <Play src={post.preview_url} />
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [status, setStatus] = useState("Loading feed...");

  useEffect(() => {
    loadPosts();
    const channel = supabase
      .channel("klyp-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const loadedPosts = data || [];
    setPosts(loadedPosts);

    const userIds = [...new Set(
      loadedPosts
        .map((post) => post.user_id)
        .filter((id): id is string => !!id)
    )];

    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", userIds);

      const profileMap: Record<string, Profile> = {};

      for (const profile of profileData || []) {
        profileMap[profile.id] = profile;
      }

      setProfiles(profileMap);
    } else {
      setProfiles({});
    }

    setStatus("");
  }

  const latestTrack = posts.find((p) => p.song_title);

  return (
    <RetroShell title="Home" subtitle="what are you listening to?">
      <div className="grid gap-2 md:grid-cols-[145px_1fr_220px]">
        <aside className="hidden md:block">
          <RetroBox title="My Klyp">
            <button onClick={() => router.push("/upload")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Post a song</button>
            <button onClick={() => router.push("/profile")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ My Profile</button>
            <button onClick={() => router.push("/friends")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Friends</button>
            <button onClick={() => router.push("/search")} className="block text-[11px] text-[#1a4a99] hover:underline">▸ Search People</button>
          </RetroBox>

          <RetroBox title="Now Spinning">
            <style>{`
              @keyframes klypDiscSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>

            <div className="py-2 text-center">
              <div
                className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border border-[#8aacca] shadow-inner"
                style={{
                  animation: "klypDiscSpin 18s linear infinite",
                  background:
                    "repeating-conic-gradient(from 0deg, #f8fcff 0deg, #dce8f4 12deg, #ffffff 24deg, #c8d8ec 36deg)",
                }}
              >
                <div
                  className="absolute inset-[14px] rounded-full border border-[#b0c8e0]"
                  style={{
                    background:
                      "repeating-conic-gradient(from 20deg, #eef6ff 0deg, #ffffff 18deg, #d6e6f6 36deg)",
                  }}
                />
                <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8aacca] bg-white" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f5c99]" />
              </div>

              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a3a66]">
                now spinning
              </div>
              <div className="mt-1 text-[10px] leading-4 text-[#557799]">
                slow previews from the klyp feed
              </div>
            </div>

            <div className="mt-2 border-t border-[#dce8f5] pt-2 text-[11px] leading-5 text-[#555]">
              <div>▸ post the song in your head</div>
              <div>▸ find people by music taste</div>
              <div>▸ keep it small, weird, yours</div>
            </div>
          </RetroBox>
        </aside>

        <section>
          <RetroBox title="Post Something">
            <div className="flex gap-2">
              <MiniAvatar />
              <button onClick={() => router.push("/upload")} className="flex-1 border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-left text-[12px] text-[#557799]">
                add a song, a thought, or a photo...
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <RetroButton primary onClick={() => router.push("/upload")}>Post</RetroButton>
            </div>
          </RetroBox>

          {status ? <RetroBox title="Status">{status}</RetroBox> : null}

          {!status && posts.length === 0 ? (
            <RetroBox title="Feed">No posts yet. Be the first person to post what you're listening to.</RetroBox>
          ) : null}

          {posts.map((post) => (
            <article key={post.id} className="mb-2 border border-[#b0c8e0] bg-white p-2">
              <div className="mb-2 flex items-start gap-2">
                <MiniAvatar label={nameFromPost(post, profiles)} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-[#1a4a99]">{nameFromPost(post, profiles)}</div>
                  <div className="text-[10px] text-[#888]">{timeAgo(post.created_at)}</div>
                </div>
                <button className="text-[11px] text-[#557799]">•••</button>
              </div>

              <MusicCard post={post} />

              {post.mood_line ? (
                <div className="mb-2 border border-[#dce8f5] bg-[#f8fcff] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4878aa]">
                  {post.mood_line}
                </div>
              ) : null}

              {post.caption ? <p className="mb-2 whitespace-pre-line text-[12px] leading-6">{post.caption}</p> : null}

              {post.image_url ? (
                <img src={post.image_url} alt="" className="mb-2 max-h-[520px] w-full border border-[#b0c8e0] object-cover" />
              ) : null}

              <div className="flex gap-3 border-t border-[#dce8f5] pt-2 text-[11px] text-[#336699]">
                <button className="hover:underline">♥ like</button>
                <button className="hover:underline">comment</button>
                <button className="hover:underline">save</button>
              </div>
            </article>
          ))}
        </section>

        <aside className="hidden md:block">
          <RetroBox title="Latest Track">
            {latestTrack ? <MusicCard post={latestTrack} /> : <div className="text-[11px] text-[#888]">no tracks yet</div>}
          </RetroBox>

          <RetroBox title="Scene Notes">
            <div className="mb-2 border border-[#dce8f5] bg-[#f8fcff] p-2 text-[11px] leading-5">
              <p>· Posts load from Supabase.</p>
              <p>· Apple previews sit inside each post.</p>
              <p>· Friends and messages are live.</p>
            </div>

            <div className="grid grid-cols-2 gap-1 text-center text-[10px] text-[#557799]">
              <div className="border border-[#dce8f5] bg-[#f8fcff] p-1">
                <div className="font-bold text-[#1a3a66]">music</div>
                profiles
              </div>
              <div className="border border-[#dce8f5] bg-[#f8fcff] p-1">
                <div className="font-bold text-[#1a3a66]">dms</div>
                friends
              </div>
            </div>
          </RetroBox>

          <RetroBox title="Little Directory">
            <div className="space-y-1 text-[11px] leading-5 text-[#555]">
              <div>▸ new people in search</div>
              <div>▸ message friends from profiles</div>
              <div>▸ post a song before it gets old</div>
            </div>
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
