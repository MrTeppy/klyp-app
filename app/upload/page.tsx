"use client";

import AppHeader from "@/components/AppHeader";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [moodLine, setMoodLine] = useState("");
  const [soundTitle, setSoundTitle] = useState("");
  const [soundArtist, setSoundArtist] = useState("");
  const [soundType, setSoundType] = useState("track");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setStatus("Uploading image...");

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

    const slug = `post-${Date.now()}`;

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      image_url: imageUrl,
      caption,
      mood_line: moodLine,
      sound_title: soundTitle,
      sound_artist: soundArtist,
      sound_type: soundType,
      visibility: "friends",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Posted.");
    setTimeout(() => {
      window.location.href = "/feed";
    }, 800);
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
              Start with the image, then attach the sound that held the post together.
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

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-black/55">Title</label>
                  <input
                    value={soundTitle}
                    onChange={(e) => setSoundTitle(e.target.value)}
                    placeholder="Let Down"
                    className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-black/55">Artist / Source</label>
                  <input
                    value={soundArtist}
                    onChange={(e) => setSoundArtist(e.target.value)}
                    placeholder="Radiohead"
                    className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm text-black/55">Type</label>
                <select
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value)}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 outline-none"
                >
                  <option value="track">Track</option>
                  <option value="sound">Sound</option>
                  <option value="voice">Voice note</option>
                </select>
              </div>
            </div>

            {status ? <p className="mt-4 text-sm text-black/55">{status}</p> : null}

            <button
              onClick={handlePublish}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
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
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
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

                <div className="mt-3 flex flex-wrap gap-2">
                  {soundTitle ? (
                    <span className="rounded-full bg-[#faf8f4] px-3 py-2 text-[11px] text-black/55">
                      {soundTitle}{soundArtist ? ` — ${soundArtist}` : ""}
                    </span>
                  ) : null}
                  {moodLine ? (
                    <span className="rounded-full bg-[#faf8f4] px-3 py-2 text-[11px] text-black/55">
                      {moodLine}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
