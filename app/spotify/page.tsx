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
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

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
    <main className="min-h-screen bg-[#efe9df] text-[#171717] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-[30px] border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Connect Spotify</h1>
        <p className="mt-3 text-black/60">
          Link your listening history to KLYP.
        </p>

        <button
          onClick={handleConnect}
          className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white"
        >
          Connect Spotify
        </button>
      </div>
    </main>
  );
}
