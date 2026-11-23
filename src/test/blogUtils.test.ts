import { describe, it, expect } from "vitest";
import {
  extractTextFromBody,
  cleanSnippetText,
  getBlogPostExcerpt,
} from "../app/utils/blogUtils";
import type { BlogPost } from "../app/types";

describe("blogUtils", () => {
  describe("extractTextFromBody", () => {
    it("returns an empty string when body is undefined, null, or empty array", () => {
      expect(extractTextFromBody(undefined)).toBe("");
      expect(extractTextFromBody([])).toBe("");
    });

    it("extracts text from standard block spans", () => {
      const body = [
        {
          _type: "block",
          children: [
            { text: "Role models are not just a 'nice to have' for women in the workforce. " },
            { text: "Let that sink in for a moment." },
          ],
        },
      ];
      expect(extractTextFromBody(body)).toBe(
        "Role models are not just a 'nice to have' for women in the workforce. Let that sink in for a moment."
      );
    });

    it("extracts text from callout blocks, quotes, and points", () => {
      const body = [
        {
          _type: "callout",
          content: "Key takeaway message",
          points: ["Point 1", "Point 2"],
          referenceText: "Source 2026",
        },
        {
          _type: "pullQuote",
          quote: "Inspiring quote text",
        },
      ];
      const text = extractTextFromBody(body);
      expect(text).toContain("Key takeaway message");
      expect(text).toContain("Point 1 Point 2");
      expect(text).toContain("Source 2026");
      expect(text).toContain("Inspiring quote text");
    });
  });

  describe("cleanSnippetText", () => {
    it("strips markdown images, formatting, and preserves link anchor text", () => {
      const markdown = "### Header\n\n![Hero Image](https://example.com/img.jpg)\n\nRead the [full article](https://example.com) for **critical** insights and `code`.";
      const cleaned = cleanSnippetText(markdown);
      expect(cleaned).toBe("Header Read the full article for critical insights and code.");
    });

    it("normalizes multiple whitespace and newlines", () => {
      const input = "Line one\n\n\n   Line two   with   spaces   ";
      expect(cleanSnippetText(input)).toBe("Line one Line two with spaces");
    });
  });

  describe("getBlogPostExcerpt", () => {
    it("returns explicit excerpt when provided", () => {
      const post: Partial<BlogPost> = {
        title: "Test Post",
        excerpt: "This is a curated author summary.",
        content: "Longer markdown content here that should be ignored.",
      };
      expect(getBlogPostExcerpt(post)).toBe("This is a curated author summary.");
    });

    it("falls back to markdown content when excerpt is absent", () => {
      const post: Partial<BlogPost> = {
        title: "Test Post",
        content: "Let's start with a simple exercise. Try naming 10 women in tech.",
      };
      expect(getBlogPostExcerpt(post)).toBe(
        "Let's start with a simple exercise. Try naming 10 women in tech."
      );
    });

    it("falls back to body blocks when content is absent (fixes Sanity Studio posts)", () => {
      const post: Partial<BlogPost> = {
        title: "The Importance of Role Models for Women in Tech",
        content: undefined,
        body: [
          {
            _type: "block",
            children: [
              { text: "Role models are not just a 'nice to have' for women in the workforce. " },
              { text: "Let that sink in for a moment." },
            ],
          },
        ],
      };
      expect(getBlogPostExcerpt(post)).toBe(
        "Role models are not just a 'nice to have' for women in the workforce. Let that sink in for a moment."
      );
    });

    it("truncates cleanly to maxLength and appends '...' without trailing punctuation", () => {
      const post: Partial<BlogPost> = {
        title: "Long Post",
        content: "A".repeat(200) + ", more content here.",
      };
      const excerpt = getBlogPostExcerpt(post, 50);
      expect(excerpt.length).toBe(53); // 50 chars + "..."
      expect(excerpt.endsWith("...")).toBe(true);
      expect(excerpt).not.toContain(",...");
    });

    it("returns empty string when no text is available at all", () => {
      const post: Partial<BlogPost> = {
        title: "Empty Post",
        content: "",
        body: [],
      };
      expect(getBlogPostExcerpt(post)).toBe("");
    });
  });
});
