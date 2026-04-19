"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
};

function moodFromRecent(recent: any[], top: Track[]) {
  if (!recent.length && !top.length) return "No listening data yet";

  const hours = recent.map((x) => new Date(x.played_at).getHours());
  const avgHour =
    hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : 18;

  const names = [...recent.map((x) => x.track?.name), ...top.map((x) => x.name)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const repeated = recent
    .map((x) => x.track?.name)
    .filter(Boolean)
    .reduce((acc: Record<string, number>, name: string) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

const mostRepeated = (Object.entries(repeated) as [string, number][])
  .sort((a, b) => b[1] - a[1])[0];

  if (avgHour >= 0 && avgHour < 5) return "After Midnight / inward / replaying the same feeling";
  if (avgHour >= 5 && avgHour < 12) return "Morning Drift / reset / soft momentum";
  if (avgHour >= 12 && avgHour < 18) return "Daylight Blur / moving / detached";
  if (names.includes("radiohead")) return "Grey Glow / overcast / cinematic";
  if (names.includes("the cure")) return "Cold Air / bright sadness / motion";
  if (mostRepeated && mostRepeated[1] >= 2) return `Repeat State / ${mostRepeated[0]} / not over it yet`;

  return "Late Train / city lights / quiet replay";
}

export default function SpotifyInsights() {
  const [loading, setLoading] = useState(true);
  const [needsConnect, setNeedsConnect] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);

  useEffect(() => {
    async function loadSpotify() {
      const token = localStorage.getItem("spotify_access_token");

      if (!token) {
        setNeedsConnect(true);
        setLoading(false);
        return;
      }

      try {
        const [profileRes, topRes, recentRes] = await Promise.all([
          fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.spotify.com/v1/me/player/recently-played?limit=8", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if ([profileRes.status, topRes.status, recentRes.status].some((x) => x === 401)) {
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_refresh_token");
          setNeedsConnect(true);
          setLoading(false);
          return;
        }

        if (!profileRes.ok || !topRes.ok || !recentRes.ok) {
          throw new Error("Spotify data could not load");
        }

        const profileData = await profileRes.json();
        const topData = await topRes.json();
        const recentData = await recentRes.json();

        setProfile(profileData);
        setTopTracks(topData.items || []);
        setRecentTracks(recentData.items || []);
      } catch (err: any) {
        setError(err.message || "Spotify failed to load");
      } finally {
        setLoading(false);
      }
    }

    loadSpotify();
  }, []);

  const recap = useMemo(() => moodFromRecent(recentTracks, topTracks), [recentTracks, topTracks]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-sm text-black/55">Loading Spotify…</div>
      </div>
    );
  }

  if (needsConnect) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Spotify</div>
        <h3 className="mt-3 text-xl font-semibold">Connect your listening</h3>
        <p className="mt-3 text-sm leading-7 text-black/60">
          Link Spotify to unlock Top Songs, Daily Recap, and mood cards across KLYP.
        </p>
        <Link
          href="/spotify"
          className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm text-white"
        >
          Connect Spotify
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Spotify</div>
        <div className="mt-3 text-xl font-semibold">
          {profile?.display_name || "Connected"}
        </div>
        <p className="mt-2 text-sm text-black/55">
          Listening is now part of your profile.
        </p>
      </div>

      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Daily Recap</div>
        <div className="mt-3 text-[22px] font-semibold leading-tight">{recap}</div>
        <p className="mt-3 text-sm text-black/55">
          Generated from your recent plays and top songs.
        </p>
      </div>

      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Top Songs</div>
        <div className="mt-4 space-y-3">
          {topTracks.length ? topTracks.map((track, i) => (
            <div key={track.id} className="rounded-2xl bg-[#f8f5ef] p-4">
              <div className="text-[12px] text-black/40">#{i + 1}</div>
              <div className="mt-1 text-[15px] font-medium">
                {track.name}
              </div>
              <div className="text-[13px] text-black/55">
                {track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          )) : (
            <div className="text-sm text-black/55">No top tracks yet.</div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-[12px] uppercase tracking-[0.16em] text-black/35">Recently Played</div>
        <div className="mt-4 space-y-3">
          {recentTracks.length ? recentTracks.slice(0, 5).map((item, i) => (
            <div key={`${item.track?.id}-${i}`} className="rounded-2xl bg-[#f8f5ef] p-4">
              <div className="text-[15px] font-medium">{item.track?.name}</div>
              <div className="text-[13px] text-black/55">
                {item.track?.artists?.map((a: any) => a.name).join(", ")}
              </div>
            </div>
          )) : (
            <div className="text-sm text-black/55">No recent listening yet.</div>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-red-200 bg-white p-5 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}
