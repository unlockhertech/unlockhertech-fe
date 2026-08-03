import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { BlogPost, ExternalEvent } from "../types";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2024-03-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
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
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured. Returning empty blog post list.");
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
    console.error("Error fetching blog posts from Sanity:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured.");
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
    console.error(`Error fetching blog post with slug "${slug}" from Sanity:`, error);
    return null;
  }
}

/**
 * Fetches all external events, sorted by date ascending.
 */
export async function getAllExternalEvents(): Promise<ExternalEvent[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured. Returning empty event list.");
      return [];
    }

    const query = `*[_type == "event"] | order(date asc) {
      title,
      date,
      platform,
      urlOrId,
      "slug": slug.current,
      "image": image.asset->url
    }`;

    return await sanityClient.fetch(query);
  } catch (error) {
    console.error("Error fetching external events from Sanity:", error);
    return [];
  }
}
