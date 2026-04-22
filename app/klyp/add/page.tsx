"use client";

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

  async function handleUpload() {
    if (!file) return;

    setStatus("Uploading...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("Log in first");
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
    });

    if (insertError) {
      setStatus(insertError.message);
      return;
    }

    setStatus("Done");
    window.location.href = "/feed";
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Add to Klyp</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>Upload</button>

      <p>{status}</p>
    </main>
  );
}
