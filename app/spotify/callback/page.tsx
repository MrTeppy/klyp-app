"use client";

import { useEffect, useState } from "react";

export default function SpotifyCallbackPage() {
  const [message, setMessage] = useState("Connecting Spotify…");
  const [error, setError] = useState("");

  useEffect(() => {
    async function connect() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const authError = params.get("error");

        if (authError) {
          setError(`Spotify error: ${authError}`);
          return;
        }

        if (!code) {
          setError("No Spotify code returned.");
          return;
        }

        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
        const codeVerifier = localStorage.getItem("spotify_code_verifier");
        const redirectUri = "https://klyp-app.vercel.app/spotify/callback";
        if (!codeVerifier) {
          setError("Missing code verifier. Please try connecting again.");
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
          setError(tokenData.error_description || "Failed to get Spotify token.");
          return;
        }

        localStorage.setItem("spotify_access_token", tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
        }

        setMessage("Spotify connected. Redirecting…");
        window.setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      } catch (e) {
        setError("Something went wrong while connecting Spotify.");
      }
    }

    connect();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">
        <div className="w-full rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
            Spotify
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {error ? "Connection failed" : "Finishing connection"}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/60">
            {error || message}
          </p>

          {error ? (
            <a
              href="/spotify"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Try Again
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}
