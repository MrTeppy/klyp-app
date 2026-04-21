"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SpotifyConnectButton({
  primaryLabel = "Connect Spotify",
  connectedLabel = "Spotify Connected",
}: {
  primaryLabel?: string;
  connectedLabel?: string;
}) {
  const [connected, setConnected] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    setConnected(!!token);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <span className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/45">
        Checking Spotify…
      </span>
    );
  }

  if (connected) {
    return (
      <Link
        href="/profile"
        className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/70 transition hover:bg-black/5"
      >
        {connectedLabel}
      </Link>
    );
  }

  return (
    <Link
      href="/spotify"
      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/70 transition hover:bg-black/5"
    >
      {primaryLabel}
    </Link>
  );
}
