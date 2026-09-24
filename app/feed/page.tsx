"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MiniAvatar } from "@/components/KlypRetro";
import { supabase } from "@/lib/supabase";

let currentAudio: HTMLAudioElement | null = null;

type Post = {
  id: string | number;
  created_at?: string;
  user_id?: string | null;
  image_url?: string | null;
  caption?: string | null;
  mood_line?: string | null;
  song_title?: string | null;
  song_artist?: string | null;
  album_art?: string | null;
  preview_url?: string | null;
  external_url?: string | null;
};

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
};

function timeAgo(date?: string) {
  if (!date) return "just now";

  const diff = Date.now() - new Date(date).getTime();

  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return `${Math.floor(diff / 86400000)}d ago`;
}

function nameFromPost(post: Post, profiles: Record<string, Profile>) {
  if (!post.user_id) return "klyp.user";

  const profile = profiles[post.user_id];

  return (
    profile?.display_name ||
    profile?.username ||
    `user.${post.user_id.slice(0, 4)}`
  );
}

function Play({ src }: { src?: string | null }) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    if (!src) return;

    if (!audio.current) {
      audio.current = new Audio(src);
    }

    if (currentAudio && currentAudio !== audio.current) {
      currentAudio.pause();
    }

    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      currentAudio = audio.current;
      audio.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={!src}
      className="border border-[#003f87] bg-[#0054a6] px-2 py-1 text-[11px] font-bold text-white hover:bg-[#003f87] disabled:cursor-default disabled:opacity-40"
      aria-label={playing ? "Pause preview" : "Play preview"}
    >
      {playing ? "pause" : "play"}
    </button>
  );
}

