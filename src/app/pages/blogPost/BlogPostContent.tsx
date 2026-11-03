import React, { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { PortableText, type PortableTextComponents, type PortableTextProps } from "@portabletext/react";
import { BlogCallout } from "../../components/blog/BlogCallout";
import { BlogPullQuote } from "../../components/blog/BlogPullQuote";
import { BlogCaptionedImage } from "../../components/blog/BlogCaptionedImage";
import { urlForOptimized } from "../../utils/sanity";
import type { BlogPost, CalloutVariant } from "../../types";

interface BlogPostContentProps {
  post: BlogPost;
}

function extractRawText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) {
    return node.map(extractRawText).join("");
  }
  if (
    typeof node === "object" &&
    node !== null &&
    "props" in (node as unknown as Record<string, unknown>)
  ) {
    const element = node as unknown as { props?: { children?: ReactNode } };
    return extractRawText(element.props?.children);
  }
  return "";
}

function stripAlertPrefix(text: string): string {
  return text
    .replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "")
    .replace(/^\*\*(Did You Know\??|Key Takeaway:?|Pro Tip:?|Important:?|Note:?)\*\*\s*/i, "")
    .trim();
}

function parseReferenceFromText(text: string): { cleanText: string; refText?: string; refUrl?: string } {
  const refMatch = text.match(/\b(?:Reference|Source):\s*(?:\[([^\]]+)\]\(([^)]+)\)|([^\n]+))/i);
  if (refMatch) {
    const matchedFull = refMatch[0];
    const refText = refMatch[1] || refMatch[3]?.trim();
    const refUrl = refMatch[2];
    const cleanText = text.replace(matchedFull, "").trim();
    return { cleanText, refText, refUrl };
  }
  return { cleanText: text };
}

function getCalloutVariant(rawText: string): CalloutVariant | null {
  const lower = rawText.toLowerCase();
  if (lower.includes("did you know")) return "didYouKnow";
  if (lower.includes("[!tip]") || lower.includes("pro tip") || lower.startsWith("tip:")) return "tip";
  if (
    lower.includes("[!important]") ||
    lower.includes("[!warning]") ||
    lower.includes("key takeaway")
  ) {
    return "keyTakeaway";
  }
  if (lower.includes("[!note]") || lower.startsWith("note:")) return "highlight";
  return null;
}

function renderMarkdownBlockquote(children: ReactNode) {
  const raw = extractRawText(children).trim();
  const variant = getCalloutVariant(raw);

  if (variant) {
    const childArray = React.Children.toArray(children);
    if (childArray.length > 1) {
      const firstChildRaw = extractRawText(childArray[0]).trim();
      const firstChildClean = stripAlertPrefix(firstChildRaw);

      if (firstChildClean.length === 0) {
        return <BlogCallout variant={variant}>{childArray.slice(1)}</BlogCallout>;
      }
    }

    const stripped = stripAlertPrefix(raw);
    const { cleanText, refText, refUrl } = parseReferenceFromText(stripped);
    return (
      <BlogCallout
        variant={variant}
        content={cleanText}
        referenceText={refText}
        referenceUrl={refUrl}
      />
    );
  }

  // Attribution detection (e.g. "Quote text" — Author Name)
  if (raw.includes(" — ") || raw.includes(" – ")) {
    const parts = raw.split(/\s+[—–]\s+/);
    if (parts.length >= 2) {
      const quote = (parts[0] ?? "").trim();
      const attribution = (parts[1] ?? "").trim();
      return <BlogPullQuote quote={quote} attribution={attribution} />;
    }
  }

  return <BlogPullQuote>{children}</BlogPullQuote>;
}

const portableTextComponents: PortableTextComponents = {
  types: {
    callout: ({ value }) => (
      <BlogCallout
        variant={(value?.variant as CalloutVariant) || "didYouKnow"}
        title={value?.title}
        content={value?.content}
        points={value?.points}
        referenceText={value?.referenceText}
        referenceUrl={value?.referenceUrl}
      />
    ),
    pullQuote: ({ value }) => (
      <BlogPullQuote
        quote={value?.quote}
        attribution={value?.attribution}
        role={value?.role}
      />
    ),
    captionedImage: ({ value }) => {
      const src =
        value?.imageUrl ||
        (value?.image ? urlForOptimized(value.image) : "") ||
        "";
      return (
        <BlogCaptionedImage
          src={src}
          alt={value?.alt}
          caption={value?.caption}
        />
      );
    },
    image: ({ value }) => {
      const src = value?.imageUrl || urlForOptimized(value) || "";
      return (
        <BlogCaptionedImage
          src={src}
          alt={value?.alt}
          caption={value?.caption}
        />
      );
    },
  },
  block: {
    blockquote: ({ children }) => <BlogPullQuote>{children}</BlogPullQuote>,
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mt-8 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-berry hover:text-brand-coral underline decoration-brand-berry/30 hover:decoration-brand-coral transition-colors"
      >
        {children}
      </a>
    ),
  },
};

const markdownComponents: Components = {
  blockquote: ({ children }) => renderMarkdownBlockquote(children),
  img: ({ src, alt, title }) => (
    <BlogCaptionedImage src={src || ""} alt={alt} caption={title} />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-brand-berry hover:text-brand-coral underline decoration-brand-berry/30 hover:decoration-brand-coral transition-colors"
    >
      {children}
    </a>
  ),
};

export function BlogPostContent({ post }: Readonly<BlogPostContentProps>) {
  const hasPortableBody = Boolean(
    post.body && Array.isArray(post.body) && post.body.length > 0
  );

  return (
    <article className="prose prose-lg prose-rose max-w-none mb-16 blog-content bg-white dark:bg-gray-900 p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
      {hasPortableBody ? (
        <PortableText
          value={post.body as PortableTextProps["value"]}
          components={portableTextComponents}
        />
      ) : (
        <ReactMarkdown components={markdownComponents}>
          {post.content || ""}
        </ReactMarkdown>
      )}
    </article>
  );
}
