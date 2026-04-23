import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#151515]">
      <div className="relative mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute left-[-90px] top-[120px] h-[300px] w-[300px] rounded-full bg-[#e6d7c6] blur-3xl opacity-60" />
        <div className="pointer-events-none absolute right-[-60px] top-[220px] h-[320px] w-[320px] rounded-full bg-[#dbe4d9] blur-3xl opacity-60" />

        <AppHeader subtitle="Your Space" />

        <section className="relative mt-8 grid gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="max-w-3xl">
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

            <h1 className="text-[56px] font-semibold tracking-[-0.09em] leading-[0.84] sm:text-[76px] lg:text-[98px] xl:text-[118px]">
              social,
              <br />
              but with
              <br />
              <span className="text-black/35">actual taste.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-black/62 sm:text-[19px]">
              KLYP turns one post into a shared memory. Start with your image,
              attach the track that held it together, then let friends klyp
              their own moments into the same post.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition hover:-translate-y-[1px] hover:opacity-90"
              >
                Enter KLYP
              </Link>

              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/85 px-6 py-3 text-sm font-medium text-black/72 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:bg-white"
              >
                New Post
              </Link>

              <SpotifyConnectButton />
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Posts
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  image, song, mood, memory
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Klyp
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  friends add their own angle into the same post
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/82 p-5 shadow-sm backdrop-blur">
                <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                  Music
                </div>
                <div className="mt-3 text-[17px] font-medium leading-6">
                  your week, understood through sound
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[620px]">
            <div className="relative">
              <article className="relative z-20 mr-auto w-[78%] rounded-[34px] border border-black/10 bg-white/85 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.09)] backdrop-blur">
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

                <div className="aspect-[9/16] rounded-[28px] bg-[linear-gradient(180deg,#d7dbc9,#9ea581_45%,#59634f)]" />

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

              <article className="relative z-10 -mt-24 ml-auto w-[78%] rounded-[34px] border border-black/10 bg-white/85 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.09)] backdrop-blur">
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

                <div className="aspect-[9/16] rounded-[28px] bg-[linear-gradient(180deg,#f0dccd,#cfab8c_55%,#9c7254)]" />

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

              <article className="relative z-30 -mt-16 mr-auto w-[58%] rounded-[28px] border border-black/10 bg-[#1d1918] p-5 text-white shadow-[0_16px_46px_rgba(0,0,0,0.14)]">
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
      </div>
    </main>
  );
}
