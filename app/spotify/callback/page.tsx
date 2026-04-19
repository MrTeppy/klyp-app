"use client";

import { useEffect, useState } from "react";

export default function SpotifyCallbackPage() {
  const [message, setMessage] = useState("Connecting Spotify…");

  useEffect(() => {
    async function connect() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        setMessage(`Spotify error: ${error}`);
        return;
      }

      if (!code) {
        setMessage("No Spotify code returned.");
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
      const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
      const codeVerifier = localStorage.getItem("spotify_code_verifier");

      if (!codeVerifier) {
        setMessage("Missing code verifier.");
        return;
      }

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      });

      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        setMessage(tokenData.error_description || "Failed to get token.");
        return;
      }

      localStorage.setItem("spotify_access_token", tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
      }

      setMessage("Spotify connected. Redirecting…");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 800);
    }

    connect();
  }, []);

  return (
    <main className="min-h-screen bg-[#efe9df] text-[#171717] flex items-center justify-center p-6">
      <div className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Spotify</h1>
        <p className="mt-3 text-black/60">{message}</p>
      </div>
    </main>
  );
}
