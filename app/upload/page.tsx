"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Add a photo first");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("song", song);

      // ⚠️ CHANGE THIS if your API route is different
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      router.push("/feed");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] px-4 py-6 text-[#111]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="tracking-[0.4em] text-sm font-semibold text-[#9b7a4d]">
              KLYP
            </p>
            <h1 className="mt-2 font-serif text-5xl italic">new memory</h1>
          </div>

          <button
            onClick={() => router.push("/feed")}
            className="rounded-full bg-[#111] px-4 py-2 text-sm text-white"
          >
            Cancel
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-[#e0d6ca] bg-[#fffaf3] p-5 shadow-[0_18px_45px_rgba(55,39,20,0.10)]"
        >
          {/* Upload */}
          <label className="mb-5 flex h-72 cursor-pointer flex-col items-center justify-center rounded-[26px] border border-dashed border-[#c9b89f] bg-[#f7efe5] text-center">
            {preview ? (
              <img
                src={preview}
                className="h-full w-full object-cover rounded-[26px]"
              />
            ) : (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-2xl text-[#d7a96b]">
                  +
                </div>
                <p className="text-lg font-semibold">Add photo</p>
                <p className="mt-1 text-sm text-[#74695f]">
                  choose the moment you want to klyp
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="late night drives hit different..."
            className="mb-4 h-28 w-full resize-none rounded-2xl border border-[#e0d6ca] bg-[#fdf8f0] p-4 font-serif text-xl outline-none"
          />

          {/* Song */}
          <input
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="Song (optional)"
            className="mb-4 w-full rounded-2xl border border-[#e0d6ca] bg-[#fdf8f0] p-3 text-sm outline-none"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#111] py-4 text-base font-semibold text-white shadow-lg disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post to KLYP"}
          </button>
        </form>
      </div>
    </main>
  );
}
