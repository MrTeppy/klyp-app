import AppHeader from "@/components/AppHeader";
import SpotifyConnectButton from "@/components/SpotifyConnectButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6">
          <AppHeader subtitle="Your Space" />
<div className="rounded-full bg-red-500 px-4 py-2 text-white text-sm inline-block">
  TEST VERSION 999
</div>

          <section className="grid min-h-[calc(100vh-120px)] items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/65 backdrop-blur">
                  Shared Memory Posts
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/65 backdrop-blur">
                  Music + Sound
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/65 backdrop-blur">
                  Friends Can Klyp
                </span>
              </div>

              <h1 className="text-[56px] font-semibold leading-[0.82] tracking-[-0.09em] sm:text-[80px] lg:text-[110px] xl:text-[132px]">
                posts,
                <br />
                but with
                <br />
                <span className="bg-gradient-to-r from-white via-white/85 to-white/35 bg-clip-text text-transparent">
                  an afterglow.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-8 text-white/60 sm:text-[19px]">
                KLYP turns one post into a shared memory. Start with your image,
                attach the track that held it together, then let friends klyp
                their own photos into the same moment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/feed"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_16px_50px_rgba(255,255,255,0.18)] transition hover:-translate-y-[1px]"
                >
                  Enter KLYP
                </Link>

                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
                >
                  New Post
                </Link>

                <SpotifyConnectButton />
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Posts
                  </div>
                  <div className="mt-3 text-[17px] font-medium leading-6">
                    image, song, mood, memory
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Klyp
                  </div>
                  <div className="mt-3 text-[17px] font-medium leading-6">
                    add your own angle into the same post
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Sound
                  </div>
                  <div className="mt-3 text-[17px] font-medium leading-6">
                    tracks and sounds stay attached
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[700px]">
              <div className="relative h-[720px]">
                <div className="absolute left-0 top-10 h-[540px] w-[260px] rotate-[-8deg] rounded-[42px] border border-white/10 bg-white/8 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <div className="rounded-[34px] bg-[#0f1117] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-white/40">Main Post</div>
                        <div className="mt-1 text-[12px] font-medium text-white">
                          Charlie · city lights
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-[10px] text-black">
                        Live
                      </div>
                    </div>

                    <div className="aspect-[9/16] rounded-[28px] bg-[linear-gradient(180deg,#5b51ff,#201f39_48%,#0b0b11)]" />

                    <div className="mt-3 rounded-[20px] bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                        Music Post
                      </div>
                      <div className="mt-2 text-[12px] font-medium leading-5 text-white">
                        train window reflections, city lights, same song again
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-6 top-0 z-20 h-[620px] w-[300px] rotate-[8deg] rounded-[46px] border border-white/10 bg-white/8 p-3 shadow-[0_34px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <div className="rounded-[36px] bg-[#121016] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-white/40">Klyped by Ivy</div>
                        <div className="mt-1 text-[12px] font-medium text-white">
                          same night · different angle
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] text-white/70">
                        +3 photos
                      </div>
                    </div>

                    <div className="aspect-[9/16] rounded-[30px] bg-[linear-gradient(180deg,#ff8b5e,#4b1f2d_52%,#0c0c11)]" />

                    <div className="mt-3 rounded-[20px] bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                        Klyp
                      </div>
                      <div className="mt-2 text-[12px] font-medium leading-5 text-white">
                        same bus ride, same replayed feeling, different frame
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-28 z-30 w-[300px] rounded-[28px] border border-white/10 bg-white p-5 text-black shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                    Weekly Mood
                  </div>
                  <div className="mt-3 text-[15px] font-medium leading-6">
                    grey glow, late hours, one track you still aren’t over
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
