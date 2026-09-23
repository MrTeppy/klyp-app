import { RetroBox, RetroShell } from "@/components/KlypRetro";

export default function AboutPage() {
  return (
    <RetroShell title="About" subtitle="what klyp is">
      <div className="grid gap-2 md:grid-cols-[1fr_240px]">
        <RetroBox title="About [klyp]">
          <p className="mb-2 leading-6">
            Klyp is a small music-first social site. Post what you're listening to,
            add a caption, share the moment, and find people through songs instead
            of boring algorithm slop.
          </p>
          <p className="leading-6">
            It is meant to feel like an old-school profile site, but with modern
            music previews and real posts.
          </p>
        </RetroBox>

        <RetroBox title="The vibe">
          <p className="leading-5">
            2000s internet, music profiles, little scenes, weird taste, proper
            personality.
          </p>
        </RetroBox>
      </div>
    </RetroShell>
  );
}
