import type { BlogPost } from "../types";

/**
 * Extracts plain text from Sanity PortableText body blocks, including headings, paragraphs,
 * callout blocks, pull quotes, and custom structured content.
 */
export function extractTextFromBody(body?: unknown[]): string {
  if (!body || !Array.isArray(body)) return "";
  let text = "";
  for (const block of body) {
    if (block && typeof block === "object") {
      const b = block as Record<string, unknown>;
      if (Array.isArray(b.children)) {
        for (const child of b.children) {
          if (child && typeof child === "object" && typeof (child as Record<string, unknown>).text === "string") {
            text += " " + (child as Record<string, unknown>).text;
          }
        }
      }
      if (typeof b.content === "string") {
        text += " " + b.content;
      } else if (Array.isArray(b.content)) {
        text += " " + extractTextFromBody(b.content);
      }
      if (Array.isArray(b.points)) {
        text += " " + b.points.filter((p) => typeof p === "string").join(" ");
      }
      if (typeof b.referenceText === "string") {
        text += " " + b.referenceText;
      }
      if (typeof b.quote === "string") {
        text += " " + b.quote;
      }
    }
  }
  return text.replaceAll(/\s+/g, " ").trim();
}

/**
 * Cleans markdown formatting, links, and extra whitespace from raw text for snippet display.
 */
export function cleanSnippetText(text: string): string {
  if (!text) return "";
  return text
    .replaceAll(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replaceAll(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replaceAll(/[#*`_~>]/g, "")
    .replaceAll(/\s+/g, " ")
    .trim();
}

/**
 * Derives a clean preview excerpt for a blog post from excerpt, content, or PortableText body.
 * Ensures the preview does not end with redundant punctuation or trailing ellipses.
 */
export function getBlogPostExcerpt(post?: Partial<BlogPost> | null, maxLength = 160): string {
  if (!post) return "";

  const candidate =
    post.excerpt?.trim() ||
    post.content?.trim() ||
    extractTextFromBody(post.body);

  const clean = cleanSnippetText(candidate);
  if (!clean) return "";

  if (clean.length <= maxLength) {
    return clean;
  }

  const truncated = clean
    .slice(0, maxLength)
    .trim()
    .replace(/[.,;:\s]+$/, "");

  return `${truncated}...`;
}
