"use client";

import { useEffect, useRef } from "react";

let currentAudio: HTMLAudioElement | null = null;

export default function AutoPlayAudio({ src }: { src: string | null }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!src || !ref.current) return;

    const audio = new Audio(src);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
          }

          currentAudio = audio;
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      audio.pause();
    };
  }, [src]);

  return <div ref={ref} />;
}
