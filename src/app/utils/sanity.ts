import { createClient } from "@sanity/client";
import {createImageUrlBuilder} from "@sanity/image-url";
import type {SanityImageSource} from "@sanity/image-url";
import type { BlogPost, ExternalEvent, Resource } from "../types";


const getEnv = () => {
  if (import.meta?.env) {
    return import.meta.env;
  }
  if (typeof process !== "undefined" && process?.env) {
    return process.env;
  }
  return {};
};

const env = getEnv();

export const sanityClient = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID || "uht-preview",
  dataset: env.VITE_SANITY_DATASET || "production",
  apiVersion: env.VITE_SANITY_API_VERSION || "2024-03-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

export function urlForOptimized(source: SanityImageSource, width = 800, quality = 80) {
  return builder.image(source).width(width).quality(quality).auto("format").url();
}


function calculateReadingTime(content: string = ""): string {
  const wordsPerMinute = 225;
  const noOfWords = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
  return `${minutes} min read`;
}

/**
 * Fetches all blog posts, sorted by date descending.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!env.VITE_SANITY_PROJECT_ID) {
      return [];
    }

    const query = `*[_type == "post"] | order(date desc) {
      title,
      date,
      author,
      tags,
      canonicalUrl,
      "slug": slug.current,
      "imageUrl": imageUrl.asset->url,
      content,
      body
    }`;

    const posts: BlogPost[] = await sanityClient.fetch(query);
    return posts.map((post) => ({
      ...post,
      readingTime: calculateReadingTime(post.content || ""),
    }));
  } catch (error) {
    console.warn("Could not fetch blog posts from Sanity, using fallback:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!env.VITE_SANITY_PROJECT_ID) {
      return null;
    }

    const query = `*[_type == "post" && slug.current == $slug][0] {
      title,
      date,
      author,
      tags,
      canonicalUrl,
      "slug": slug.current,
      "imageUrl": imageUrl.asset->url,
      content,
      body
    }`;

    const post = await sanityClient.fetch(query, { slug });
    if (!post) return null;

    return {
      ...post,
      readingTime: calculateReadingTime(post.content || ""),
    };
  } catch (error) {
    console.warn(`Could not fetch blog post "${slug}" from Sanity:`, error);
    return null;
  }
}

import imgAiBuildersLockup from "../../assets/conference-lockup-dark.svg";

export const DEFAULT_FALLBACK_EVENTS: ExternalEvent[] = [
  {
    title: "AI Builders Global Conference 2026",
    slug: "ai-builders-global-conference-2026",
    date: "2026-10-14T13:00:00.000Z",
    platform: "Conference",
    urlOrId: "https://aibuildersnetwork.org/conference/tickets",
    image: imgAiBuildersLockup,
    description: "The #1 Virtual AI Conference for Builders, Tech Leaders, and Operators. 200+ sessions across AI Strategy, Startups, and AI Engineering.",
    discountCode: "UNLOCKHERTECH20-F056D5212AE7",
    discountPercentage: "20%",
    ctaLabel: "Get tickets (20% off)",
    isPartner: true,
  },
];

/**
 * Fetches external events, sorted by date ascending.
 * Automatically filters out past events unless `includePast` is set to true.
 */
export async function getAllExternalEvents(includePast = false): Promise<ExternalEvent[]> {
  try {
    if (!env.VITE_SANITY_PROJECT_ID) {
      return includePast
        ? DEFAULT_FALLBACK_EVENTS
        : DEFAULT_FALLBACK_EVENTS.filter((event) => {
            const eventTime = new Date(event.date).getTime();
            if (Number.isNaN(eventTime)) return true;
            return eventTime + 3 * 60 * 60 * 1000 >= Date.now();
          });
    }

    const query = `*[_type == "event"] | order(date asc) {
      title,
      date,
      platform,
      urlOrId,
      discountCode,
      description,
      ctaLabel,
      isPartner,
      "slug": slug.current,
      "image": image.asset->url
    }`;

    const sanityEvents: ExternalEvent[] = await sanityClient.fetch(query);
    const sanitySlugs = new Set(sanityEvents.map((e) => e.slug).filter(Boolean));
    const missingFallbacks = DEFAULT_FALLBACK_EVENTS.filter((e) => !sanitySlugs.has(e.slug));
    const events: ExternalEvent[] = [...sanityEvents, ...missingFallbacks].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (includePast) return events;

    const now = Date.now();
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // Keep event card visible for 3 hours after start time

    return events.filter((event) => {
      const eventTime = new Date(event.date).getTime();
      if (Number.isNaN(eventTime)) return true;
      return eventTime + THREE_HOURS_MS >= now;
    });
  } catch (error) {
    console.warn("Could not fetch external events from Sanity, using fallback:", error);
    return DEFAULT_FALLBACK_EVENTS;
  }
}

/**
 * Fetches all published PDF resources from Sanity.
 */
export async function getAllResources(): Promise<Resource[]> {
  try {
    if (!env.VITE_SANITY_PROJECT_ID) {
      return [];
    }

    const query = `*[_type == "resource" && isPublished != false] | order(publishedAt desc) {
      "id": _id,
      title,
      "slug": slug.current,
      description,
      category,
      "pdfUrl": coalesce(pdfFile.asset->url, externalPdfUrl, ""),
      fileSize,
      pageCount,
      accentColor,
      isPublished,
      publishedAt
    }`;

    const resources: Resource[] = await sanityClient.fetch(query);
    return resources;
  } catch (error) {
    console.warn("Could not fetch resources from Sanity:", error);
    return [];
  }
}



