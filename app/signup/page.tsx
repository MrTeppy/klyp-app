"use client";

import { useState } from "react";
import Link from "next/link";
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
        emailRedirectTo: "https://klyp.life/auth/callback",
        data: { username, display_name: displayName },
      },
    });

    if (error) { setMessage(error.message); return; }
    if (!data.user) { setMessage("Something went wrong."); return; }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      display_name: displayName,
    });

    if (profileError) { setMessage(profileError.message); return; }
    setMessage("Check your email to confirm your account.");
  }

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111] text-2xl font-bold text-[#d7a96b] shadow-md">
            K
          </div>
          <div className="tracking-[0.45em] text-lg font-semibold">KLYP</div>
        </div>

        <div className="rounded-[28px] border border-[#e0d6ca] bg-[#fffaf3] p-6 shadow-[0_12px_35px_rgba(55,39,20,0.08)]">
          <h1 className="text-2xl font-semibold tracking-tight">Join KLYP</h1>
          <p className="mt-1 text-sm text-[#82766b]">Create your identity first.</p>

          <form onSubmit={handleSignup} className="mt-5 space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-[#e0d6ca] bg-[#f4efe8] px-4 py-3 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-2xl border border-[#e0d6ca] bg-[#f4efe8] px-4 py-3 text-sm outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#e0d6ca] bg-[#f4efe8] px-4 py-3 text-sm outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#e0d6ca] bg-[#f4efe8] px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#111] py-3 text-sm font-medium text-white active:opacity-70"
            >
              Create Account
            </button>
          </form>

          {message ? <p className="mt-3 text-sm text-[#82766b]">{message}</p> : null}

          <p className="mt-5 text-center text-sm text-[#82766b]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#111] underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
