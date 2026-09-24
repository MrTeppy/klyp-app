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
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;

  return `${Math.floor(diff / 86400000)} days ago`;
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
      className="klyp-button"
    >
      {playing ? "❚❚ PAUSE" : "▶ PLAY"}
    </button>
  );
}

function Equalizer() {
  return (
    <div className="equalizer" aria-hidden="true">
      <i style={{ height: "5px" }} />
      <i style={{ height: "11px" }} />
      <i style={{ height: "18px" }} />
      <i style={{ height: "9px" }} />
      <i style={{ height: "23px" }} />
      <i style={{ height: "14px" }} />
      <i style={{ height: "27px" }} />
      <i style={{ height: "10px" }} />
      <i style={{ height: "20px" }} />
      <i style={{ height: "7px" }} />
      <i style={{ height: "15px" }} />
      <i style={{ height: "24px" }} />
      <i style={{ height: "12px" }} />
      <i style={{ height: "19px" }} />
      <i style={{ height: "8px" }} />
    </div>
  );
}

function StereoDisplay({ post }: { post?: Post }) {
  return (
    <div className="stereo">
      <div className="stereo-top">
        <span>KLYP PLAYER</span>
        <span>● STEREO</span>
      </div>

      <div className="stereo-screen">
        <div className="screen-line">
          <span>MP3</span>
          <span>DISC 01</span>
          <span>TRACK 01</span>
        </div>

        <div className="screen-main">
          <div className="pixel-wave">
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
            <span>~</span>
          </div>

          <div className="dolphin">
            {">)))°>"}
          </div>

          <div className="screen-song">
            {post?.song_title || "KLYP RADIO"}
          </div>

          <div className="screen-artist">
            {post?.song_artist || "MUSIC FOR YOUR PEOPLE"}
          </div>

          <Equalizer />
        </div>

        <div className="screen-bottom">
          <span>VOL 18</span>
          <span>♫</span>
          <span>EQ ROCK</span>
          <span>01:42</span>
        </div>
      </div>

      <div className="stereo-controls">
        <span className="led red" />
        <button>◀◀</button>
        <button>▶</button>
        <button>■</button>
        <button>▶▶</button>
        <span className="led green" />
      </div>
    </div>
  );
}

