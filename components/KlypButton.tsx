"use client";

export default function KlypButton({ postSlug }: { postSlug: string }) {
  return (
    <a href={`/klyp/add?post=${postSlug}`}>
      Add to Klyp
    </a>
  );
}
