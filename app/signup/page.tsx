"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Creating account...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://klyp-app.vercel.app/auth/callback",
        data: {
          username,
          display_name: displayName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessage("Something went wrong.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      display_name: displayName,
    });

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
            Create Account
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Join KLYP
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-black/60">
            Create your identity first. Username, display name, then the rest.
          </p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[#faf8f4] px-4 py-3 outline-none"
            />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Account
            </button>
          </form>

          {message ? (
            <p className="mt-4 text-sm text-black/55">{message}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
