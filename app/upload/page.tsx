"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  albumArt?: string | null;
  previewUrl?: string | null;
  externalUrl?: string | null;
};

export default function UploadPage() {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [moodLine, setMoodLine] = useState("");

  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [searching, setSearching] = useState(false);

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

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `posts/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from("images").upload(filePath, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setStatus("Image uploaded.");
  }

  async function runSongSearch(search: string) {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);

    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setResults(data.tracks || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function searchSongs(q: string) {
    setQuery(q);
    await runSongSearch(q);
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
      search = `${v} indie`;
    }

    await runSongSearch(search);
  }

  async function handlePublish() {
    if (!imageUrl && !caption.trim() && !selectedTrack) {
      setStatus("Add a song, caption, or image first.");
      return;
    }

    setStatus("Posting...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first.");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      image_url: imageUrl || null,
      caption: caption.trim() || null,
      mood_line: moodLine.trim() || null,
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

    router.push("/feed");
  }

  return (
    <main className="min-h-screen bg-[#dce8f4] text-[#333]">
      <header className="border-b-2 border-[#1e4a80] bg-gradient-to-b from-[#5b8ecc] via-[#3d6fad] to-[#2f5c99] px-3 py-2">
        <div className="mx-auto flex max-w-[900px] items-center justify-between">
          <button onClick={() => router.push("/feed")} className="font-serif text-[30px] font-bold text-white drop-shadow">
            <span className="text-[#a8caf0]">[</span>klyp<span className="text-[#a8caf0]">]</span>
          </button>
          <div className="text-right text-[11px] text-[#c8dff5]">
            <div>new post</div>
            <div className="text-[10px] text-[#a8c8f0]">what are you listening to?</div>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#1e4270] bg-[#2f5c99] px-3 py-1">
        <div className="mx-auto flex max-w-[900px] items-center text-[11px]">
          <button onClick={() => router.push("/feed")} className="border-r border-[#3a6aaa] px-2 text-[#c8dff5] hover:text-white hover:underline">
            home
          </button>
          <button className="border-r border-[#3a6aaa] px-2 font-bold text-white">
            post song
          </button>
          <button onClick={() => router.push("/profile")} className="border-r border-[#3a6aaa] px-2 text-[#c8dff5] hover:text-white hover:underline">
            profile
          </button>
        </div>
      </nav>

      <div className="mx-auto grid max-w-[900px] gap-2 px-2 py-2 md:grid-cols-[1fr_260px]">
        <section className="border border-[#b0c8e0] bg-white">
          <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
            Post What You're Listening To
          </div>

          <div className="space-y-3 p-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[#444]">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="can't stop playing this..."
                className="min-h-[90px] w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px] outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-[#444]">
                Mood line
              </label>
              <input
                value={moodLine}
                onChange={(e) => setMoodLine(e.target.value)}
                placeholder="late train / city lights"
                className="w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px] outline-none"
              />
            </div>

            <div className="border border-[#b0c8e0] bg-[#f0f6fc] p-2">
              <div className="mb-2 text-[11px] font-bold text-[#1a3a66]">
                ♪ Add a track
              </div>

              <input
                value={query}
                onChange={(e) => searchSongs(e.target.value)}
                placeholder="search song directly, e.g. 505 Arctic Monkeys"
                className="mb-2 w-full border border-[#8aacca] bg-white px-2 py-2 text-[12px] outline-none"
              />

              <input
                value={vibe}
                onChange={(e) => searchByVibe(e.target.value)}
                placeholder="or describe a vibe, e.g. rainy night drive"
                className="w-full border border-[#8aacca] bg-white px-2 py-2 text-[12px] outline-none"
              />

              {searching ? (
                <div className="mt-2 text-[11px] text-[#557799]">searching...</div>
              ) : null}

              <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                {results.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrack(track);
                      setQuery(track.title);
                      setResults([]);
                    }}
                    className="flex w-full items-center gap-2 border border-[#dce8f5] bg-white p-2 text-left hover:bg-[#f8fcff]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#2f5c99] text-white">
                      {track.albumArt ? (
                        <img src={track.albumArt} alt="" className="h-full w-full object-cover" />
                      ) : (
                        "♪"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-bold text-[#1a3a66]">
                        {track.title}
                      </div>
                      <div className="truncate text-[11px] text-[#557799]">
                        {track.artist}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTrack ? (
                <div className="mt-2 flex items-center gap-2 border border-[#b0c8e0] bg-white p-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#b0c8e0] bg-[#2f5c99] text-white">
                    {selectedTrack.albumArt ? (
                      <img src={selectedTrack.albumArt} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "♪"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-bold text-[#1a3a66]">
                      {selectedTrack.title}
                    </div>
                    <div className="truncate text-[11px] text-[#557799]">
                      {selectedTrack.artist}
                    </div>
                    {selectedTrack.previewUrl ? (
                      <audio controls src={selectedTrack.previewUrl} className="mt-1 h-7 w-full" />
                    ) : null}
                  </div>
                  <button
                    onClick={() => setSelectedTrack(null)}
                    className="border border-[#cc6666] px-2 py-1 text-[10px] text-[#660000]"
                  >
                    remove
                  </button>
                </div>
              ) : null}
            </div>

            <div className="border border-[#b0c8e0] bg-[#f8fcff] p-2">
              <label className="block cursor-pointer border border-dashed border-[#8aacca] bg-white p-4 text-center">
                <div className="text-[12px] font-bold text-[#1a3a66]">
                  Choose image, optional
                </div>
                <div className="mt-1 text-[10px] text-[#557799]">
                  JPG, PNG, WEBP — max 5MB
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="mt-2 max-h-[360px] w-full border border-[#b0c8e0] object-cover" />
              ) : null}
            </div>

            {status ? (
              <div className="border border-[#b0c8e0] bg-[#f0f6fc] px-2 py-2 text-[11px] text-[#557799]">
                {status}
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-[#dce8f5] pt-3">
              <button
                onClick={() => router.push("/feed")}
                className="border border-[#7aacca] bg-[#dce8f4] px-4 py-2 text-[11px] text-[#1a3a66]"
              >
                Cancel
              </button>

              <button
                onClick={handlePublish}
                className="border border-[#1e4a80] bg-[#2f5c99] px-5 py-2 text-[11px] font-bold text-white"
              >
                Publish Post
              </button>
            </div>
          </div>
        </section>

        <aside className="border border-[#b0c8e0] bg-white">
          <div className="bg-gradient-to-b from-[#6496c8] to-[#4878aa] px-2 py-1 text-[11px] font-bold text-white">
            Live Preview
          </div>

          <div className="p-2">
            <div className="border border-[#b0c8e0] bg-[#f0f6fc] p-2">
              {selectedTrack ? (
                <div className="mb-2 flex items-center gap-2 border border-[#b0c8e0] bg-white p-2">
                  <div className="h-10 w-10 border border-[#b0c8e0] bg-[#2f5c99]">
                    {selectedTrack.albumArt ? (
                      <img src={selectedTrack.albumArt} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-bold text-[#1a3a66]">
                      {selectedTrack.title}
                    </div>
                    <div className="truncate text-[11px] text-[#557799]">
                      {selectedTrack.artist}
                    </div>
                  </div>
                </div>
              ) : null}

              {moodLine ? (
                <div className="mb-2 border border-[#dce8f5] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4878aa]">
                  {moodLine}
                </div>
              ) : null}

              <div className="whitespace-pre-line text-[12px] leading-5">
                {caption || "Your post will appear here."}
              </div>

              {imageUrl ? (
                <img src={imageUrl} alt="" className="mt-2 w-full border border-[#b0c8e0]" />
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
