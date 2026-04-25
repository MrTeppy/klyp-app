"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Comments from "@/components/Comments";
import KlypButton from "@/components/KlypButton";

export default function FeedPage() {
  const router = useRouter();
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const posts = [
    {
      id: "late-train-city-lights",
      name: "Charlie",
      handle: "@charlie",
      time: "2h",
      song: "Let Down",
      artist: "Radiohead",
      caption: "train window reflections\ncity lights, exact song.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      friendCount: 12,
    },
    {
      id: "sparks-mina",
      name: "Mina",
      handle: "@mina",
      time: "40m",
      song: "Sparks",
      artist: "Coldplay",
      caption: "rain on the window\nsame song again.",
      image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
      friendCount: 3,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#111]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-5">

        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111] text-2xl font-bold text-[#d7a96b] shadow-md">
              K
            </div>
            <div className="tracking-[0.45em] text-lg font-semibold">KLYP</div>
          </div>
          <button
            onClick={() => router.push("/upload")}
            className="rounded-full bg-[#111] px-5 py-2 text-sm font-medium text-white shadow-sm active:opacity-70"
          >
            + Post
          </button>
        </header>

        {/* Feed */}
        <section className="space-y-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-4 shadow-[0_12px_35px_rgba(55,39,20,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d7a96b] to-[#111]" />
                  <div>
                    <p className="font-semibold">{post.name}</p>
                    <p className="text-xs text-[#82766b]">{post.handle} · {post.time}</p>
                  </div>
                </div>
                <button className="text-xl leading-none text-[#82766b]">•••</button>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#eee6dc] p-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-[#111]">
                    <img src={post.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{post.song}</p>
                    <p className="text-xs text-[#6d6258]">{post.artist}</p>
                  </div>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffaf3] shadow-sm active:scale-95 transition-transform">
                  ▶
                </button>
              </div>

              <p className="mb-4 whitespace-pre-line font-serif text-[25px] leading-7">
                {post.caption}
              </p>

              <div className="overflow-hidden rounded-[24px]">
                <img src={post.image} alt="" className="h-[430px] w-full object-cover" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#111]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#b08a56]" />
                    <span className="h-7 w-7 rounded-full border-2 border-[#fffaf3] bg-[#d8c1a3]" />
                  </div>
                  <p className="text-xs text-[#82766b]">Klyped by {post.friendCount} friends</p>
                </div>
                <button
                  onClick={() => setLiked((p) => ({ ...p, [post.id]: !p[post.id] }))}
                  className="text-2xl transition-transform active:scale-125"
                >
                  {liked[post.id] ? "♥" : "♡"}
                </button>
              </div>

              <div className="mt-3">
                <KlypButton postSlug={post.id} />
              </div>

              <Comments postSlug={post.id} />
            </article>
          ))}
        </section>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#ded2c5] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md justify-around px-6 py-4 text-sm">
          <button onClick={() => router.push("/")} className="text-[#82766b]">Home</button>
          <button onClick={() => router.push("/search")} className="text-[#82766b]">Explore</button>
          <button onClick={() => router.push("/upload")} className="rounded-full bg-[#111] px-5 py-2 text-white active:opacity-70">+</button>
          <button onClick={() => router.push("/feed")} className="font-medium text-[#111]">Feed</button>
          <button onClick={() => router.push("/profile")} className="text-[#82766b]">Profile</button>
        </div>
      </div>
    </main>
  );
}
