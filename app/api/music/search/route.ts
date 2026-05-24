import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ tracks: [] });
  }

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    q
  )}&media=music&entity=song&limit=12&country=GB`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 },
    });

    const data = await res.json();

    const tracks = (data.results || []).map((t: any) => ({
      id: String(t.trackId),
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName,
      albumArt: t.artworkUrl100?.replace("100x100bb", "300x300bb") || null,
      previewUrl: t.previewUrl || null,
      externalUrl: t.trackViewUrl || null,
    }));

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 200 });
  }
}
