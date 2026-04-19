"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [username, setUsername] = useState("");
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
        emailRedirectTo: "http://localhost:3000/auth/callback",
        data: {
          username,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      setMessage("Check your email to confirm your account.");
    } else {
      setMessage("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f3efe7] text-[#161616] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[30px] border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
        <p className="mt-2 text-black/55">Start your space on KLYP.</p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
          />
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
            Create Account
          </button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-black/60">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
