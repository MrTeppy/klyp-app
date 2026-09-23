"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

type Track = {
  id: string;
  title: string;
  artist: string;
  albumArt?: string | null;
  previewUrl?: string | null;
  externalUrl?: string | null;
};

export default function UploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [posting, setPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [moodLine, setMoodLine] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Uploading image...");

    const filePath = `posts/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await supabase.storage.from("images").upload(filePath, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setStatus("Image uploaded.");
  }

  async function searchSongs() {
    if (!query.trim()) return;

    setStatus("Searching songs...");
    const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    setResults(data.tracks || []);
    setStatus("");
  }

  async function handlePublish() {
    if (posting) return;

    if (!caption.trim() && !imageUrl && !selectedTrack) {
      setStatus("Add a song, caption, or image first.");
      return;
    }

    setPosting(true);
    setStatus("Posting...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setPosting(false);
      setStatus("Log in first.");
      router.push("/login");
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
      setPosting(false);
      setStatus(error.message);
      return;
    }

    router.push("/feed");
  }

  return (
    <RetroShell title="Post Song" subtitle="make a new Klyp">
      <div className="grid gap-2 md:grid-cols-[1fr_260px]">
        <section>
          <RetroBox title="Post What You're Listening To">
            <label className="mb-1 block text-[11px] font-bold">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="can't stop playing this..."
              className="mb-3 min-h-[90px] w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]"
            />

            <label className="mb-1 block text-[11px] font-bold">Mood line</label>
            <input
              value={moodLine}
              onChange={(e) => setMoodLine(e.target.value)}
              placeholder="late train / city lights"
              className="mb-3 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]"
            />

            <div className="mb-3 border border-[#b0c8e0] bg-[#f0f6fc] p-2">
              <div className="mb-2 text-[11px] font-bold text-[#1a3a66]">♪ Add a track</div>
              <div className="flex gap-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchSongs()}
                  placeholder="505 Arctic Monkeys"
                  className="flex-1 border border-[#8aacca] bg-white px-2 py-2 text-[12px]"
                />
                <RetroButton onClick={searchSongs}>Search</RetroButton>
              </div>

              <div className="mt-2 grid gap-1">
                {results.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedTrack(track);
                      setResults([]);
                    }}
                    className="flex items-center gap-2 border border-[#dce8f5] bg-white p-2 text-left hover:bg-[#f8fcff]"
                  >
                    <div className="h-10 w-10 border border-[#b0c8e0] bg-[#2f5c99]">
                      {track.albumArt ? <img src={track.albumArt} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#1a3a66]">{track.title}</div>
                      <div className="text-[11px] text-[#557799]">{track.artist}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTrack ? (
                <div className="mt-2 border border-[#b0c8e0] bg-white p-2">
                  <div className="text-[12px] font-bold text-[#1a3a66]">{selectedTrack.title}</div>
                  <div className="text-[11px] text-[#557799]">{selectedTrack.artist}</div>
                  {selectedTrack.previewUrl ? <audio controls src={selectedTrack.previewUrl} className="mt-1 h-7 w-full" /> : null}
                  <button onClick={() => setSelectedTrack(null)} className="mt-1 text-[10px] text-[#cc0000] hover:underline">
                    remove track
                  </button>
                </div>
              ) : null}
            </div>

            <label className="block cursor-pointer border border-dashed border-[#8aacca] bg-[#f8fcff] p-4 text-center">
              <div className="text-[12px] font-bold text-[#1a3a66]">Choose image, optional</div>
              <div className="text-[10px] text-[#557799]">JPG, PNG, WEBP</div>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="hidden" />
            </label>

            {status ? <div className="mt-3 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[11px] text-[#557799]">{status}</div> : null}

            <div className="mt-3 flex justify-between border-t border-[#dce8f5] pt-3">
              <RetroButton onClick={() => router.push("/feed")}>Cancel</RetroButton>
              <RetroButton primary disabled={posting} onClick={handlePublish}>
                {posting ? "Posting..." : "Publish Post"}
              </RetroButton>
            </div>
          </RetroBox>
        </section>

        <aside>
          <RetroBox title="Live Preview">
            {selectedTrack ? (
              <div className="mb-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[12px]">
                <strong>{selectedTrack.title}</strong>
                <br />
                <span className="text-[#557799]">{selectedTrack.artist}</span>
              </div>
            ) : null}
            {moodLine ? (
              <div className="mb-2 border border-[#dce8f5] bg-[#f8fcff] p-1 text-[10px] font-bold uppercase tracking-widest text-[#4878aa]">
                {moodLine}
              </div>
            ) : null}
            <div className="whitespace-pre-line text-[12px] leading-5">
              {caption || "Your post will appear here."}
            </div>
            {imageUrl ? <img src={imageUrl} alt="" className="mt-2 w-full border border-[#b0c8e0]" /> : null}
          </RetroBox>
        </aside>
      </div>
    </RetroShell>
  );
}
