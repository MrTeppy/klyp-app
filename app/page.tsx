import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#111111]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <AppHeader subtitle="Your Space" />

        <section className="mt-8 grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Shared Memory Posts
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Spotify Linked
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/50">
                Friends Can Klyp
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.075em] leading-[0.9] sm:text-6xl md:text-7xl">
              social,
              <br />
              but with
              <br />
              <span className="text-black/35">actual taste.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-7 text-black/60 sm:text-[18px] sm:leading-8">
              KLYP turns one post into a shared memory. Start with your image
              and song, then let friends klyp their own photos into the same
              post instead of burying the moment in comments.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Enter KLYP
              </Link>

              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/70 transition hover:bg-black/5"
              >
                Upload Post
              </Link>

              <SpotifyConnectButton />
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Posts
                </div>
                <div className="mt-3 text-[16px] font-medium leading-6">
                  image, song, mood, memory
                </div>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Klyp
                </div>
                <div className="mt-3 text-[16px] font-medium leading-6">
                  add your own moment to the same post
                </div>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Music
                </div>
                <div className="mt-3 text-[16px] font-medium leading-6">
                  your week, understood through sound
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="pointer-events-none absolute -left-6 top-14 h-28 w-28 rounded-full bg-[#e8ded3] blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-28 h-28 w-28 rounded-full bg-[#dfe6db] blur-3xl" />

            <div className="relative space-y-4">
              <article className="mr-auto w-[86%] rounded-[30px] border border-black/10 bg-white p-3 shadow-sm sm:w-[80%]">
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

                <div className="aspect-[9/16] rounded-[24px] bg-[linear-gradient(180deg,#d8ddd4,#9da88f_46%,#6e7868)]" />

                <div className="mt-3 rounded-[18px] bg-[#faf8f4] p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Music Post
                  </div>
                  <div className="mt-2 text-[13px] font-medium leading-5">
                    train window reflections, city lights, same song again
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-[11px] text-black/50">
                      Let Down — Radiohead
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-[11px] text-black/50">
                      Late Train / City Lights
                    </span>
                  </div>
                </div>
              </article>

              <article className="ml-auto w-[86%] rounded-[30px] border border-black/10 bg-white p-3 shadow-sm sm:w-[80%]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-black/40">Klyped by Ivy</div>
                    <div className="mt-1 text-[13px] font-medium">
                      same night · different angle
                    </div>
                  </div>
                  <div className="rounded-full border border-black/10 px-3 py-1 text-[11px] text-black/55">
                    +3 photos
                  </div>
                </div>

                <div className="aspect-[9/16] rounded-[24px] bg-[linear-gradient(180deg,#eadfd7,#d0b5a0_54%,#a58769)]" />

                <div className="mt-3 rounded-[18px] bg-[#faf8f4] p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Klyp
                  </div>
                  <div className="mt-2 text-[13px] font-medium leading-5">
                    same bus ride, same replayed feeling, different frame
                  </div>
                  <div className="mt-3 text-[11px] text-black/50">
                    shared post, not just a reply
                  </div>
                </div>
              </article>

              <article className="mr-auto w-[74%] rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Weekly Mood
                </div>
                <div className="mt-3 text-[15px] font-medium leading-6">
                  grey glow, late hours, one track you still aren’t over
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
