"use client";

import AppHeader from "@/components/AppHeader";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddToKlypPage({
  searchParams,
}: {
  searchParams: { post?: string };
}) {
  const postSlug = searchParams.post || "";
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  async function handleUpload() {
    if (!file) {
      setStatus("Choose an image first.");
      return;
    }

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

    setStatus("Uploading...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first.");
      return;
    }

    const path = `klyp/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("images").upload(path, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);

    const { error: insertError } = await supabase.from("klyp_items").insert({
      post_slug: postSlug,
      user_id: user.id,
      image_url: data.publicUrl,
      caption,
    });

    if (insertError) {
      setStatus(insertError.message);
      return;
    }

    setImageUrl(data.publicUrl);
    setStatus("Klyp added.");
    setTimeout(() => {
      window.location.href = "/feed";
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Klyp" />

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
              Klyp this post
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              Add your own moment
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-black/60">
              Add your photo to the same post so the memory becomes shared, not buried.
            </p>

            <div className="mt-6 rounded-[24px] border border-dashed border-black/15 bg-[#faf8f4] p-6">
              <label className="block cursor-pointer rounded-[20px] border border-black/10 bg-white p-5 text-center">
                <div className="text-[15px] font-medium">Choose image</div>
                <div className="mt-2 text-sm text-black/50">
                  JPG, PNG, WEBP — max 5MB
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-black/55">Small note</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="same night, different angle"
                className="min-h-[120px] w-full rounded-[22px] border border-black/10 bg-[#faf8f4] px-4 py-4 outline-none"
              />
            </div>

            {status ? <p className="mt-4 text-sm text-black/55">{status}</p> : null}

            <button
              onClick={handleUpload}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Klyp
            </button>
          </section>

          <aside className="rounded-[30px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
              Preview
            </div>

            <div className="mt-4 rounded-[24px] border border-black/10 bg-[#faf8f4] p-3">
              <div className="aspect-[9/16] overflow-hidden rounded-[22px] bg-[#e7e2d9]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : file ? (
                  <div className="flex h-full items-center justify-center text-sm text-black/45">
                    Ready to upload
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black/35">
                    Your Klyp will preview here
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-[18px] bg-white p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Klyp addition
                </div>
                <div className="mt-2 text-[14px] font-medium leading-6">
                  {caption || "Your note will appear here."}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
