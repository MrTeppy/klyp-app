"use client";

import Link from "next/link";

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-[#f3efe7] text-[#161616] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[30px] border border-black/10 bg-white p-6 shadow-sm text-center">
        <h1 className="text-2xl font-semibold">Email Confirmed</h1>
        <p className="mt-3 text-black/60">
          Your account is confirmed. Now log in to enter KLYP.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-3 text-white"
          >
            Log In
          </Link>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-black/70"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
