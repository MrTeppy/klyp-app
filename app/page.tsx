import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3ede2] text-[#161616]">
      <div className="relative mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute left-[-120px] top-[140px] h-[340px] w-[340px] rounded-full bg-[#e6cdb2] blur-3xl opacity-55" />
        <div className="pointer-events-none absolute right-[-80px] top-[220px] h-[360px] w-[360px] rounded-full bg-[#cfdcc8] blur-3xl opacity-55" />
        <div className="pointer-events-none absolute bottom-[40px] left-[45%] h-[260px] w-[260px] rounded-full bg-[#d8d1eb] blur-3xl opacity-40" />

        <AppHeader subtitle="Your Space" />

        <section className="relative mt-8 grid gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/55 backdrop-blur">
                Shared Memory Posts
              </span>
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/55 backdrop-blur">
                Spotify Linked
              </span>
              <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] text-black/55 backdrop-blur">
                Friends Can Klyp
              </span>
            </div>

            <h1 className="text-[56px] font-semibold tracking-[-0.09em] leading-[0.84] sm:text-[72px] lg:text-[96px] xl:text-[118px]">
              social,
              <br />
              but with
              <br />
              <span className="text-black/35">reverb.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-black/62 sm:text-[19px]">
              KLYP turns one post into a shared memory. Start with your image
              and song, then let friends klyp their own photos into the same
              post instead of burying the moment underneath it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-[0_16px_36px_rgba(0,0,0,0.16)] transition hover:-translate-y-[1px] hover:opacity-90"
              >
                Enter KLYP
              </Link>

              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/85 px-6 py-3 text-sm font-medium text-black/72 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:bg-white"
              >
                Upload Post
              </Link>

              <SpotifyConnectButton />
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Posts
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  image, song, mood, memory
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Klyp
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  friends add their own angle into the same post
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Music
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  your week, understood through sound
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[620px]">
            <div className="hidden xl:block absolute -left-12 top-24 h-[1px] w-16 bg-black/10" />
            <div className="hidden xl:block absolute -right-12 bottom-20 h-[1px] w-16 bg-black/10" />

            <div className="relative">
              <article className="relative ml-0 w-[78%] rounded-[34px] border border-black/10 bg-white/82 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.09)] backdrop-blur">
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

                <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#d7dac6,#9ea480_46%,#59634f)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.36),transparent_28%)]" />
                </div>

                <div className="mt-3 rounded-[20px] bg-[#fbf7f0] p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Music Post
                  </div>
                  <div className="mt-2 text-[14px] font-medium leading-6">
                    train window reflections, city lights, same song again
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-[11px] text-black/52">
                      Let Down — Radiohead
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-[11px] text-black/52">
                      Late Train / City Lights
                    </span>
                  </div>
                </div>
              </article>

              <article className="-mt-24 ml-auto w-[78%] rounded-[34px] border border-black/10 bg-white/82 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.09)] backdrop-blur">
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

                <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#f0dccd,#cfab8c_55%,#9c7254)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_28%)]" />
                </div>

                <div className="mt-3 rounded-[20px] bg-[#fbf7f0] p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Klyp
                  </div>
                  <div className="mt-2 text-[14px] font-medium leading-6">
                    same bus ride, same replayed feeling, different frame
                  </div>
                  <div className="mt-3 text-[11px] text-black/50">
                    shared post, not just a reply
                  </div>
                </div>
              </article>

              <article className="-mt-16 mr-auto w-[58%] rounded-[28px] border border-black/10 bg-[#181818] p-5 text-white shadow-[0_16px_46px_rgba(0,0,0,0.14)]">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Weekly Mood
                </div>
                <div className="mt-3 text-[15px] font-medium leading-6">
                  grey glow, late hours, one track you still aren’t over
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-black/10 bg-[#201a18] p-7 text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Why it feels different
            </div>
            <div className="mt-4 text-[30px] font-semibold tracking-[-0.06em] leading-[1.02]">
              not louder.
              <br />
              more felt.
            </div>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/72">
              KLYP is built around the feeling of a day, not just the content of
              it. One post, one song, multiple people, same memory.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                Shared posts
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                friends don’t reply under it — they klyp into it
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                Music-first
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                every post keeps the track that held the moment together
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                Mood system
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                your listening becomes atmosphere, not just stats
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                Identity
              </div>
              <div className="mt-3 text-[18px] font-medium leading-6">
                more editorial, less generic social app
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
