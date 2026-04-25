"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string;
  mood_line: string;
  sound_title: string;
  sound_artist: string;
  sound_type: string;
  created_at: string;
  profiles: { username: string; display_name: string; avatar_url: string } | null;
  like_count: number;
  liked: boolean;
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  const [heartBurst, setHeartBurst] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function handleLike() {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);
    onLike(post.id);
  }

  return (
    <article
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: "opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-4 shadow-[0_12px_35px_rgba(55,39,20,0.08)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d7a96b] to-[#111] flex items-center justify-center text-white text-xs font-bold">
            {post.profiles?.display_name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-semibold text-sm">{post.profiles?.display_name || "Unknown"}</p>
            <p className="text-xs text-[#82766b]">@{post.profiles?.username || "user"} · {timeAgo(post.created_at)}</p>
          </div>
        </div>
        <button className="text-xl leading-none text-[#82766b] active:opacity-50">•••</button>
      </div>

      {post.sound_title ? (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#eee6dc] p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#111] flex items-center justify-center text-white text-lg">♪</div>
            <div>
              <p className="text-sm font-semibold">{post.sound_title}</p>
              <p className="text-xs text-[#6d6258]">{post.sound_artist}</p>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffaf3] shadow-sm active:scale-90 transition-transform">
            ▶
          </button>
        </div>
      ) : null}

      {post.caption ? (
        <p className="mb-4 whitespace-pre-line font-serif text-[22px] leading-7 text-[#111]">
          {post.caption}
        </p>
      ) : null}

      {post.image_url ? (
        <div className="overflow-hidden rounded-[24px]">
          <img src={post.image_url} alt="" className="w-full object-cover" style={{ maxHeight: 500 }} />
        </div>
      ) : null}

      {post.mood_line ? (
        <div className="mt-3 inline-block rounded-full bg-[#f4efe8] px-3 py-1 text-xs text-[#82766b]">
          {post.mood_line}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => window.location.href = `/klyp/add?post=${post.id}`}
          className="rounded-full border border-[#e0d6ca] bg-white px-4 py-2 text-xs font-medium text-[#111] active:scale-95 transition-transform"
        >
          + Klyp this
        </button>

        <button
          onClick={handleLike}
          style={{
            transform: heartBurst ? "scale(1.4)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="flex items-center gap-1.5 text-sm"
        >
          <span className="text-2xl">{post.liked ? "♥" : "♡"}</span>
          <span className="text-[#82766b]">{post.like_count}</span>
        </button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"foryou" | "friends">("foryou");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select(`*, profiles (username, display_name, avatar_url), likes (user_id)`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) { setLoading(false); return; }

    const mapped = (data || []).map((p: any) => ({
      ...p,
      like_count: p.likes?.length || 0,
      liked: userId ? p.likes?.some((l: any) => l.user_id === userId) : false,
    }));

    setPosts(mapped);
    setLoading(false);
  }

  async function handleLike(postId: number) {
    if (!userId) { router.push("/login"); return; }
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, like_count: p.like_count + (p.liked ? -1 : 1) }
          : p
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#111]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-5">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111] text-2xl font-bold text-[#d7a96b] shadow-md">K</div>
            <div className="tracking-[0.45em] text-lg font-semibold">KLYP</div>
          </div>
          <button
            onClick={() => router.push("/upload")}
            className="rounded-full bg-[#111] px-5 py-2 text-sm font-medium text-white shadow-sm active:scale-95 transition-transform"
          >
            + Post
          </button>
        </header>

        <nav className="mb-5 flex gap-6 border-b border-[#ddd3c7] text-sm font-medium text-[#7a7168]">
          {[["foryou", "For You"], ["friends", "Friends"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`pb-3 transition-all duration-200 ${activeTab === key ? "border-b-2 border-[#111] text-[#111]" : ""}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-full bg-[#e0d6ca]" />
                  <div className="h-4 w-32 rounded-full bg-[#e0d6ca]" />
                </div>
                <div className="h-[300px] rounded-[24px] bg-[#e0d6ca]" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-8 text-center">
            <p className="text-2xl mb-2">✦</p>
            <p className="font-medium">No posts yet</p>
            <p className="text-sm text-[#82766b] mt-1">Be the first to post something.</p>
            <button
              onClick={() => router.push("/upload")}
              className="mt-4 rounded-full bg-[#111] px-5 py-2 text-sm text-white"
            >
              + Create Post
            </button>
          </div>
        ) : (
          <section className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#ded2c5] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md justify-around px-6 py-4 text-sm">
          <button onClick={() => router.push("/")} className="text-[#82766b] active:scale-90 transition-transform">Home</button>
          <button onClick={() => router.push("/search")} className="text-[#82766b] active:scale-90 transition-transform">Explore</button>
          <button onClick={() => router.push("/upload")} className="rounded-full bg-[#111] px-5 py-2 text-white active:scale-90 transition-transform">+</button>
          <button className="font-medium text-[#111]">Feed</button>
          <button onClick={() => router.push("/profile")} className="text-[#82766b] active:scale-90 transition-transform">Profile</button>
        </div>
      </div>
    </main>
  );
}
