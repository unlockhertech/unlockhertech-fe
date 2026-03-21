import { useState, useEffect } from "react";
import { episodes as mockEpisodes } from "../data";
import type { Episode } from "../data";

export const RSS_FEED_URL = "https://anchor.fm/s/e6cb6024/podcast/rss";

// Cover colours cycle for RSS-sourced episodes (they have no custom colours)
const COLORS = ["#B42970", "#72c472", "#5f9de3", "#e8563a", "#f4a0b4"];

// Fallback Unsplash images to cycle through
const FALLBACK_IMAGES = mockEpisodes.map((e) => e.imageUrl ?? "");

// ── RSS parser ─────────────────────────────────────────────────────────────────
const ITUNES = "https://www.itunes.com/dtds/podcast-1.0.dtd";
const MEDIA = "https://search.yahoo.com/mrss/";
const ITUNES_PREFIX = "itunes";
const MEDIA_PREFIX = "media";

function getItunesText(item: Element | Document, localName: string): string {
  return item.getElementsByTagName(`${ITUNES_PREFIX}:${localName}`)[0]?.textContent?.trim() || 
         item.getElementsByTagNameNS(ITUNES, localName)[0]?.textContent?.trim() || "";
}
function getItunesAttr(item: Element | Document, localName: string, attr: string): string {
  return item.getElementsByTagName(`${ITUNES_PREFIX}:${localName}`)[0]?.getAttribute(attr) ||
         item.getElementsByTagNameNS(ITUNES, localName)[0]?.getAttribute(attr) || "";
}

function getMediaAttr(item: Element | Document, localName: string, attr: string): string {
  return item.getElementsByTagName(`${MEDIA_PREFIX}:${localName}`)[0]?.getAttribute(attr) ||
         item.getElementsByTagNameNS(MEDIA, localName)[0]?.getAttribute(attr) || "";
}

function getChannelImageUrl(xml: Document): string {
  const channel = xml.getElementsByTagName("channel")[0];
  if (!channel) return "";

  // 1. Try itunes:image at channel level
  const itunesImg = getItunesAttr(channel, "image", "href");
  if (itunesImg) return itunesImg;

  // 2. Try standard RSS <image> tag
  const image = channel.getElementsByTagName("image")[0];
  if (image) {
    const url = image.getElementsByTagName("url")[0]?.textContent?.trim();
    if (url) return url;
  }

  return "";
}

function getEpisodeImageUrl(item: Element): string {
  const itunesImg = getItunesAttr(item, "image", "href");
  if (itunesImg) return itunesImg;

  const mediaThumb = getMediaAttr(item, "thumbnail", "url");
  if (mediaThumb) return mediaThumb;

  const mediaContent = getMediaAttr(item, "content", "url");
  if (mediaContent) return mediaContent;

  const image = item.getElementsByTagName("image")[0];
  if (image) {
    const url = image.getElementsByTagName("url")[0]?.textContent?.trim();
    if (url) return url;

    const attrUrl = image.getAttribute("url")?.trim();
    if (attrUrl) return attrUrl;
  }

  return "";
}

/** Convert itunes:duration ("HH:MM:SS" | "MM:SS" | raw seconds) → "X min" */
function parseDuration(raw: string): string {
  if (!raw) return "—";
  if (/^\d+$/.test(raw)) return `${Math.round(Number(raw) / 60)} min`;
  const parts = raw.split(":").map(Number);
  if (parts.length === 3) return `${parts[0] * 60 + parts[1]} min`;
  if (parts.length === 2) return `${parts[0]} min`;
  return raw;
}

/** Best-effort date formatting */
function parseDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch {
    return raw;
  }
}

export function parseRssFeed(xml: Document): Episode[] {
  const channelImg  = getChannelImageUrl(xml);
  const items = Array.from(xml.getElementsByTagName("item"));
  return items.map((item, i) => {
    const title       = item.getElementsByTagName("title")[0]?.textContent?.trim() ?? `Episode ${i + 1}`;
    const rawDesc     = item.getElementsByTagName("description")[0]?.textContent ?? "";
    // Strip HTML tags from the description
    const description = rawDesc.replace(/<[^>]+>/g, "").trim().slice(0, 220);
    const audioUrl    = item.getElementsByTagName("enclosure")[0]?.getAttribute("url") ?? "";
    const pubDate     = item.getElementsByTagName("pubDate")[0]?.textContent?.trim() ?? "";
    const duration    = parseDuration(getItunesText(item, "duration"));
    const epNumRaw    = getItunesText(item, "episode");
    const episodeImg  = getEpisodeImageUrl(item);

    // Use explicit itunes:episode if present, otherwise count down from total
    const episodeNumber = epNumRaw ? parseInt(epNumRaw, 10) : items.length - i;

    return {
      // Always use array index as id to guarantee uniqueness —
      // itunes:episode numbers are optional and may collide when mixed.
      id:            i + 1,
      title,
      description:   description || title,
      audioUrl,
      duration,
      date:          parseDate(pubDate),
      episodeNumber,
      coverColor:    COLORS[i % COLORS.length],
      imageUrl:      episodeImg || channelImg || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
    };
  });
}

// ── Hook ───────────────────────────────────────────────────────────────────────
interface UseRssFeedResult {
  episodes: Episode[];
  loading:  boolean;
  error:    string | null;
  isLive:   boolean;  // true = data came from the live RSS feed
}

export function useRssFeed(): UseRssFeedResult {
  const [episodes, setEpisodes] = useState<Episode[]>(mockEpisodes);
  const [loading,  setLoading]  = useState(!!RSS_FEED_URL && RSS_FEED_URL.trim() !== "");
  const [error,    setError]    = useState<string | null>(null);
  const [isLive,   setIsLive]   = useState(false);

  useEffect(() => {
    // Skip fetch when the URL is empty / still a template placeholder
    if (!RSS_FEED_URL || RSS_FEED_URL.trim() === "") return;

    fetch(RSS_FEED_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        const xml    = new DOMParser().parseFromString(text, "text/xml");
        const parsed = parseRssFeed(xml);

        if (parsed.length === 0) {
          throw new Error("RSS feed parsed successfully but contained 0 episodes.");
        }

        console.info(`[RSS] Loaded ${parsed.length} episodes from feed.`);
        setEpisodes(parsed);
        setIsLive(true);
      })
      .catch((err: Error) => {
        console.warn(
          `[RSS] Feed fetch failed — showing mock data instead.\n` +
          `Error: ${err.message}\n\n` +
          `Possible causes:\n` +
          `  • The URL is incorrect\n` +
          `  • The feed server doesn't send CORS headers (Access-Control-Allow-Origin: *)\n` +
          `  • You are running behind a firewall / proxy\n\n` +
          `Tip: If you get a CORS error, route the fetch through a lightweight\n` +
          `serverless function (e.g. a Vercel Edge Function) that adds CORS headers.`
        );
        setError(err.message);
        // Keep mock data — no setEpisodes call needed
      })
      .finally(() => setLoading(false));
  }, []); // run once on mount

  return { episodes, loading, error, isLive };
}