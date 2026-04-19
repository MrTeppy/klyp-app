"use client";

import AppHeader from "@/components/AppHeader";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [song, setSong] = useState("Let Down — Radiohead");
  const [mood, setMood] = useState("Late Train / City Lights");

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

    setStatus("Uploading image…");

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

  return (
    <main className="min-h-screen bg-[#efe9df] text-[#171717]">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
        <AppHeader subtitle="Create Post" />

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-[34px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
                  New Image Post
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Build the atmosphere first
                </h1>
              </div>
              <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/50">
                Image + Song + Mood
              </div>
            </div>

            <label className="block cursor-pointer rounded-[28px] border border-dashed border-black/15 bg-[#faf8f4] p-6 text-center">
              <div className="text-[15px] font-medium">Upload Cover Image</div>
              <div className="mt-2 text-sm text-black/50">JPG, PNG, WEBP — max 5MB</div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleUpload}
                className="hidden"
              />
            </label>

            {status ? <p className="mt-4 text-sm text-black/55">{status}</p> : null}

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-black/55">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="city lights through scratched train glass and the same song again"
                  className="min-h-[120px] w-full rounded-[22px] border border-black/10 bg-[#faf8f4] px-4 py-4 outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-black/55">Attached Song</label>
                  <input
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    className="w-full rounded-[18px] border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-black/55">Mood Line</label>
                  <input
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-[18px] border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[34px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
              Live Preview
            </div>

            <div className="mt-4 rounded-[28px] border border-black/10 bg-[#faf8f4] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium">@charlie</div>
                  <div className="text-[12px] text-black/45">Friends Can Klyp · now</div>
                </div>
                <div className="rounded-full bg-black px-3 py-1 text-[12px] text-white">Draft</div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#e7e2d9]">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <div className="aspect-[4/5] w-full bg-[linear-gradient(180deg,#e8e0d5,#cdbba3)]" />
                )}
              </div>

              <div className="mt-3 rounded-[20px] bg-white p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">Music Post</div>
                <div className="mt-2 text-[15px] font-medium leading-6">
                  {caption || "Your caption will show here once you write it."}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded-full border border-black/10 bg-[#faf8f4] px-3 py-2 text-[13px] text-black/70">
                    {song}
                  </div>
                  <div className="rounded-full border border-black/10 bg-[#faf8f4] px-3 py-2 text-[13px] text-black/55">
                    {mood}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
