"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function signup() {
    setStatus("Creating account...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username,
        },
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Account created. If it asks for email confirmation, confirm it then log in.");
    setTimeout(() => router.push("/feed"), 900);
  }

  return (
    <RetroShell title="Sign Up" subtitle="join klyp">
      <div className="mx-auto max-w-[420px]">
        <RetroBox title="Sign up for [klyp]">
          <label className="mb-1 block text-[11px] font-bold">Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          <label className="mb-1 block text-[11px] font-bold">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="charlie_h" className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          <label className="mb-1 block text-[11px] font-bold">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          <label className="mb-1 block text-[11px] font-bold">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          {status ? <div className="mb-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[11px] text-[#557799]">{status}</div> : null}

          <div className="flex justify-between">
            <RetroButton onClick={() => router.push("/login")}>Already have one?</RetroButton>
            <RetroButton primary onClick={signup}>Create Account</RetroButton>
          </div>
        </RetroBox>
      </div>
    </RetroShell>
  );
}
