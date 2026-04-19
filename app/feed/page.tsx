import AppHeader from "@/components/AppHeader";
import SpotifyInsights from "@/components/SpotifyInsights";
import Comments from "@/components/Comments";

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#efe9df] text-[#171717]">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
        <AppHeader subtitle="Feed" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#74806b,#d8ded2)]" />
                  <div>
                    <div className="text-[15px] font-medium">@charlie</div>
                    <div className="text-[12px] text-black/45">Friends Can Klyp · 12m Ago</div>
                  </div>
                </div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/50">
                  Linked from Spotify
                </div>
              </div>

              <div className="mb-4 rounded-[24px] border border-black/10 bg-[#faf8f4] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] text-black/38">Now Playing</div>
                    <div className="mt-1 text-[15px] font-medium">Let Down — Radiohead</div>
                    <div className="text-[12px] text-black/45">from listening history</div>
                  </div>
                  <div className="rounded-full bg-black px-3 py-1 text-[12px] text-white">Spotify</div>
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#dfe6d8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f3f6ef,transparent_30%),linear-gradient(180deg,#89977f,#5a6755)]" />
                <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[12px] text-white">
                  IMAGE
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white/75 p-4 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">Music Post</div>
                  <div className="mt-2 text-[16px] font-medium leading-6">
                    train window reflections, city lights, and the exact song that made the whole thing feel cinematic
                  </div>
                  <div className="mt-3 rounded-full bg-black/5 px-3 py-2 text-[12px] text-black/55 inline-block">
                    Late Train / City Lights
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[13px] text-black/50">
                  <span>42 Likes</span>
                  <span>8 Saves</span>
                  <span>3 Klyps</span>
                </div>
                <button className="rounded-full bg-black px-4 py-2 text-[13px] text-white">
                  Klyp This
                </button>
              </div>

              <Comments postSlug="late-train-city-lights" />
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#d5c0a0,#f3e8d9)]" />
                  <div>
                    <div className="text-[15px] font-medium">@noah</div>
                    <div className="text-[12px] text-black/45">Everyone Can Klyp · 38m Ago</div>
                  </div>
                </div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/50">
                  Mood Post
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#efe4d6]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#e8dbc8,#c6ae8f)]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white/78 p-4 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">Chain Starter</div>
                  <div className="mt-2 text-[16px] font-medium leading-6">
                    summer evening, empty court, one song on repeat
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[13px] text-black/50">
                  <span>19 Likes</span>
                  <span>2 Saves</span>
                  <span>5 Klyps</span>
                </div>
                <button className="rounded-full bg-black px-4 py-2 text-[13px] text-white">
                  Klyp This
                </button>
              </div>

              <Comments postSlug="summer-evening-court" />
            </div>
          </section>

          <aside>
            <SpotifyInsights />
          </aside>
        </div>
      </div>
    </main>
  );
}