function MusicBox({ post }: { post: Post }) {
  if (!post.song_title) return null;

  return (
    <div className="my-3 border border-[#7d9fbe] bg-[#edf5fc]">
      <div className="flex">
        <div className="h-[74px] w-[74px] shrink-0 border-r border-[#7d9fbe] bg-[#d5e5f2]">
          {post.album_art ? (
            <img
              src={post.album_art}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-[#17528e]">
              ♪
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 px-3 py-2">
          <div className="text-[9px] font-bold uppercase tracking-wide text-[#557493]">
            currently listening
          </div>

          <div className="mt-1 truncate text-[13px] font-bold text-[#003f87]">
            {post.song_title}
          </div>

          <div className="truncate text-[11px] text-[#385b7d]">
            {post.song_artist || "unknown artist"}
          </div>

          {post.external_url ? (
            <a
              href={post.external_url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#004fa3] hover:underline"
            >
              listen on Apple Music
            </a>
          ) : null}
        </div>

        <div className="flex items-center border-l border-[#7d9fbe] px-2">
          <Play src={post.preview_url} />
        </div>
      </div>
    </div>
  );
}

function NowPlaying({ post }: { post?: Post }) {
  return (
    <div className="border border-[#6f91b0] bg-[#f7fbff]">
      <div className="border-b border-[#6f91b0] bg-[#dbeaf6] px-2 py-1 text-[10px] font-bold text-[#003f87]">
        NOW PLAYING
      </div>

      <div className="p-2">
        {post ? (
          <>
            {post.album_art ? (
              <img
                src={post.album_art}
                alt=""
                className="mx-auto mb-2 h-[105px] w-[105px] border border-[#527896] object-cover"
              />
            ) : (
              <div className="mx-auto mb-2 flex h-[105px] w-[105px] items-center justify-center border border-[#527896] bg-[#dbe8f2] text-4xl text-[#24547e]">
                ♪
              </div>
            )}

            <div className="text-center">
              <div className="truncate text-[11px] font-bold text-[#003f87]">
                {post.song_title}
              </div>

              <div className="truncate text-[10px] text-[#58738e]">
                {post.song_artist || "unknown artist"}
              </div>

              <div className="mt-2">
                <Play src={post.preview_url} />
              </div>
            </div>
          </>
        ) : (
          <div className="py-5 text-center text-[10px] leading-4 text-[#58738e]">
            nobody is listening
            <br />
            to anything yet.
          </div>
        )}
      </div>
    </div>
  );
}

function SmallBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 border border-[#7d9fbe] bg-white">
      <div className="border-b border-[#7d9fbe] bg-[#dbeaf6] px-2 py-1 text-[10px] font-bold text-[#003f87]">
        {title}
      </div>

      <div className="p-2">{children}</div>
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("klyp-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        loadPosts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const loadedPosts = data || [];

    setPosts(loadedPosts);

    const userIds = [
      ...new Set(
        loadedPosts
          .map((post) => post.user_id)
          .filter((id): id is string => !!id)
      ),
    ];

    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", userIds);

      const profileMap: Record<string, Profile> = {};

      for (const profile of profileData || []) {
        profileMap[profile.id] = profile;
      }

      setProfiles(profileMap);
    } else {
      setProfiles({});
    }

    setStatus("");
  }

  const latestTrack = posts.find((post) => post.song_title);

  return (
    <main className="min-h-screen bg-[#dcecf8] text-[#172b42]">
      <div className="mx-auto max-w-[1100px] px-2 py-3">
        {/* TOP BAR */}
        <header className="border border-[#557d9f] bg-white">
          <div className="bg-[#0054a6] px-3 py-2 text-white">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => router.push("/")}
                className="text-[27px] font-black tracking-[-0.09em] hover:underline"
              >
                klyp.
              </button>

              <div className="text-right text-[9px] leading-3">
                <div>music · memory · people who get it</div>
                <div className="opacity-80">klyp.life</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-1 bg-[#e9f3fb] px-2 py-1 text-[11px]">
            <button
              onClick={() => router.push("/feed")}
              className="bg-[#0054a6] px-2 py-0.5 font-bold text-white"
            >
              home
            </button>

            <span className="text-[#7792aa]">|</span>

            <button
              onClick={() => router.push("/profile")}
              className="px-1 text-[#004fa3] hover:underline"
            >
              my page
            </button>

            <span className="text-[#7792aa]">|</span>

            <button
              onClick={() => router.push("/friends")}
              className="px-1 text-[#004fa3] hover:underline"
            >
              friends
            </button>

            <span className="text-[#7792aa]">|</span>

            <button
              onClick={() => router.push("/messages")}
              className="px-1 text-[#004fa3] hover:underline"
            >
              messages
            </button>

            <span className="text-[#7792aa]">|</span>

            <button
              onClick={() => router.push("/search")}
              className="px-1 text-[#004fa3] hover:underline"
            >
              people
            </button>

            <span className="text-[#7792aa]">|</span>

            <button
              onClick={() => router.push("/upload")}
              className="px-1 font-bold text-[#004fa3] hover:underline"
            >
              + post
            </button>
          </nav>
        </header>

        <div className="mt-3 grid gap-3 md:grid-cols-[175px_minmax(0,1fr)_205px]">
          {/* LEFT COLUMN */}
          <aside>
            <SmallBox title="MY KLYP">
              <div className="flex gap-2">
                <MiniAvatar />

                <div className="min-w-0 text-[10px] leading-4">
                  <button
                    onClick={() => router.push("/profile")}
                    className="block truncate font-bold text-[#004fa3] hover:underline"
                  >
                    my profile
                  </button>

                  <button
                    onClick={() => router.push("/friends")}
                    className="block text-[#004fa3] hover:underline"
                  >
                    friends
                  </button>

                  <button
                    onClick={() => router.push("/messages")}
                    className="block text-[#004fa3] hover:underline"
                  >
                    inbox
                  </button>
                </div>
              </div>
            </SmallBox>

            <SmallBox title="QUICK LINKS">
              <div className="space-y-1 text-[10px] leading-4">
                <button
                  onClick={() => router.push("/upload")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  &gt; post something
                </button>

                <button
                  onClick={() => router.push("/search")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  &gt; find people
                </button>

                <button
                  onClick={() => router.push("/friends")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  &gt; my friends
                </button>

                <button
                  onClick={() => router.push("/messages")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  &gt; messages
                </button>
              </div>
            </SmallBox>

            <SmallBox title="ABOUT KLYP">
              <div className="text-[10px] leading-4 text-[#4e6b84]">
                post what you're listening to.
                <br />
                <br />
                put a photo with it.
                <br />
                write something stupid.
                <br />
                find people who get it.
              </div>
            </SmallBox>

            <div className="px-1 text-[9px] leading-4 text-[#66819a]">
              <div>you are browsing</div>
              <div className="font-bold text-[#004fa3]">klyp.life</div>
              <div>made for friends.</div>
            </div>
          </aside>

          {/* CENTRE */}
          <section className="min-w-0">
            <div className="border border-[#557d9f] bg-white">
              <div className="border-b border-[#557d9f] bg-[#e2eef7] px-3 py-2">
                <div className="text-[10px] font-bold text-[#55738e]">
                  KLYP / HOME
                </div>

                <div className="mt-0.5 text-[17px] font-bold text-[#003f87]">
                  what are you listening to?
                </div>
              </div>

              <button
                onClick={() => router.push("/upload")}
                className="m-3 flex w-[calc(100%-24px)] items-center gap-2 border border-[#86a5bf] bg-[#f4f9fd] p-2 text-left hover:bg-[#eaf4fb]"
              >
                <MiniAvatar />

                <div className="flex-1">
                  <div className="text-[11px] font-bold text-[#004fa3]">
                    + make a new klyp
                  </div>

                  <div className="text-[9px] text-[#71889d]">
                    song / photo / thought
                  </div>
                </div>
              </button>

              {status ? (
                <div className="mx-3 mb-3 border border-[#a8bfd2] bg-[#f2f7fb] px-2 py-2 text-[10px] text-[#55738e]">
                  {status}
                </div>
              ) : null}

              {!status && posts.length === 0 ? (
                <div className="mx-3 mb-3 border border-[#a8bfd2] bg-[#f2f7fb] px-3 py-8 text-center">
                  <div className="text-[12px] font-bold text-[#003f87]">
                    the feed is empty.
                  </div>

                  <div className="mt-1 text-[10px] text-[#68829a]">
                    post something and make it less empty.
                  </div>

                  <button
                    onClick={() => router.push("/upload")}
                    className="mt-3 text-[10px] font-bold text-[#004fa3] hover:underline"
                  >
                    make your first post →
                  </button>
                </div>
              ) : null}

              {posts.map((post, index) => {
                const name = nameFromPost(post, profiles);

                return (
                  <article
                    key={post.id}
                    className="border-t border-[#9ab3c8] px-3 py-4"
                  >
                    <div className="flex gap-2">
                      <div className="shrink-0">
                        <MiniAvatar label={name} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[11px]">
                          <button className="font-bold text-[#003f87] hover:underline">
                            {name}
                          </button>

                          <span className="ml-2 text-[9px] text-[#7890a5]">
                            {timeAgo(post.created_at)}
                          </span>
                        </div>

                        {post.mood_line ? (
                          <div className="mt-0.5 text-[10px] text-[#617b92]">
                            {post.mood_line}
                          </div>
                        ) : null}

                        {post.caption ? (
                          <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-[#263f57]">
                            {post.caption}
                          </p>
                        ) : null}

                        {post.image_url ? (
                          <div className="mt-3 border border-[#7797b2] bg-[#dbe8f1] p-1">
                            <img
                              src={post.image_url}
                              alt=""
                              className="max-h-[650px] w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <MusicBox post={post} />

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 text-[9px]">
                          <button className="text-[#004fa3] hover:underline">
                            ♡ like
                          </button>

                          <button className="text-[#004fa3] hover:underline">
                            comment
                          </button>

                          <button className="text-[#004fa3] hover:underline">
                            reply
                          </button>

                          <span className="text-[#9aabb9]">
                            {post.created_at
                              ? new Date(
                                  post.created_at
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              : ""}
                          </span>
                        </div>

                        {index === 0 ? (
                          <div className="mt-3 text-[9px] text-[#91a4b4]">
                            — latest klyp —
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <aside>
            <NowPlaying post={latestTrack} />

            <div className="mt-3">
              <SmallBox title="THE KLYP BOARD">
                <div className="text-[10px] leading-4">
                  <div className="font-bold text-[#003f87]">
                    what's happening?
                  </div>

                  <div className="mt-1 text-[#58748d]">
                    people are posting music, photos and little bits of their
                    lives.
                  </div>

                  <div className="mt-2 border-t border-[#c3d3df] pt-2">
                    <button
                      onClick={() => router.push("/upload")}
                      className="text-left text-[#004fa3] hover:underline"
                    >
                      make a post →
                    </button>
                  </div>
                </div>
              </SmallBox>
            </div>

            <SmallBox title="PEOPLE">
              <div className="space-y-1 text-[10px]">
                <button
                  onClick={() => router.push("/search")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  find someone
                </button>

                <button
                  onClick={() => router.push("/friends")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  view your friends
                </button>

                <button
                  onClick={() => router.push("/messages")}
                  className="block text-left text-[#004fa3] hover:underline"
                >
                  send a message
                </button>
              </div>
            </SmallBox>

            <div className="border border-[#7d9fbe] bg-[#eaf3fa] p-2 text-[9px] leading-4 text-[#66819a]">
              <div className="font-bold text-[#315d82]">
                klyp tip of the day
              </div>

              <div className="mt-1">
                don't just post the song.
                <br />
                say why you're listening to it.
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="mt-3 border border-[#7d9fbe] bg-white px-3 py-2 text-[9px] text-[#66819a]">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <div>
              <span className="font-bold text-[#003f87]">klyp.life</span>
              {" · "}
              music · memory · people who get it
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/feed")}
                className="text-[#004fa3] hover:underline"
              >
                home
              </button>

              <span>|</span>

              <button
                onClick={() => router.push("/search")}
                className="text-[#004fa3] hover:underline"
              >
                people
              </button>

              <span>|</span>

              <button
                onClick={() => router.push("/messages")}
                className="text-[#004fa3] hover:underline"
              >
                messages
              </button>
            </div>
          </div>
        </footer>

        <div className="py-3 text-center text-[8px] text-[#7891a5]">
          best viewed on the internet
        </div>
      </div>
    </main>
  );
}