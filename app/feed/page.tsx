import AppHeader from "@/components/AppHeader";
import SpotifyInsights from "@/components/SpotifyInsights";
import Comments from "@/components/Comments";

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Feed" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <article className="rounded-[30px] border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-medium">Charlie</div>
                  <div className="text-[13px] text-black/55">@charlie · Friends Can Add</div>
                </div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/50">
                  Linked from Spotify
                </div>
              </div>

              <div className="mx-auto max-w-[390px]">
                <div className="aspect-[9/16] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#d8ddd4,#9aa58e_48%,#6e7769)]" />
              </div>

              <div className="mt-4 rounded-[22px] bg-[#faf8f4] p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Main Post
                </div>
                <div className="mt-2 text-[15px] font-medium leading-6">
                  train window reflections, city lights, and the exact song that made the whole thing feel cinematic
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-[12px] text-black/55">
                    Let Down — Radiohead
                  </span>
                  <span className="rounded-full bg-white px-3 py-2 text-[12px] text-black/55">
                    Late Train / City Lights
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[13px] text-black/50">
                  42 Likes · 2 additions · 12 Comments
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  Add to Klyp
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="ml-auto max-w-[280px] rounded-[22px] border border-black/10 bg-[#faf8f4] p-3">
                  <div className="text-[12px] text-black/40">Added by Ivy</div>
                  <div className="mt-2 text-[14px] font-medium">same night, same replayed mood</div>
                </div>
                <div className="mr-auto max-w-[280px] rounded-[22px] border border-black/10 bg-[#faf8f4] p-3">
                  <div className="text-[12px] text-black/40">Added by Noah</div>
                  <div className="mt-2 text-[14px] font-medium">end of the night / blurry lights</div>
                </div>
              </div>

              <Comments postSlug="late-train-city-lights" />
            </article>
          </section>

          <aside>
            <SpotifyInsights />
          </aside>
        </div>
      </div>
    </main>
  );
}
