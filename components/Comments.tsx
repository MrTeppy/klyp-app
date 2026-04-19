"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Comments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  async function loadComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: false });

    if (!error) setComments(data || []);
  }

  useEffect(() => {
    loadComments();
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setStatus("Posting…");
    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email || "guest@klyp.local";

    const { error } = await supabase.from("comments").insert({
      post_slug: postSlug,
      user_email: email,
      body: body.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setBody("");
    setStatus("");
    loadComments();
  }

  return (
    <div className="mt-5 rounded-[24px] border border-black/10 bg-[#faf8f4] p-4">
      <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
        Comments
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Say something…"
          className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
        <button className="rounded-full bg-black px-4 py-3 text-sm text-white">
          Comment
        </button>
      </form>

      {status ? <p className="mt-3 text-sm text-black/55">{status}</p> : null}

      <div className="mt-4 space-y-3">
        {comments.length ? (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-white p-4">
              <div className="text-[13px] font-medium">{comment.user_email}</div>
              <div className="mt-1 text-[14px] text-black/70">{comment.body}</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-black/55">No comments yet.</div>
        )}
      </div>
    </div>
  );
}
