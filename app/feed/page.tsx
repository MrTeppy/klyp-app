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
className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#174a8b] bg-[#1d5ca8] text-[11px] text-white hover:bg-[#174a8b] disabled:cursor-default disabled:opacity-40"
aria-label={playing ? "Pause preview" : "Play preview"}
>
{playing ? "Ⅱ" : "▶"} </button>
);
}

function MusicStrip({ post }: { post: Post }) {
if (!post.song_title) return null;

return ( <div className="my-3 border-y border-[#a8bfd9] bg-[#f3f7fb]"> <div className="flex items-stretch"> <div className="h-16 w-16 shrink-0 border-r border-[#a8bfd9] bg-[#dce8f4]">
{post.album_art ? ( <img
           src={post.album_art}
           alt=""
           className="h-full w-full object-cover"
         />
) : ( <div className="flex h-full items-center justify-center text-2xl text-[#28588f]">
♪ </div>
)} </div>

    <div className="min-w-0 flex-1 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#6a7f96]">
        listening to
      </div>

      <div className="truncate text-[12px] font-bold text-[#123d70]">
        {post.song_title}
      </div>

      <div className="truncate text-[11px] text-[#55718f]">
        {post.song_artist || "unknown artist"}
      </div>

      {post.external_url ? (
        <a
          href={post.external_url}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-[#1b5ca8] hover:underline"
        >
          apple music ↗
        </a>
      ) : null}
    </div>

    <div className="flex items-center border-l border-[#a8bfd9] px-2">
      <Play src={post.preview_url} />
    </div>
  </div>
</div>

);
}

function SpinningDisc({ post }: { post?: Post }) {
return (
<> <style>{`         @keyframes klypDiscSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

  <div className="relative mx-auto h-[118px] w-[118px]">
    <div
      className="absolute inset-0 overflow-hidden rounded-full border border-[#7898bb]"
      style={{
        animation: "klypDiscSpin 18s linear infinite",
        background:
          "repeating-conic-gradient(#e7edf4 0deg, #cbd7e4 8deg, #f8fafc 16deg)",
      }}
    >
      {post?.album_art ? (
        <div className="absolute inset-[24px] overflow-hidden rounded-full border border-[#6e8baa]">
          <img
            src={post.album_art}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-[24px] rounded-full border border-[#7898bb] bg-[#e8eef5]" />
      )}

      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#718aa5] bg-white" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d5ca8]" />
    </div>
  </div>
</>

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

return ( <main className="min-h-screen bg-[#e9f1f8] text-[#172b42]"> <div className="mx-auto max-w-[1080px] px-3 py-5">
{/* HEADER */} <header className="mb-4 border-b border-[#7898bb] pb-3"> <div className="flex items-end justify-between gap-4"> <div>
<button
onClick={() => router.push("/")}
className="text-[28px] font-black tracking-[-0.08em] text-[#164f92]"
>
klyp<span className="text-[#6387aa]">.</span> </button>

          <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#637d99]">
            music · memory · people who get it
          </div>
        </div>

        <nav className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[11px]">
          <button
            onClick={() => router.push("/feed")}
            className="font-bold text-[#164f92] hover:underline"
          >
            home
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="text-[#315a82] hover:underline"
          >
            profile
          </button>

          <button
            onClick={() => router.push("/friends")}
            className="text-[#315a82] hover:underline"
          >
            people
          </button>

          <button
            onClick={() => router.push("/messages")}
            className="text-[#315a82] hover:underline"
          >
            messages
          </button>

          <button
            onClick={() => router.push("/search")}
            className="text-[#315a82] hover:underline"
          >
            search
          </button>
        </nav>
      </div>
    </header>

    <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)_190px]">
      {/* LEFT */}
      <aside className="hidden md:block">
        <div className="mb-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#637d99]">
            my klyp
          </div>

          <div className="space-y-1 border-l border-[#8ca8c4] pl-3 text-[11px]">
            <button
              onClick={() => router.push("/upload")}
              className="block text-left text-[#164f92] hover:underline"
            >
              + post something
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="block text-left text-[#315a82] hover:underline"
            >
              view my profile
            </button>

            <button
              onClick={() => router.push("/friends")}
              className="block text-left text-[#315a82] hover:underline"
            >
              friends
            </button>

            <button
              onClick={() => router.push("/search")}
              className="block text-left text-[#315a82] hover:underline"
            >
              find people
            </button>
          </div>
        </div>

        <div className="mb-5 border-y border-[#7898bb] py-4 text-center">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#637d99]">
            now spinning
          </div>

          <SpinningDisc post={latestTrack} />

          {latestTrack ? (
            <div className="mt-3">
              <div className="truncate text-[11px] font-bold text-[#164f92]">
                {latestTrack.song_title}
              </div>

              <div className="truncate text-[10px] text-[#637d99]">
                {latestTrack.song_artist}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-[10px] leading-4 text-[#71879d]">
              nothing spinning yet.
              <br />
              be the first.
            </div>
          )}
        </div>

        <div className="text-[10px] leading-5 text-[#637d99]">
          <div>post the song in your head.</div>
          <div>find people by music taste.</div>
          <div>keep it small, weird, yours.</div>
        </div>
      </aside>

      {/* MAIN FEED */}
      <section className="min-w-0">
        <div className="mb-5 border-y border-[#7898bb] py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#637d99]">
                klyp feed
              </div>

              <h1 className="mt-0.5 text-[19px] font-bold tracking-[-0.03em] text-[#123d70]">
                what are you listening to?
              </h1>
            </div>

            <button
              onClick={() => router.push("/upload")}
              className="border border-[#164f92] bg-[#164f92] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#123d70]"
            >
              post
            </button>
          </div>
        </div>

        <button
          onClick={() => router.push("/upload")}
          className="mb-6 flex w-full items-center gap-3 border-b border-[#a8bfd9] pb-4 text-left"
        >
          <MiniAvatar />

          <div className="flex-1 border border-[#9eb7d0] bg-white px-3 py-2 text-[11px] text-[#71879d]">
            add a song, a thought, or a photo...
          </div>

          <span className="hidden text-[10px] text-[#527596] sm:block">
            + new klyp
          </span>
        </button>

        {status ? (
          <div className="mb-5 border-y border-[#a8bfd9] bg-[#f3f7fb] px-3 py-2 text-[10px] text-[#637d99]">
            {status}
          </div>
        ) : null}

        {!status && posts.length === 0 ? (
          <div className="border-y border-[#a8bfd9] py-8 text-center">
            <div className="text-[12px] font-bold text-[#315a82]">
              the feed is quiet.
            </div>

            <div className="mt-1 text-[10px] text-[#71879d]">
              be the first person to post what you're listening to.
            </div>
          </div>
        ) : null}

        {posts.map((post) => {
          const name = nameFromPost(post, profiles);

          return (
            <article
              key={post.id}
              className="mb-7 border-b border-[#8ca8c4] pb-6"
            >
              <div className="mb-3 flex items-start gap-2">
                <MiniAvatar label={name} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <button className="text-[12px] font-bold text-[#164f92] hover:underline">
                      {name}
                    </button>

                    <span className="text-[9px] text-[#8194a8]">
                      {timeAgo(post.created_at)}
                    </span>
                  </div>

                  {post.mood_line ? (
                    <div className="mt-0.5 text-[10px] italic text-[#637d99]">
                      {post.mood_line}
                    </div>
                  ) : null}
                </div>

                <button className="text-[11px] text-[#71879d] hover:text-[#164f92]">
                  ···
                </button>
              </div>

              {post.image_url ? (
                <div className="mb-3 bg-[#dce7f1] p-1">
                  <img
                    src={post.image_url}
                    alt=""
                    className="max-h-[600px] w-full object-cover"
                  />
                </div>
              ) : null}

              {post.caption ? (
                <p className="mb-3 whitespace-pre-line text-[13px] leading-6 text-[#243d58]">
                  {post.caption}
                </p>
              ) : null}

              <MusicStrip post={post} />

              <div className="flex items-center gap-4 text-[10px] text-[#527596]">
                <button className="hover:text-[#164f92] hover:underline">
                  ♡ like
                </button>

                <button className="hover:text-[#164f92] hover:underline">
                  comment
                </button>

                <span className="ml-auto text-[#8799aa]">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : ""}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* RIGHT */}
      <aside className="hidden md:block">
        <div className="mb-6 border-t border-[#7898bb] pt-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#637d99]">
            latest track
          </div>

          {latestTrack ? (
            <MusicStrip post={latestTrack} />
          ) : (
            <div className="text-[10px] leading-5 text-[#71879d]">
              no tracks yet.
            </div>
          )}
        </div>

        <div className="mb-6 border-t border-[#7898bb] pt-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#637d99]">
            scene notes
          </div>

          <div className="space-y-2 text-[10px] leading-5 text-[#637d99]">
            <p>
              music lives in the posts.
            </p>

            <p>
              find people by what they listen to.
            </p>

            <p>
              nothing here is trying to go viral.
            </p>
          </div>
        </div>

        <div className="border-t border-[#7898bb] pt-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#637d99]">
            little directory
          </div>

          <div className="space-y-1 text-[10px] leading-5">
            <button
              onClick={() => router.push("/search")}
              className="block text-left text-[#315a82] hover:text-[#164f92] hover:underline"
            >
              → people
            </button>

            <button
              onClick={() => router.push("/friends")}
              className="block text-left text-[#315a82] hover:text-[#164f92] hover:underline"
            >
              → friends
            </button>

            <button
              onClick={() => router.push("/messages")}
              className="block text-left text-[#315a82] hover:text-[#164f92] hover:underline"
            >
              → messages
            </button>

            <button
              onClick={() => router.push("/upload")}
              className="block text-left text-[#315a82] hover:text-[#164f92] hover:underline"
            >
              → post a song
            </button>
          </div>
        </div>
      </aside>
    </div>

    <footer className="mt-8 border-t border-[#7898bb] pt-3 text-[9px] text-[#71879d]">
      <div className="flex flex-wrap justify-between gap-2">
        <span>klyp.life</span>
        <span>music · memory · people who get it</span>
      </div>
    </footer>
  </div>
</main>

);
}
