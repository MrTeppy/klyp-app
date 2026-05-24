"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  music_source?: string | null;
};

function timeAgo(date?: string) {
  if (!date) return "just now";
  const then = new Date(date).getTime();
  const diff = Date.now() - then;

  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function displayName(post: Post) {
  if (!post.user_id) return "klyp.user";
  return `user.${String(post.user_id).slice(0, 4)}`;
}

function initials(post: Post) {
  return displayName(post).slice(0, 2).toUpperCase();
}

function PlayButton({ src }: { src?: string | null }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    if (!src) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setPlaying(false);
    }

    const audio = audioRef.current;

    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      currentAudio = audio;
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={!src}
      className="flex h-8 w-8 items-center justify-center border border-[#8aacca] bg-[#2f5c99] text-[11px] text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
      title={src ? "Play preview" : "No preview"}
    >
      {playing ? "Ⅱ" : "▶"}
    </button>
  );
}

function AutoPlayAudio({ src }: { src?: string | null }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || !ref.current) return;

    const audio = new Audio(src);
    audio.volume = 0.55;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (currentAudio && currentAudio !== audio) currentAudio.pause();
          currentAudio = audio;
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      audio.pause();
    };
  }, [src]);

  return <div ref={ref} className="h-px w-full" />;
}

function MusicCard({ post }: { post: Post }) {
  if (!post.song_title) return null;

  return (
    <div className="mb-2 flex items-center gap-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#2f5c99] text-white">
        {post.album_art ? (
          <img src={post.album_art} alt="" className="h-full w-full object-cover" />
        ) : (
          "♪"
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-bold text-[#1a3a66]">
          {post.song_title}
        </div>
        <div className="truncate text-[11px] text-[#557799]">
          {post.song_artist || "unknown artist"}
        </div>
        {post.external_url ? (
          <a
            href={post.external_url}
            target="_blank"
            className="text-[10px] text-[#1a4a99] hover:underline"
          >
            open in Apple Music
          </a>
        ) : null}
      </div>

      <PlayButton src={post.preview_url} />
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-[#b0c8e0] bg-white p-2">
      <AutoPlayAudio src={post.preview_url} />

      <div className="mb-2 flex items-start gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#3d6fad] text-[12px] font-bold text-white">
          {initials(post)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold text-[#1a4a99] hover:underline">
            {displayName(post)}
          </div>
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

      {post.caption ? (
        <p className="mb-2 whitespace-pre-line text-[12px] leading-6 text-[#333]">
          {post.caption}
        </p>
      ) : null}

      {post.image_url ? (
        <div className="mb-2 overflow-hidden border border-[#b0c8e0] bg-[#f0f6fc]">
          <img src={post.image_url} alt="" className="max-h-[520px] w-full object-cover" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-[#dce8f5] pt-2 text-[11px] text-[#336699]">
        <button className="hover:underline">♥ like</button>
        <button className="hover:underline">comment</button>
        <button className="hover:underline">save</button>
        <button className="hover:underline">share</button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState("Loading feed...");

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("klyp-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => loadPosts()
      )
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

    setPosts(data || []);
    setStatus("");
  }

  const latestTrack = posts.find((p) => p.song_title);

  return (
    <main className="min-h-screen bg-[#dce8f4] text-[#333]">
      <header className="border-b-2 border-[#1e4a80] bg-gradient-to-b from-[#5b8ecc] via-[#3d6fad] to-[#2f5c99] px-3 py-2">
        <div className="mx-auto flex max-w-[900px] items-center justify-between">
          <div>
            <div className="font-serif text-[30px] font-bold text-white drop-shadow">
              <span className="text-[#a8caf0]">[</span>klyp<span className="text-[#a8caf0]">]</span>
            </div>
            <div className="text-[10px] italic text-[#b8d4f0]">
              music. memory. people who get it.
            </div>
          </div>

          <div className="text-right text-[11px] text-[#c8dff5]">
            <div>klyp.life</div>
            <div className="text-[10px] text-[#a8c8f0]">est. 2026</div>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#1e4270] bg-[#2f5c99] px-3 py-1">
        <div className="mx-auto flex max-w-[900px] items-center text-[11px]">
          <button className="border-r border-[#3a6aaa] px-2 font-bold text-white">
            home
          </button>
          <button
            onClick={() => router.push("/upload")}
            className="border-r border-[#3a6aaa] px-2 text-[#c8dff5] hover:text-white hover:underline"
          >
            post song
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="border-r border-[#3a6aaa] px-2 text-[#c8dff5] hover:text-white hover:underline"
          >
            profile
          </button>
          <button
            onClick={() => router.push("/search")}
            className="border-r border-[#3a6aaa] px-2 text-[#c8dff5] hover:text-white hover:underline"
          >
            search
          </button>
        </div>
      </nav>

      <div className="bg-gradient-to-b from-[#7aaad5] to-[#5a8fc2] px-3 py-1 text-[12px] font-bold text-white">
        <div className="mx-auto max-w-[900px]">
          Home <span className="font-normal text-[#d8eaf8]">what are you listening to?</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[900px] gap-2 px-2 py-2 md:grid-cols-[145px_1fr_220px]">
        <aside className="hidden md:block">
          <div className="mb-2 border border-[#b0c8e0] bg-white">
            <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
              Quick Search
            </div>
            <div className="p-2">
              <input
                placeholder="name or username"
                className="w-full border border-[#8aacca] px-1 py-1 text-[11px]"
              />
              <button className="mt-1 w-full border border-[#7aacca] bg-[#dce8f4] px-2 py-1 text-[10px] text-[#1a3a66]">
                Search
              </button>
            </div>
          </div>

          <div className="mb-2 border border-[#b0c8e0] bg-white p-2 text-center">
            <div className="mb-1 text-[20px]">🎧</div>
            <div className="font-[Impact] text-[13px] leading-4 text-[#cc2200]">
              KLYP RADIO
            </div>
            <div className="mt-1 text-[10px] text-[#555]">
              30 second previews
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6888aa]">
            my klyp
          </div>
          <button onClick={() => router.push("/upload")} className="block text-[11px] text-[#1a4a99] hover:underline">
            ▸ Post a song
          </button>
          <button onClick={() => router.push("/profile")} className="block text-[11px] text-[#1a4a99] hover:underline">
            ▸ My Profile
          </button>
          <button className="block text-[11px] text-[#1a4a99] hover:underline">
            ▸ Messages
          </button>
        </aside>

        <section className="space-y-2">
          <div
            onClick={() => router.push("/upload")}
            className="cursor-pointer border border-[#b0c8e0] bg-white"
          >
            <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
              Post What You're Listening To
            </div>
            <div className="flex gap-2 p-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#3d6fad] text-[12px] font-bold text-white">
                ME
              </div>
              <div className="flex-1">
                <div className="border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px] text-[#557799]">
                  add a song, a thought, or a photo...
                </div>
                <div className="mt-2 flex justify-between border-t border-[#dce8f5] pt-2">
                  <button className="border border-[#b0c8e0] bg-[#dce8f5] px-3 py-1 text-[11px] font-bold text-[#1a3a66]">
                    ♪ Add Music
                  </button>
                  <button className="border border-[#1e4a80] bg-[#2f5c99] px-3 py-1 text-[11px] font-bold text-white">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {status ? (
            <div className="border border-[#b0c8e0] bg-white p-4 text-center text-[12px] text-[#666]">
              {status}
            </div>
          ) : null}

          {!status && posts.length === 0 ? (
            <div className="border border-[#b0c8e0] bg-white p-6 text-center text-[12px] text-[#888]">
              No posts yet. Be the first person to post what you're listening to.
            </div>
          ) : null}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>

        <aside className="hidden md:block">
          <div className="mb-2 border border-[#b0c8e0] bg-white">
            <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
              Latest Track
            </div>
            <div className="p-2">
              {latestTrack ? (
                <MusicCard post={latestTrack} />
              ) : (
                <div className="text-[11px] text-[#888]">no tracks yet</div>
              )}
            </div>
          </div>

          <div className="mb-2 border border-[#b0c8e0] bg-white">
            <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
              Scene Notes
            </div>
            <div className="space-y-2 p-2 text-[11px] leading-5 text-[#555]">
              <p>· Song posts auto-preview while scrolling.</p>
              <p>· One preview plays at a time.</p>
              <p>· Posts are loaded from Supabase.</p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-[#b0c8e0] bg-[#e8f0f8] p-4 text-center text-[10px] text-[#6688aa]">
        [klyp] 2026 · klyp.life · music. memory. people who get it.
      </footer>
    </main>
  );
}
