import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-7xl px-6 py-6">

        <AppHeader subtitle="Your Space" />

        {/* HERO */}
        <section className="mt-20 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-6xl md:text-7xl font-semibold tracking-[-0.06em] leading-[0.95]">
              social,
              <br />
              but with
              <br />
              <span className="text-black/40">actual taste.</span>
            </h1>

            <p className="mt-6 text-lg text-black/60 max-w-xl leading-8">
              KLYP turns posts into atmosphere. Attach music, capture moments,
              and let people continue the feeling instead of just reacting.
            </p>

            <div className="mt-8 flex gap-3">
              <Button href="/feed">Enter KLYP</Button>
              <Button href="/spotify" variant="secondary">
                Connect Spotify
              </Button>
            </div>

            {/* TAGS */}
            <div className="mt-10 flex gap-2 flex-wrap">
              <span className="text-xs bg-white border border-black/10 px-3 py-1 rounded-full text-black/50">
                Image + Music Posts
              </span>
              <span className="text-xs bg-white border border-black/10 px-3 py-1 rounded-full text-black/50">
                Spotify Linked
              </span>
              <span className="text-xs bg-white border border-black/10 px-3 py-1 rounded-full text-black/50">
                Mood Based
              </span>
            </div>
          </div>

          {/* RIGHT PREVIEW CARD */}
          <div className="bg-white border border-black/10 rounded-[28px] p-4 shadow-sm">

            <div className="mb-3 text-xs text-black/40">
              Now Playing — Let Down (Radiohead)
            </div>

            <div className="rounded-2xl bg-[#ddd] aspect-[4/5]" />

            <div className="mt-4 bg-[#faf8f4] rounded-xl p-4">
              <div className="text-xs text-black/40 mb-1">MUSIC POST</div>
              <div className="text-sm font-medium">
                train window reflections, city lights, same song again
              </div>

              <div className="mt-3 text-xs text-black/50">
                Late Train / City Lights
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm text-black/50">
              <span>42 likes · 3 klyps</span>
              <button className="px-3 py-1 rounded-full bg-black text-white text-xs">
                Klyp
              </button>
            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="mt-24 grid gap-6 md:grid-cols-3">

          <div className="bg-white border border-black/10 rounded-2xl p-6">
            <div className="text-xs text-black/40 mb-2">POSTS</div>
            <div className="text-lg font-medium">
              image, song, mood, memory
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-6">
            <div className="text-xs text-black/40 mb-2">CHAINS</div>
            <div className="text-lg font-medium">
              continue the feeling
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-6">
            <div className="text-xs text-black/40 mb-2">AI</div>
            <div className="text-lg font-medium">
              your mood, understood
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
