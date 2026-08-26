import { useState, useEffect } from "react";
import { episodes as mockEpisodes } from "../data";
import type { Episode } from "../types";

export const RSS_FEED_URL = "https://anchor.fm/s/e6cb6024/podcast/rss";
const CACHE_KEY = "uht_rss_episodes_cache";

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

  const itunesImg = getItunesAttr(channel, "image", "href");
  if (itunesImg) return itunesImg;

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

function parseDuration(raw: string): string {
  if (!raw) return "—";
  if (/^\d+$/.test(raw)) {
    const totalSeconds = Number(raw);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes} min` : `${seconds} sec`;
  }
  const parts = raw.split(":").map(Number);
  if (parts.length === 3) {
    const totalMinutes = parts[0] * 60 + parts[1];
    return `${totalMinutes} min`;
  }
  if (parts.length === 2) {
    return `${parts[0]} min`;
  }
  return raw;
}

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
    const description = rawDesc
        .replace(/<[^>]+>/g, " ")
        .replaceAll('&amp;', "&")
        .replaceAll('&lt;', "<")
        .replaceAll('&gt;', ">")
        .replaceAll('&quot;', "\"")
        .replaceAll('&#39;', "'")
        .trim();
    const audioUrl    = item.getElementsByTagName("enclosure")[0]?.getAttribute("url") ?? "";
    const pubDate     = item.getElementsByTagName("pubDate")[0]?.textContent?.trim() ?? "";
    const duration    = parseDuration(getItunesText(item, "duration"));
    const epNumRaw    = getItunesText(item, "episode");
    const episodeImg  = getEpisodeImageUrl(item);

    const episodeNumber = epNumRaw ? Number.parseInt(epNumRaw, 10) : items.length - i;

    return {
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
  isLive:   boolean;
}

function getInitialRssState(): { episodes: Episode[]; isLive: boolean } {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      if (data && Array.isArray(data) && data.length > 0) {
        return { episodes: data, isLive: true };
      }
    }
  } catch (err) {
    console.warn("[RSS Cache] Read error:", err);
  }
  return { episodes: mockEpisodes, isLive: false };
}

export function useRssFeed(): UseRssFeedResult {
  const [initial] = useState(getInitialRssState);
  const [episodes, setEpisodes] = useState<Episode[]>(initial.episodes);
  const [loading,  setLoading]  = useState(() => !initial.isLive && Boolean(RSS_FEED_URL?.trim()));
  const [error,    setError]    = useState<string | null>(null);
  const [isLive,   setIsLive]   = useState(initial.isLive);

  useEffect(() => {
    if (!RSS_FEED_URL || RSS_FEED_URL.trim() === "") {
      return;
    }

    let isMounted = true;

    // Fetch fresh feed in background
    fetch(RSS_FEED_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        const xml    = new DOMParser().parseFromString(text, "text/xml");
        const parsed = parseRssFeed(xml);

        if (parsed.length === 0) {
          throw new Error("RSS feed contained 0 episodes.");
        }

        console.info(`[RSS] Successfully fetched ${parsed.length} live episodes.`);
        setEpisodes(parsed);
        setIsLive(true);
        setLoading(false);

        // Update cache
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: parsed })
          );
        } catch (e) {
          console.warn("[RSS Cache] Write error:", e);
        }
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        console.warn("[RSS] Live fetch failed, using fallback:", err.message);
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { episodes, loading, error, isLive };
}