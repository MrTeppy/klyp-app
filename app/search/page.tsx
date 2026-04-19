"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-[#efe9df] text-[#171717] p-6">
      <h1 className="text-3xl font-semibold mb-6">Search</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full rounded-full border px-4 py-3"
      />

      <button className="mt-3 rounded-full bg-black px-4 py-2 text-white">
        Search
      </button>
    </main>
  );
}
