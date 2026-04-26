"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const posts = [
  {
    id: "sunflower-charlie",
    name: "sophie.diary",
    time: "2h ago",
    song: "The Nights",
    artist: "Avicii",
    caption: "collecting moments,\nnot things ✨",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=100&q=80",
    likes: 1400,
    comments: 42,
    klyps: 78,
  },
  {
    id: "sparks-mina",
    name: "noah.travels",
    time: "5h ago",
    song: "505",
    artist: "Arctic Monkeys",
    caption: "some days are harder.\nbut the good ones\nmake it all worth it ✨",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=100&q=80",
    likes: 982,
    comments: 21,
    klyps: 34,
  },
];

const stories = [
  { label: "late nights", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80" },
  { label: "roadtrips", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80" },
  { label: "good people", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" },
  { label: "sunset chasers", image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=200&q=80" },
  { label: "all the feels", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80" },
];

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <main
      className="min-h-screen text-[#1a1a1a]"
      style={{
        background: "linear-gradient(160deg, #fdf4e7 0%, #fae8d0 40%, #f5dcc0 100%)",
      }}
    >
      {/* Scrollable content */}
      <div className="mx-auto max-w-md px-4 pb-32 pt-5">

        {/* Header */}
        <header className="mb-5 flex items-center justify-between">
          <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>
            Klyp<span style={{ fontSize: 16, verticalAlign: "super", marginLeft: 2 }}>✦</span>
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative active:scale-90 transition-transform">
              <svg width="24" height="24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#F5A623] border-2 border-[#fdf4e7]" />
            </button>
            <div
              onClick={() => router.push("/profile")}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e07b2a] cursor-pointer active:scale-90 transition-transform"
            />
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-5 flex justify-center">
          <div className="flex rounded-full bg-white/70 p-1 shadow-sm backdrop-blur-sm">
            {[["foryou", "For You"], ["following", "Following"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                style={{ transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                className={`rounded-full px-5 py-2 text-sm font-medium ${
                  activeTab === key
                    ? "bg-white text-[#1a1a1a] shadow-sm"
                    : "text-[#8B7355]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {/* Add story */}
          <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <button
              onClick={() => router.push("/upload")}
              style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 border-2 border-dashed border-[#e0c9a0] shadow-sm active:scale-90"
            >
              <span className="text-2xl text-[#8B7355]">+</span>
            </button>
            <span className="text-[11px] text-[#8B7355]">Your story</span>
          </div>

          {stories.map((story) => (
            <div key={story.label} className="flex flex-shrink-0 flex-col items-center gap-1.5">
              <button
                style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                className="relative h-16 w-16 rounded-full active:scale-90"
              >
                {/* Golden ring */}
                <div className="absolute inset-0 rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #F5A623, #e07b2a)" }}>
                  <div className="h-full w-full rounded-full p-[2px] bg-[#fdf4e7]">
                    <img src={story.image} alt="" className="h-full w-full rounded-full object-cover" />
                  </div>
                </div>
                {/* Play icon */}
                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-[8px] text-[#1a1a1a] ml-[1px]">▶</span>
                </div>
              </button>
              <span className="text-[11px] text-[#8B7355] max-w-[64px] truncate text-center">{story.label}</span>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div
          onClick={() => router.push("/upload")}
          className="mb-5 rounded-[20px] bg-white/80 p-4 shadow-sm backdrop-blur-sm cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e07b2a]" />
            <span className="text-[#8B7355] text-sm">What's on your mind?</span>
          </div>
          <div className="flex items-center justify-around border-t border-[#f0e4d0] pt-3">
            {[["♪", "Music"], ["📷", "Photo"], ["♡", "Mood"]].map(([icon, label]) => (
              <button key={label} className="flex items-center gap-1.5 text-sm text-[#C4803A] font-medium">
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <section className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-[20px] bg-white/85 p-4 shadow-sm backdrop-blur-sm"
              style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              {/* User row */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e07b2a]" />
                  <div>
                    <p className="font-semibold text-sm">{post.name}</p>
                    <p className="text-xs text-[#8B7355]">{post.time}</p>
                  </div>
                </div>
                <button className="text-[#8B7355]">•••</button>
              </div>

              {/* Music card */}
              <div className="mb-3 flex items-center justify-between rounded-[14px] bg-[#fdf4e7] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <img src={post.albumArt} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{post.song}</p>
                    <p className="text-xs text-[#8B7355]">{post.artist}</p>
                  </div>
                </div>
                <button
                  style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm active:scale-90"
                >
                  <span className="text-xs ml-[1px]">▶</span>
                </button>
              </div>

              {/* Caption */}
              <p className="mb-3 whitespace-pre-line text-[17px] leading-7 font-medium">
                {post.caption}
              </p>

              {/* Image */}
              <div className="overflow-hidden rounded-[16px]">
                <img src={post.image} alt="" className="w-full object-cover" style={{ maxHeight: 340 }} />
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setLiked((p) => ({ ...p, [post.id]: !p[post.id] }))}
                  style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                  className="flex items-center gap-1.5 active:scale-125"
                >
                  <span className="text-xl">{liked[post.id] ? "🧡" : "🤍"}</span>
                  <span className="text-sm text-[#8B7355]">{formatCount(post.likes + (liked[post.id] ? 1 : 0))}</span>
                </button>

                <button className="flex items-center gap-1.5">
                  <svg width="18" height="18" fill="none" stroke="#8B7355" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-sm text-[#8B7355]">{post.comments}</span>
                </button>

                <button
                  onClick={() => router.push(`/klyp/add?post=${post.id}`)}
                  style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                  className="flex items-center gap-1.5 active:scale-110"
                >
                  <svg width="18" height="18" fill="none" stroke="#8B7355" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  <span className="text-sm text-[#8B7355]">{post.klyps}</span>
                </button>

                <button style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }} className="active:scale-110">
                  <svg width="18" height="18" fill="none" stroke="#8B7355" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{
          background: "#fdf4e7",
          borderTop: "1px solid #ead7b8",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-6 py-3">
          <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="text-[10px] font-medium text-[#F5A623]">Home</span>
          </button>
          <button onClick={() => router.push("/search")} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="text-[10px] text-[#8B7355]">Explore</span>
          </button>
          <button
            onClick={() => router.push("/upload")}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg active:scale-90 -mt-4"
            style={{ background: "linear-gradient(135deg, #F5A623, #e07b2a)" }}
          >
            +
          </button>
          <button onClick={() => router.push("/feed")} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="text-[10px] text-[#8B7355]">Feed</span>
          </button>
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="text-[10px] text-[#8B7355]">Profile</span>
          </button>
        </div>
      </div>
    </main>
  );
}
