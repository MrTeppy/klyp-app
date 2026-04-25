"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

let currentAudio: HTMLAudioElement | null = null;

function AutoPlayAudio({ src }: { src: string | null }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || !ref.current) return;

    const audio = new Audio(src);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
          }

          currentAudio = audio;
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      },
      { threshold: 0.65 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      audio.pause();
    };
  }, [src]);

  return <div ref={ref} />;
}

type Post = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string;
  mood_line: string;
  song_title: string | null;
  song_artist: string | null;
  album_art: string | null;
  preview_url: string | null;
  created_at: string;
  profiles: { username: string; display_name: string } | null;
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
  const ref = useRef<HTMLElement>(null);

  return (
    <article
      ref={ref}
      className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-4 shadow-[0_12px_35px_rgba(55,39,20,0.08)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">{post.profiles?.display_name}</p>
          <p className="text-xs text-[#82766b]">
            @{post.profiles?.username} · {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      {/* MUSIC */}
      {post.song_title && (
        <div className="mb-4 flex items-center gap-3">
          {post.album_art && (
            <img src={post.album_art} className="h-12 w-12 rounded-xl" />
          )}
          <div>
            <p className="text-sm font-semibold">{post.song_title}</p>
            <p className="text-xs text-[#6d6258]">{post.song_artist}</p>
          </div>
        </div>
      )}

      {/* AUTOPLAY */}
      <AutoPlayAudio src={post.preview_url} />

      {/* CAPTION */}
      {post.caption && (
        <p className="mb-4 font-serif text-[22px] leading-7">
          {post.caption}
        </p>
      )}

      {/* IMAGE */}
      {post.image_url && (
        <img
          src={post.image_url}
          className="rounded-[24px] w-full"
        />
      )}

      {/* LIKE */}
      <div className="mt-4 flex justify-between">
        <button onClick={() => onLike(post.id)}>
          {post.liked ? "♥" : "♡"} {post.like_count}
        </button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select(`*, profiles (username, display_name), likes (user_id)`)
      .order("created_at", { ascending: false });

    const mapped = (data || []).map((p: any) => ({
      ...p,
      like_count: p.likes?.length || 0,
      liked: userId ? p.likes?.some((l: any) => l.user_id === userId) : false,
    }));

    setPosts(mapped);
  }

  async function handleLike(postId: number) {
    if (!userId) {
      router.push("/login");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    }

    loadPosts();
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] p-4">
      <div className="max-w-md mx-auto space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </main>
  );
}
