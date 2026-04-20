"use client";

function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach((x) => (result += chars[x % chars.length]));
  return result;
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export default function SpotifyPage() {
  async function handleConnect() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const redirectUri = "https://klyp-app.vercel.app/spotify/callback";
    const codeVerifier = randomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(hashed);

    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const scope = [
      "user-read-email",
      "user-read-private",
      "user-read-recently-played",
      "user-top-read",
    ].join(" ");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">
        <div className="w-full rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">
            Spotify
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Connect your listening
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-black/60">
            Link Spotify to unlock top songs, daily recap, mood cards, and better posts.
          </p>

          <button
            onClick={handleConnect}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    </main>
  );
}
