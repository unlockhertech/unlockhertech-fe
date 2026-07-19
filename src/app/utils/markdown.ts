import matter from "gray-matter";
import { Buffer } from "buffer";

// Polyfill Buffer for gray-matter in browser
type WindowWithBuffer = Window & { Buffer?: typeof Buffer };
if (typeof window !== "undefined") {
  const browserWindow = window as WindowWithBuffer;
  if (typeof browserWindow.Buffer === "undefined") {
    browserWindow.Buffer = Buffer;
  }
}

import type { BlogPost, EventPlatform, ExternalEvent } from "../types";

/**
 * Parses all Markdown files in the blog content directory.
 * Uses Vite's import.meta.glob to load files dynamically.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const modules = import.meta.glob("/src/content/blog/*.md", { query: "?raw", import: "default" });
    const postList: BlogPost[] = [];

    for (const path in modules) {
      try {
        const content = (await modules[path]()) as string;
        const { data, content: body } = matter(content);
        const slug = path.split("/").pop()?.replace(".md", "") || "";

        if (slug === "TEMPLATE") continue;

        postList.push({
          ...data,
          slug,
          content: body,
          readingTime: calculateReadingTime(body),
        } as BlogPost);
      } catch (err) {
        console.error(`Error parsing markdown file at ${path}:`, err);
      }
    }

    // Sort by date descending (newest first)
    return postList.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
    });
  } catch (err) {
    console.error("Critical error in getAllBlogPosts:", err);
    return [];
  }
}

/**
 * Fetches and parses a single blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const modules = import.meta.glob("/src/content/blog/*.md", { query: "?raw", import: "default" });
    const path = `/src/content/blog/${slug}.md`;

    if (!(path in modules)) {
      return null;
    }

    const content = (await modules[path]()) as string;
    const { data, content: body } = matter(content);

    return {
      ...data,
      slug,
      content: body,
      readingTime: calculateReadingTime(body),
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);
    return null;
  }
}

export async function getAllExternalEvents(): Promise<ExternalEvent[]> {
  try {
    const modules = import.meta.glob("/src/content/events/*.md", { query: "?raw", import: "default" });
    const events: ExternalEvent[] = [];

    for (const path in modules) {
      try {
        const content = (await modules[path]()) as string;
        const { data } = matter(content);
        const slug = path.split("/").pop()?.replace(".md", "") || "";

        if (slug === "TEMPLATE") continue;

        const title = typeof data.title === "string" ? data.title.trim() : "";
        const date = typeof data.date === "string" ? data.date : "";
        const urlOrId = typeof data.urlOrId === "string" ? data.urlOrId.trim() : "";
        const platform = normalizePlatform(data.platform);

        if (!title || !date || !urlOrId) continue;

        events.push({
          title,
          date,
          platform,
          urlOrId,
          slug,
          image: typeof data.image === "string" ? data.image : undefined,
        });
      } catch (err) {
        console.error(`Error parsing event markdown file at ${path}:`, err);
      }
    }

    return events.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (Number.isNaN(dateA) ? 0 : dateA) - (Number.isNaN(dateB) ? 0 : dateB);
    });
  } catch (err) {
    console.error("Critical error in getAllExternalEvents:", err);
    return [];
  }
}

/**
 * Calculates the estimated reading time for a given text.
 * Average reading speed is ~200-250 words per minute.
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225;
  const noOfWords = content.split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
}

function normalizePlatform(value: unknown): EventPlatform {
  return value === "Eventbrite" ? "Eventbrite" : "Luma";
}