function MusicPlayer({ post }: { post: Post }) {
  if (!post.song_title) return null;

  return (
    <div className="music-player">
      <div className="music-top">
        <span>♫ KLYP MUSIC</span>
        <span>MP3 READY</span>
      </div>

      <div className="music-content">
        {post.album_art ? (
          <img
            src={post.album_art}
            alt=""
            className="album-art"
          />
        ) : (
          <div className="album-placeholder">♫</div>
        )}

        <div className="music-info">
          <a
            href={post.external_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="song-title"
          >
            {post.song_title}
          </a>

          <div className="song-artist">
            {post.song_artist || "unknown artist"}
          </div>

          <div className="music-actions">
            <Play src={post.preview_url} />

            {post.external_url ? (
              <a
                href={post.external_url}
                target="_blank"
                rel="noreferrer"
                className="music-link"
              >
                Apple Music
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="section-title">{children}</div>;
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
    <main className="klyp-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .klyp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 10%, rgba(255,255,255,.85), transparent 25%),
            repeating-linear-gradient(
              0deg,
              #d4e6f2 0px,
              #d4e6f2 2px,
              #c9ddea 2px,
              #c9ddea 4px
            );
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          padding: 18px 10px 40px;
        }

        .klyp-site {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          border: 2px solid #123c68;
          background: #fff;
          box-shadow: 5px 5px 0 rgba(18,60,104,.25);
        }

        .top-ad {
          height: 18px;
          background: #e9e9e9;
          border-bottom: 1px solid #aaa;
          color: #777;
          font-size: 9px;
          padding: 3px 6px;
          text-align: right;
        }

        .masthead {
          position: relative;
          min-height: 128px;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              #001f48 0%,
              #004e91 42%,
              #008dc1 72%,
              #006d9d 100%
            );
          border-bottom: 4px solid #ffd200;
          padding: 17px 20px;
        }

        .masthead:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 12px;
          height: 1px;
          background: rgba(95,232,255,.6);
          box-shadow:
            0 4px 0 rgba(95,232,255,.22),
            0 8px 0 rgba(95,232,255,.12);
        }

        .masthead:after {
          content: "";
          position: absolute;
          width: 270px;
          height: 270px;
          right: -55px;
          top: -105px;
          border-radius: 50%;
          border: 28px solid rgba(255,255,255,.12);
          box-shadow:
            0 0 0 14px rgba(255,255,255,.06),
            0 0 0 32px rgba(255,255,255,.04);
        }

        .logo {
          position: relative;
          z-index: 2;
          display: inline-block;
          color: #fff;
          font-size: 64px;
          line-height: .8;
          font-weight: 900;
          letter-spacing: -7px;
          text-shadow:
            3px 3px 0 #001c3b,
            6px 6px 0 rgba(0,0,0,.18);
          cursor: pointer;
        }

        .tagline {
          position: relative;
          z-index: 2;
          margin-top: 13px;
          color: #b9f4ff;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .top-links {
          position: relative;
          z-index: 3;
          margin-top: 8px;
          font-size: 10px;
        }

        .top-links button {
          color: #fff;
          text-decoration: underline;
          margin-right: 13px;
          font-weight: bold;
        }

        .display-code {
          position: absolute;
          right: 18px;
          bottom: 14px;
          z-index: 4;
          color: #82f6ff;
          font-family: "Courier New", monospace;
          font-size: 8px;
          text-align: right;
          letter-spacing: 1px;
        }

        .main-nav {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 2px solid #174c78;
          background: #e9f0f5;
          padding: 0 6px;
        }

        .main-nav button {
          border-left: 1px solid #a8b9c8;
          padding: 7px 12px;
          color: #003f7d;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .main-nav button:last-child {
          border-right: 1px solid #a8b9c8;
        }

        .main-nav button:hover {
          background: #ffcf00;
          color: #000;
        }

        .ticker {
          background: #fff7bd;
          border-bottom: 1px solid #d0b800;
          padding: 5px 9px;
          color: #333;
          font-size: 10px;
        }

        .ticker strong {
          color: #d00000;
          margin-right: 8px;
        }

        .layout {
          display: grid;
          grid-template-columns: 165px minmax(0, 1fr) 205px;
          gap: 9px;
          padding: 9px;
          background: #f7f7f7;
        }

        .column-box {
          border: 1px solid #7895aa;
          background: #fff;
          margin-bottom: 9px;
        }

        .section-title {
          padding: 5px 7px;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .5px;
          text-transform: uppercase;
          background: linear-gradient(#2383c4, #07538d);
          border-bottom: 2px solid #003c6c;
          text-shadow: 1px 1px 0 #00375f;
        }

        .box-content {
          padding: 8px;
        }

        .side-link {
          display: block;
          width: 100%;
          text-align: left;
          border-bottom: 1px dotted #b5c2cc;
          padding: 4px 2px;
          color: #004c99;
          font-size: 11px;
          font-weight: bold;
        }

        .side-link:hover {
          background: #fff6a8;
          color: #d00000;
          text-decoration: underline;
        }

        .side-copy {
          color: #526b7d;
          font-size: 10px;
          line-height: 1.5;
        }

        .welcome {
          border: 1px solid #557891;
          background: #fff;
          margin-bottom: 9px;
        }

        .welcome-inner {
          padding: 10px;
        }

        .welcome-title {
          color: #003f7d;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .welcome-sub {
          margin-top: 3px;
          color: #687d8e;
          font-size: 10px;
        }

        .post-button {
          margin-top: 8px;
          border: 2px outset #ddd;
          background: #eee;
          color: #003f7d;
          padding: 4px 12px;
          font-size: 10px;
          font-weight: bold;
        }

        .post-button:active {
          border-style: inset;
        }

        .post {
          border: 1px solid #8097a9;
          background: #fff;
          margin-bottom: 10px;
        }

        .post-head {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #edf4f8;
          border-bottom: 1px solid #a8b8c4;
          padding: 6px;
        }

        .post-avatar {
          flex-shrink: 0;
        }

        .post-meta {
          min-width: 0;
          flex: 1;
        }

        .post-name {
          color: #003f8c;
          font-size: 12px;
          font-weight: 900;
          text-decoration: underline;
        }

        .post-time {
          margin-left: 7px;
          color: #8798a4;
          font-size: 9px;
        }

        .post-mood {
          margin-top: 1px;
          color: #596e7e;
          font-size: 9px;
          font-style: italic;
        }

        .post-body {
          padding: 9px;
        }

        .post-caption {
          color: #202d36;
          font-size: 12px;
          line-height: 1.55;
          margin-bottom: 8px;
          white-space: pre-line;
        }

        .post-image {
          width: 100%;
          max-height: 650px;
          object-fit: cover;
          border: 1px solid #657f91;
          display: block;
        }

        .post-footer {
          border-top: 1px solid #c5d0d8;
          background: #f4f7f9;
          padding: 5px 7px;
          font-size: 9px;
        }

        .post-footer button,
        .post-footer a {
          color: #004d9d;
          margin-right: 12px;
          font-weight: bold;
        }

        .post-footer button:hover,
        .post-footer a:hover {
          text-decoration: underline;
        }

        /* 2000s stereo / LCD player */

        .stereo {
          margin-bottom: 9px;
          border: 2px solid #0b3153;
          background: #142a3b;
          box-shadow:
            inset 0 0 0 1px #41627a,
            3px 3px 0 #a8bac6;
        }

        .stereo-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 7px;
          background: linear-gradient(#304b60, #172c3e);
          color: #b9eaff;
          font-family: "Courier New", monospace;
          font-size: 8px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .stereo-screen {
          margin: 6px;
          padding: 6px;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,.08),
              rgba(0,0,0,.08) 1px,
              transparent 1px,
              transparent 3px
            ),
            #052d3a;
          border: 2px inset #69808e;
          color: #68f6ff;
          font-family: "Courier New", monospace;
          box-shadow:
            inset 0 0 12px rgba(0,255,255,.15);
        }

        .screen-line,
        .screen-bottom {
          display: flex;
          justify-content: space-between;
          gap: 5px;
          font-size: 7px;
          color: #48cbd4;
        }

        .screen-main {
          min-height: 112px;
          padding: 5px 2px;
          text-align: center;
        }

        .pixel-wave {
          color: #38c9d2;
          font-size: 13px;
          letter-spacing: 4px;
          opacity: .7;
          height: 17px;
        }

        .dolphin {
          margin-top: 1px;
          color: #9affff;
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 2px;
          text-shadow: 0 0 5px #22d8ff;
        }

        .screen-song {
          margin-top: 7px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #a7ffff;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .screen-artist {
          margin-top: 2px;
          color: #48b9c2;
          font-size: 8px;
          text-transform: uppercase;
        }

        .equalizer {
          display: flex;
          justify-content: center;
          align-items: end;
          gap: 2px;
          height: 30px;
          margin-top: 6px;
        }

        .equalizer i {
          display: block;
          width: 5px;
          background: #65f8ff;
          box-shadow: 0 0 4px rgba(61,238,255,.7);
        }

        .stereo-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px 5px 6px;
        }

        .stereo-controls button {
          min-width: 27px;
          border: 2px outset #637b8c;
          background: #344b5c;
          color: #d8edf7;
          padding: 3px;
          font-family: "Courier New", monospace;
          font-size: 8px;
        }

        .stereo-controls button:active {
          border-style: inset;
        }

        .led {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin: 0 3px;
          box-shadow: 0 0 5px currentColor;
        }

        .led.red {
          background: #ff3030;
          color: #ff3030;
        }

        .led.green {
          background: #42e85c;
          color: #42e85c;
        }

        .music-player {
          border: 2px solid #285f8d;
          background: #e7f0f7;
          margin: 9px 0;
          box-shadow: 2px 2px 0 #9eb3c3;
        }

        .music-top {
          display: flex;
          justify-content: space-between;
          background: #174e7c;
          color: #fff;
          padding: 4px 6px;
          font-size: 9px;
          font-weight: bold;
        }

        .music-content {
          display: flex;
          gap: 8px;
          padding: 7px;
        }

        .album-art,
        .album-placeholder {
          width: 68px;
          height: 68px;
          flex-shrink: 0;
          border: 2px solid #fff;
          outline: 1px solid #52738d;
          object-fit: cover;
        }

        .album-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #b7d0e1;
          color: #174e7c;
          font-size: 30px;
        }

        .music-info {
          min-width: 0;
          padding-top: 1px;
        }

        .song-title {
          display: block;
          color: #003f91;
          font-size: 12px;
          font-weight: 900;
          text-decoration: underline;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist {
          color: #536d7e;
          font-size: 10px;
          margin-top: 2px;
        }

        .music-actions {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 9px;
        }

        .klyp-button {
          border: 2px outset #eee;
          background: #eee;
          color: #002f60;
          padding: 3px 7px;
          font-size: 9px;
          font-weight: bold;
        }

        .klyp-button:active {
          border-style: inset;
        }

        .music-link {
          color: #004d9d;
          font-size: 9px;
          text-decoration: underline;
        }

        .now-playing {
          border: 1px solid #4f6f87;
          background: #fff;
          margin-bottom: 9px;
        }

        .now-playing-inner {
          padding: 8px;
          text-align: center;
        }

        .now-playing-art {
          width: 130px;
          height: 130px;
          object-fit: cover;
          border: 3px solid #fff;
          outline: 1px solid #57758b;
          box-shadow: 3px 3px 0 #b2c1cb;
        }

        .now-title {
          margin-top: 8px;
          color: #003f7d;
          font-size: 11px;
          font-weight: 900;
        }

        .now-artist {
          color: #637888;
          font-size: 9px;
        }

        .now-button {
          margin-top: 7px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dotted #aaa;
          padding: 4px 0;
          font-size: 10px;
        }

        .stat-label {
          color: #687b89;
        }

        .stat-value {
          color: #003f7d;
          font-weight: bold;
        }

        .banner {
          margin-top: 9px;
          border: 1px solid #888;
          background: #ffffcc;
          padding: 7px;
          color: #333;
          text-align: center;
          font-size: 9px;
        }

        .footer {
          border-top: 3px solid #174c78;
          background: #e8eff4;
          padding: 10px;
          color: #617585;
          font-size: 9px;
          text-align: center;
        }

        .footer a,
        .footer button {
          color: #004d9d;
          text-decoration: underline;
          margin: 0 5px;
        }

        .loading {
          padding: 20px;
          text-align: center;
          color: #547085;
        }

        @media (max-width: 800px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .logo {
            font-size: 48px;
          }

          .display-code {
            display: none;
          }
        }
      `}</style>

      <div className="klyp-site">

        <div className="top-ad">
          klyp.life &nbsp; | &nbsp; welcome to the internet
        </div>

        <header className="masthead">

          <button
            onClick={() => router.push("/")}
            className="logo"
          >
            klyp.
          </button>

          <div className="tagline">
            music · memory · people who get it
          </div>

          <div className="top-links">
            <button onClick={() => router.push("/profile")}>
              my page
            </button>

            <button onClick={() => router.push("/friends")}>
              friends
            </button>

            <button onClick={() => router.push("/messages")}>
              messages
            </button>

            <button onClick={() => router.push("/search")}>
              search
            </button>
          </div>

          <div className="display-code">
            KLYP v2.04
            <br />
            DIGITAL AUDIO SYSTEM
            <br />
            ONLINE ●
          </div>

        </header>

        <nav className="main-nav">

          <button onClick={() => router.push("/feed")}>
            home
          </button>

          <button onClick={() => router.push("/profile")}>
            my page
          </button>

          <button onClick={() => router.push("/friends")}>
            people
          </button>

          <button onClick={() => router.push("/messages")}>
            messages
          </button>

          <button onClick={() => router.push("/search")}>
            search
          </button>

          <button onClick={() => router.push("/upload")}>
            + make a klyp
          </button>

        </nav>

        <div className="ticker">
          <strong>NEWS:</strong>
          new music. new photos. new memories.
        </div>

        <div className="layout">

          {/* LEFT COLUMN */}

          <aside>

            <div className="column-box">
              <SectionTitle>My Klyp</SectionTitle>

              <div className="box-content">

                <MiniAvatar />

                <button
                  onClick={() => router.push("/profile")}
                  className="side-link"
                >
                  my profile
                </button>

                <button
                  onClick={() => router.push("/friends")}
                  className="side-link"
                >
                  my friends
                </button>

                <button
                  onClick={() => router.push("/messages")}
                  className="side-link"
                >
                  my messages
                </button>

                <button
                  onClick={() => router.push("/upload")}
                  className="side-link"
                >
                  make a new klyp
                </button>

              </div>
            </div>

            <div className="column-box">
              <SectionTitle>Quick Links</SectionTitle>

              <div className="box-content">

                <button
                  onClick={() => router.push("/search")}
                  className="side-link"
                >
                  → find people
                </button>

                <button
                  onClick={() => router.push("/friends")}
                  className="side-link"
                >
                  → my friends
                </button>

                <button
                  onClick={() => router.push("/messages")}
                  className="side-link"
                >
                  → inbox
                </button>

                <button
                  onClick={() => router.push("/upload")}
                  className="side-link"
                >
                  → post music
                </button>

              </div>
            </div>

            <div className="column-box">
              <SectionTitle>About Klyp</SectionTitle>

              <div className="box-content">
                <div className="side-copy">
                  Klyp is a place for the songs,
                  <br />
                  photos and random little
                  <br />
                  moments you want to share
                  <br />
                  with your people.
                  <br />
                  <br />
                  No endless algorithm.
                  <br />
                  Just your friends.
                </div>
              </div>
            </div>

            <div className="banner">
              <strong>KLYP TIP</strong>
              <br />
              <br />
              tell people WHY
              <br />
              you like the song.
            </div>

          </aside>

          {/* CENTRE */}

          <section>

            <div className="welcome">

              <SectionTitle>
                KLYP / HOME / WHAT'S NEW
              </SectionTitle>

              <div className="welcome-inner">

                <div className="welcome-title">
                  what are you listening to?
                </div>

                <div className="welcome-sub">
                  see what your people are posting right now.
                </div>

                <button
                  onClick={() => router.push("/upload")}
                  className="post-button"
                >
                  + MAKE A NEW KLYP
                </button>

              </div>

            </div>

            <StereoDisplay post={latestTrack} />

            {status ? (
              <div className="column-box">
                <div className="loading">
                  {status}
                </div>
              </div>
            ) : null}

            {!status && posts.length === 0 ? (
              <div className="column-box">

                <SectionTitle>
                  Nothing Here Yet
                </SectionTitle>

                <div className="box-content">

                  <div className="side-copy">
                    Your feed is completely empty.
                    <br />
                    <br />
                    Be the first person to put something here.
                  </div>

                  <button
                    onClick={() => router.push("/upload")}
                    className="post-button"
                  >
                    POST SOMETHING
                  </button>

                </div>

              </div>
            ) : null}

            {posts.map((post, index) => {

              const name = nameFromPost(
                post,
                profiles
              );

              return (
                <article
                  key={post.id}
                  className="post"
                >

                  <div className="post-head">

                    <div className="post-avatar">
                      <MiniAvatar label={name} />
                    </div>

                    <div className="post-meta">

                      <button className="post-name">
                        {name}
                      </button>

                      <span className="post-time">
                        {timeAgo(post.created_at)}
                      </span>

                      {post.mood_line ? (
                        <div className="post-mood">
                          {post.mood_line}
                        </div>
                      ) : null}

                    </div>

                  </div>

                  <div className="post-body">

                    {post.caption ? (
                      <div className="post-caption">
                        {post.caption}
                      </div>
                    ) : null}

                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt=""
                        className="post-image"
                      />
                    ) : null}

                    <MusicPlayer post={post} />

                    {index === 0 ? (
                      <div
                        style={{
                          color: "#b00000",
                          fontSize: "9px",
                          fontWeight: "bold",
                          marginTop: "5px",
                        }}
                      >
                        ★ newest klyp
                      </div>
                    ) : null}

                  </div>

                  <div className="post-footer">

                    <button>♡ like</button>

                    <button>comment</button>

                    <button>reply</button>

                    <span style={{ color: "#8999a5" }}>
                      {post.created_at
                        ? new Date(
                            post.created_at
                          ).toLocaleDateString(
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

          {/* RIGHT COLUMN */}

          <aside>

            <div className="now-playing">

              <SectionTitle>
                Now Playing
              </SectionTitle>

              <div className="now-playing-inner">

                {latestTrack ? (
                  <>
                    {latestTrack.album_art ? (
                      <img
                        src={latestTrack.album_art}
                        alt=""
                        className="now-playing-art"
                      />
                    ) : (
                      <div
                        className="now-playing-art"
                        style={{
                          background: "#c8dce8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "40px",
                          color: "#24587e",
                        }}
                      >
                        ♫
                      </div>
                    )}

                    <div className="now-title">
                      {latestTrack.song_title}
                    </div>

                    <div className="now-artist">
                      {latestTrack.song_artist}
                    </div>

                    <div className="now-button">
                      <Play
                        src={latestTrack.preview_url}
                      />
                    </div>
                  </>
                ) : (
                  <div className="side-copy">
                    Nobody has posted a song yet.
                    <br />
                    <br />

                    <button
                      onClick={() => router.push("/upload")}
                      className="side-link"
                    >
                      post one →
                    </button>
                  </div>
                )}

              </div>

            </div>

            <div className="column-box">

              <SectionTitle>
                Klyp Stats
              </SectionTitle>

              <div className="box-content">

                <div className="stat">
                  <span className="stat-label">
                    klyps
                  </span>

                  <span className="stat-value">
                    {posts.length}
                  </span>
                </div>

                <div className="stat">
                  <span className="stat-label">
                    music
                  </span>

                  <span className="stat-value">
                    {
                      posts.filter(
                        (p) => p.song_title
                      ).length
                    }
                  </span>
                </div>

                <div className="stat">
                  <span className="stat-label">
                    system
                  </span>

                  <span className="stat-value">
                    ONLINE
                  </span>
                </div>

              </div>

            </div>

            <div className="column-box">

              <SectionTitle>
                People
              </SectionTitle>

              <div className="box-content">

                <button
                  onClick={() => router.push("/search")}
                  className="side-link"
                >
                  find someone
                </button>

                <button
                  onClick={() => router.push("/friends")}
                  className="side-link"
                >
                  your friends
                </button>

                <button
                  onClick={() => router.push("/messages")}
                  className="side-link"
                >
                  send a message
                </button>

              </div>

            </div>

            <div className="column-box">

              <SectionTitle>
                Klyp Radio
              </SectionTitle>

              <div className="box-content">

                <div className="side-copy">
                  <strong>
                    102.7 KLYP FM
                  </strong>

                  <br />
                  <br />

                  music from the people
                  <br />
                  on the internet.

                  <br />
                  <br />

                  <span
                    style={{
                      color: "#008f9c",
                      fontFamily:
                        '"Courier New", monospace',
                      fontSize: "9px",
                    }}
                  >
                    ● BROADCASTING
                  </span>
                </div>

              </div>

            </div>

            <div className="banner">
              <strong>BEST VIEWED</strong>
              <br />
              <br />
              WITH MUSIC
              <br />
              PLAYING.
            </div>

          </aside>

        </div>

        <footer className="footer">

          <div>
            <strong>KLYP.LIFE</strong>
            {" · "}
            music · memory · people who get it
          </div>

          <div style={{ marginTop: "5px" }}>

            <button onClick={() => router.push("/feed")}>
              home
            </button>

            <span>|</span>

            <button onClick={() => router.push("/profile")}>
              my page
            </button>

            <span>|</span>

            <button onClick={() => router.push("/friends")}>
              friends
            </button>

            <span>|</span>

            <button onClick={() => router.push("/messages")}>
              messages
            </button>

            <span>|</span>

            <button onClick={() => router.push("/search")}>
              people
            </button>

          </div>

          <div style={{ marginTop: "7px" }}>
            © 2001–2026 Klyp · made for people, not algorithms
          </div>

        </footer>

      </div>
    </main>
  );
}