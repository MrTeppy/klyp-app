import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ tracks: [] });
  }

  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      q
    )}&media=music&entity=song&limit=12`
  );

  const data = await res.json();

  const tracks = data.results.map((track: any) => ({
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    albumArt: track.artworkUrl100?.replace("100x100bb", "600x600bb"),
    previewUrl: track.previewUrl,
    externalUrl: track.trackViewUrl,
    source: "itunes",
  }));

  return NextResponse.json({ tracks });
}

