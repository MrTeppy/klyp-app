import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1e8] text-[#111111]">
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute left-[-80px] top-[120px] h-[260px] w-[260px] rounded-full bg-[#e7d8c7] blur-3xl opacity-60" />
        <div className="pointer-events-none absolute right-[-40px] top-[240px] h-[280px] w-[280px] rounded-full bg-[#dfe7dc] blur-3xl opacity-60" />
        <div className="pointer-events-none absolute bottom-[80px] left-[35%] h-[220px] w-[220px] rounded-full bg-[#e7e2ef] blur-3xl opacity-50" />

        <AppHeader subtitle="Your Space" />

        <section className="relative mt-8 grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/50 backdrop-blur">
                Shared Memory Posts
              </span>
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/50 backdrop-blur">
                Spotify Linked
              </span>
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/50 backdrop-blur">
                Friends Can Klyp
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.085em] leading-[0.88] sm:text-6xl md:text-7xl xl:text-[92px]">
              social,
              <br />
              but with
              <br />
              <span className="text-black/35">a memory.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-7 text-black/60 sm:text-[18px] sm:leading-8">
              KLYP turns one post into a shared moment. Start with your image
              and the song that held it together, then let friends klyp their
              own photos into the same memory.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition hover:-translate-y-[1px] hover:opacity-90"
              >
                Enter KLYP
              </Link>

              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-medium text-black/70 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:bg-white"
              >
                Upload Post
              </Link>

              <SpotifyConnectButton />
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[26px] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Posts
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  image, song, mood, memory
                </div>
              </div>

              <div className="rounded-[26px] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Klyp
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  add your own moment into the same post
                </div>
              </div>

              <div className="rounded-[26px] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                  Music
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  your week, understood through sound
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute left-6 top-0 h-20 w-20 rounded-full border border-black/10 bg-white/60 blur-[2px]" />
            <div className="absolute right-3 top-24 h-16 w-16 rounded-full border border-black/10 bg-white/60 blur-[1px]" />

            <div className="relative space-y-4">
              <article className="mr-auto w-[88%] rounded-[32px] border border-black/10 bg-white/80 p-3 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur sm:w-[80%]">
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

                <div className="relative aspect-[9/16] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#d8ddd4,#9ca68f_44%,#6a7366)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_28%)]" />
                </div>

                <div className="mt-3 rounded-[20px] bg-[#faf7f1] p-3">
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

              <article className="ml-auto w-[88%] rounded-[32px] border border-black/10 bg-white/80 p-3 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur sm:w-[80%]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-black/40">Klyped by Ivy</div>
                    <div className="mt-1 text-[13px] font-medium">
                      same night · different angle
                    </div>
                  </div>
                  <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-black/55">
                    +3 photos
                  </div>
                </div>

                <div className="relative aspect-[9/16] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#ebdfd5,#d2b7a0_54%,#a18165)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_28%)]" />
                </div>

                <div className="mt-3 rounded-[20px] bg-[#faf7f1] p-3">
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

              <article className="mr-auto w-[74%] rounded-[26px] border border-black/10 bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur">
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

        <section className="mt-20 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] bg-black p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
              Why it feels different
            </div>
            <div className="mt-4 text-[28px] font-semibold tracking-[-0.05em] leading-[1.02]">
              not louder.
              <br />
              more personal.
            </div>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/70">
              KLYP is built around the feeling of a day, not just the content of
              it. One post, one song, multiple people, same memory.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                Shared posts
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                friends don’t reply under it — they klyp into it
              </div>
            </div>

            <div className="rounded-[26px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                Music-first
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                every post keeps the track that held the moment together
              </div>
            </div>

            <div className="rounded-[26px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                Mood system
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                your listening becomes atmosphere, not just stats
              </div>
            </div>

            <div className="rounded-[26px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.16em] text-black/35">
                Premium feel
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                soft depth, clean motion, and no cringe startup nonsense
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
