"use client";

import { useEffect, useState, useRef } from "react";
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

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] p-4">
      <div className="max-w-md mx-auto space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow">
            
            {post.song_title && (
              <div className="flex items-center gap-3 mb-3">
                <img src={post.album_art} className="h-10 w-10 rounded" />
                <div>
                  <div className="text-sm font-medium">{post.song_title}</div>
                  <div className="text-xs text-gray-500">{post.song_artist}</div>
                </div>
              </div>
            )}

            <AutoPlayAudio src={post.preview_url} />

            {post.caption && (
              <p className="mb-3 font-serif text-lg">{post.caption}</p>
            )}

            {post.image_url && (
              <img src={post.image_url} className="rounded-xl w-full" />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
