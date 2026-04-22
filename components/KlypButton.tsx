"use client";

export default function KlypButton({ postSlug }: { postSlug: string }) {
  return (
    <a
      href={`/klyp/add?post=${encodeURIComponent(postSlug)}`}
      className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
    >
      Klyp
    </a>
  );
}
