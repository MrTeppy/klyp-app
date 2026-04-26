"use client";

import AppHeader from "@/components/AppHeader";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [moodLine, setMoodLine] = useState("");

  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Uploading image...");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Only JPG, PNG, or WEBP images allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatus("Image must be under 5MB.");
      return;
    }

    const filePath = `posts/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("images").upload(filePath, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setStatus("Image uploaded.");
  }

  async function searchSongs(q: string) {
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.tracks || []);
  }

  async function searchByVibe(v: string) {
    setVibe(v);

    if (!v.trim()) {
      setResults([]);
      return;
    }

    const lower = v.toLowerCase();
    let search = "";

    if (lower.includes("happy") || lower.includes("upbeat")) {
      search = "feel good indie pop";
    } else if (lower.includes("sad") || lower.includes("cry")) {
      search = "sad indie acoustic";
    } else if (lower.includes("night") || lower.includes("late")) {
      search = "late night drive";
    } else if (lower.includes("drive") || lower.includes("car")) {
      search = "driving indie rock";
    } else if (lower.includes("love") || lower.includes("romantic")) {
      search = "romantic indie pop";
    } else if (lower.includes("angry") || lower.includes("rage")) {
      search = "angry rock";
    } else if (lower.includes("chill") || lower.includes("calm")) {
      search = "chill indie";
    } else if (lower.includes("summer")) {
      search = "summer indie pop";
    } else {
      search = `${v} indie pop`;
    }

    const res = await fetch(`/api/music/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setResults(data.tracks || []);
  }

  async function handlePublish() {
    if (!imageUrl) {
      setStatus("Upload an image first.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first.");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      image_url: imageUrl,
      caption,
      mood_line: moodLine,
      song_title: selectedTrack?.title || null,
      song_artist: selectedTrack?.artist || null,
      album_art: selectedTrack?.albumArt || null,
      preview_url: selectedTrack?.previewUrl || null,
      external_url: selectedTrack?.externalUrl || null,
      music_source: selectedTrack ? "itunes" : null,
      visibility: "friends",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Posted.");
    setTimeout(() => {
      window.location.href = "/feed";
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="New Post" />

        <div className="grid gap-6 lg:grid-cols-[1fr_430px]">
          <section className="rounded-[32px] border border-black/10 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="text-[12px] uppercase tracking-[0.18em] text-black/35">
              Composer
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Build the moment properly
            </h1>

            <p className="mt-3 max-w-xl text-[15px] leading-7 text-black/60">
              Add the image, describe the mood, then choose the sound that fits it.
            </p>

            <div className="mt-6 rounded-[24px] border border-dashed border-black/15 bg-[#faf8f4] p-6">
              <label className="block cursor-pointer rounded-[20px] border border-black/10 bg-white p-5 text-center">
                <div className="text-[15px] font-medium">Choose cover image</div>
                <div className="mt-2 text-sm text-black/50">JPG, PNG, WEBP — max 5MB</div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-black/55">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="city lights through scratched train glass"
                className="min-h-[120px] w-full rounded-[22px] border border-black/10 bg-[#faf8f4] px-4 py-4 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-black/55">Mood line</label>
              <input
                value={moodLine}
                onChange={(e) => setMoodLine(e.target.value)}
                placeholder="Late Train / City Lights"
                className="w-full rounded-[18px] border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-black/10 bg-[#faf8f4] p-4">
              <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
                Sound
              </div>

              <input
                value={vibe}
                onChange={(e) => searchByVibe(e.target.value)}
                placeholder="Describe a vibe, e.g. rainy night drive"
                className="mt-4 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 outline-none"
              />

              <input
                value={query}
                onChange={(e) => searchSongs(e.target.value)}
                placeholder="Or search a song directly..."
                className="mt-3 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 outline-none"
              />

              <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
                {results.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrack(track);
                      setQuery(track.title);
                      setResults([]);
                    }}
                    className="flex w-full items-center gap-3 rounded-[18px] bg-white p-3 text-left hover:bg-black/5"
                  >
                    <img
                      src={track.albumArt}
                      alt=""
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{track.title}</div>
                      <div className="text-xs text-black/50">{track.artist}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTrack && (
                <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-white p-3">
                  <img
                    src={selectedTrack.albumArt}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold">{selectedTrack.title}</div>
                    <div className="text-xs text-black/50">{selectedTrack.artist}</div>
                  </div>
                </div>
              )}
            </div>

            {status ? <p className="mt-4 text-sm text-black/55">{status}</p> : null}

            <button
              onClick={handlePublish}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Publish Post
            </button>
          </section>

          <aside className="rounded-[32px] border border-black/10 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
              Live Preview
            </div>

            <div className="mt-4 rounded-[24px] border border-black/10 bg-[#faf8f4] p-3">
              <div className="aspect-[9/16] overflow-hidden rounded-[22px] bg-[#e7e1d8]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black/35">
                    Your post preview will show here
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-[18px] bg-white p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                  Post
                </div>

                <div className="mt-2 text-[14px] font-medium leading-6">
                  {caption || "Your caption will appear here."}
                </div>

                {moodLine ? (
                  <div className="mt-3 rounded-full bg-[#faf8f4] px-3 py-2 text-[11px] text-black/55">
                    {moodLine}
                  </div>
                ) : null}

                {selectedTrack ? (
                  <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-[#faf8f4] p-3">
                    <img
                      src={selectedTrack.albumArt}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold">{selectedTrack.title}</div>
                      <div className="text-[11px] text-black/50">
                        {selectedTrack.artist}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
     <button className="klyp-button px-4 py-2 mt-4">
  TEST BULGE
</button>
    </main>
  );
}
