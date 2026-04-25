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
  const [results, setResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `posts/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setStatus("Image uploaded");
  }

  async function searchSongs(q: string) {
    setQuery(q);

    if (!q) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.tracks || []);
  }

  async function handlePublish() {
    if (!imageUrl) {
      setStatus("Upload image first");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first");
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
      music_source: "itunes",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Posted");
    setTimeout(() => {
      window.location.href = "/feed";
    }, 800);
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#171717]">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <AppHeader subtitle="New Post" />

        <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
          {/* IMAGE */}
          <label className="block cursor-pointer rounded-[20px] border border-black/10 bg-[#faf8f4] p-5 text-center">
            <div className="text-[15px] font-medium">Upload image</div>
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          {/* CAPTION */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="your moment..."
            className="mt-4 w-full rounded-xl border p-3"
          />

          {/* MUSIC SEARCH */}
          <input
            value={query}
            onChange={(e) => searchSongs(e.target.value)}
            placeholder="Search song..."
            className="mt-4 w-full rounded-xl border p-3"
          />

          {/* RESULTS */}
          <div className="mt-3 max-h-48 overflow-y-auto">
            {results.map((track) => (
              <div
                key={track.id}
                onClick={() => {
                  setSelectedTrack(track);
                  setResults([]);
                  setQuery(track.title);
                }}
                className="flex cursor-pointer items-center gap-3 p-2 hover:bg-gray-100"
              >
                <img
                  src={track.albumArt}
                  className="h-10 w-10 rounded"
                />
                <div>
                  <div className="text-sm">{track.title}</div>
                  <div className="text-xs text-gray-500">
                    {track.artist}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SELECTED SONG */}
          {selectedTrack && (
            <div className="mt-4 flex items-center gap-3 bg-[#faf8f4] p-3 rounded-xl">
              <img
                src={selectedTrack.albumArt}
                className="h-12 w-12 rounded"
              />
              <div>
                <div>{selectedTrack.title}</div>
                <div className="text-sm text-gray-500">
                  {selectedTrack.artist}
                </div>
              </div>
            </div>
          )}

          {/* POST */}
          <button
            onClick={handlePublish}
            className="mt-6 w-full rounded-full bg-black py-3 text-white"
          >
            Post
          </button>

          {status && (
            <p className="mt-3 text-sm text-black/60">{status}</p>
          )}
        </div>
      </div>
    </main>
  );
}
