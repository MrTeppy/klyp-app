"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Logged in.");
    router.push("/feed");
  }

  return (
    <main className="min-h-screen bg-[#f3efe7] text-[#161616] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[30px] border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Log In</h1>
        <p className="mt-2 text-black/55">Enter your KLYP account.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-black px-4 py-3 text-white"
          >
            Log In
          </button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-black/60">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
