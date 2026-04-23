import AppHeader from "@/components/AppHeader";
import SpotifyInsights from "@/components/SpotifyInsights";
import Comments from "@/components/Comments";
import KlypButton from "@/components/KlypButton";

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#151515]">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Feed" />

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <article className="rounded-[32px] border border-black/10 bg-white/88 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-medium">Charlie</div>
                  <div className="text-[13px] text-black/55">@charlie · Friends Can Klyp</div>
                </div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/50">
                  Linked from Spotify
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[420px_1fr] lg:items-start">
                <div className="mx-auto w-full max-w-[420px]">
                  <div className="aspect-[9/16] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#d8ddd4,#9ca48a_46%,#5d6653)]" />
                </div>

                <div>
                  <div className="rounded-[24px] bg-[#faf8f4] p-5">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                      Main Post
                    </div>
                    <div className="mt-3 text-[18px] font-medium leading-7">
                      train window reflections, city lights, and the exact song
                      that made the whole thing feel cinematic
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
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
                      42 Likes · 12 Comments
                    </div>
                    <KlypButton postSlug="late-train-city-lights" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-black/10 bg-[#faf8f4] p-4">
                      <div className="text-[12px] text-black/40">Klyped by Ivy</div>
                      <div className="mt-2 text-[14px] font-medium leading-6">
                        same night, same replayed mood
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-[#faf8f4] p-4">
                      <div className="text-[12px] text-black/40">Klyped by Noah</div>
                      <div className="mt-2 text-[14px] font-medium leading-6">
                        end of the night / blurry lights
                      </div>
                    </div>
                  </div>
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
