import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#111]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="klyp.life" />

        <section className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Shared Memory Posts
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Spotify Linked
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Add to Klyp
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.07em] leading-[0.92] sm:text-6xl md:text-7xl">
              social,
              <br />
              but with
              <br />
              <span className="text-black/35">actual taste.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-7 text-black/60 sm:text-[18px] sm:leading-8">
              KLYP turns one post into a shared memory. Start with your image,
              attach the song, then let friends add their own moments into the same post.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/feed"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Enter KLYP
              </a>
              <SpotifyConnectButton />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[430px]">
            <div className="space-y-4">
              <article className="mr-auto w-[84%] rounded-[28px] border border-black/10 bg-white p-3 shadow-sm sm:w-[78%]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-black/40">Main Post</div>
                    <div className="mt-1 text-[13px] font-medium">
                      Charlie · city lights
                    </div>
                  </div>
                  <div className="rounded-full bg-black px-3 py-1 text-[11px] text-white">
                    Live
                  </div>
                </div>

                <div className="aspect-[9/16] rounded-[22px] bg-[linear-gradient(180deg,#d8ddd4,#9aa58e_48%,#6e7769)]" />

                <div className="mt-3 rounded-[18px] bg-[#faf8f4] p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Music Post
                  </div>
                  <div className="mt-2 text-[13px] font-medium leading-5">
                    train window reflections, city lights, same song again
                  </div>
                  <div className="mt-3 text-[11px] text-black/50">
                    Let Down — Radiohead
                  </div>
                </div>
              </article>

              <article className="ml-auto w-[84%] rounded-[28px] border border-black/10 bg-white p-3 shadow-sm sm:w-[78%]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-black/40">Added to Klyp</div>
                    <div className="mt-1 text-[13px] font-medium">
                      Ivy · same night
                    </div>
                  </div>
                  <div className="rounded-full border border-black/10 px-3 py-1 text-[11px] text-black/55">
                    +3 photos
                  </div>
                </div>

                <div className="aspect-[9/16] rounded-[22px] bg-[linear-gradient(180deg,#e8dfd6,#c9b29a_55%,#a28668)]" />

                <div className="mt-3 rounded-[18px] bg-[#faf8f4] p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Continuation
                  </div>
                  <div className="mt-2 text-[13px] font-medium leading-5">
                    different angle, same replayed mood
                  </div>
                  <div className="mt-3 text-[11px] text-black/50">
                    shared post, not just a reply
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
