"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage(error.message); return; }
    router.push("/feed");
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
          <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
          <p className="mt-1 text-sm text-[#82766b]">Welcome back.</p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3">
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
              Log In
            </button>
          </form>

          {message ? <p className="mt-3 text-sm text-[#82766b]">{message}</p> : null}

          <p className="mt-5 text-center text-sm text-[#82766b]">
            No account?{" "}
            <Link href="/signup" className="font-medium text-[#111] underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
