#!/usr/bin/env node
// Fetches the public TikTok profile stats for @farlandstech and writes stats.json.
// Run daily by .github/workflows/update-stats.yml. If TikTok blocks the request,
// the script exits with an error and leaves the previous stats.json untouched.
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const USER = "farlandstech";
const FILE = fileURLToPath(new URL("../stats.json", import.meta.url));

export function parseStats(html) {
  const m = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      const j = JSON.parse(m[1]);
      const ui = ((j.__DEFAULT_SCOPE__ || {})["webapp.user-detail"] || {}).userInfo;
      const s = ui && ui.stats;
      if (s && s.followerCount != null) {
        return {
          followers: Number(s.followerCount),
          following: Number(s.followingCount),
          likes: Number(s.heartCount != null ? s.heartCount : s.heart),
          videos: Number(s.videoCount),
        };
      }
    } catch (e) { /* fall through to the regex fallback */ }
  }
  const g = (k) => { const r = html.match(new RegExp('"' + k + '":(\\d+)')); return r ? Number(r[1]) : null; };
  const f = g("followerCount");
  if (f != null) {
    const likes = g("heartCount") != null ? g("heartCount") : g("heart");
    return { followers: f, following: g("followingCount"), likes, videos: g("videoCount") };
  }
  return null;
}

export function merge(prev, stats, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  const history = (prev && Array.isArray(prev.history) ? prev.history : []).filter((h) => h.d !== day);
  history.push({ d: day, f: stats.followers });
  return { ...stats, updated: now.toISOString(), history: history.slice(-60) };
}

async function main() {
  const res = await fetch(`https://www.tiktok.com/@${USER}`, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
      accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`TikTok answered HTTP ${res.status}`);
  const stats = parseStats(await res.text());
  if (!stats || Object.values(stats).some((v) => v == null || Number.isNaN(v))) {
    throw new Error("Could not find follower stats in the TikTok page (blocked or layout changed).");
  }
  let prev = null;
  try { prev = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch (e) {}
  fs.writeFileSync(FILE, JSON.stringify(merge(prev, stats), null, 2) + "\n");
  console.log("stats.json updated:", stats);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
