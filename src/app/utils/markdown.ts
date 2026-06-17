import matter from "gray-matter";
import { Buffer } from "buffer";

// Polyfill Buffer for gray-matter in browser
if (typeof window !== "undefined" && typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}

import type { BlogPost } from "../types";

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
