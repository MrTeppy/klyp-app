"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RetroBox, RetroButton, RetroShell } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function login() {
    setStatus("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus(error.message);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <RetroShell title="Log In" subtitle="welcome back to klyp">
      <div className="mx-auto max-w-[420px]">
        <RetroBox title="Log in to [klyp]">
          <label className="mb-1 block text-[11px] font-bold">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          <label className="mb-1 block text-[11px] font-bold">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} className="mb-3 w-full border border-[#8aacca] bg-[#f8fcff] px-2 py-2 text-[12px]" />

          {status ? <div className="mb-2 border border-[#b0c8e0] bg-[#f0f6fc] p-2 text-[11px] text-[#557799]">{status}</div> : null}

          <div className="flex justify-between">
            <RetroButton onClick={() => router.push("/signup")}>Create account</RetroButton>
            <RetroButton primary onClick={login}>Log In</RetroButton>
          </div>
        </RetroBox>
      </div>
    </RetroShell>
  );
}
