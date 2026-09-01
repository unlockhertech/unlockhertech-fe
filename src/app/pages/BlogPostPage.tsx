import { useMemo } from "react";
import { Link } from "react-router";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";
import { useBlogPost } from "./blogPost/useBlogPost";
import { BlogPostHeader } from "./blogPost/BlogPostHeader";
import { BlogPostContent } from "./blogPost/BlogPostContent";
import { BlogPostNav } from "./blogPost/BlogPostNav";

export function BlogPostPage() {
  const { slug, post, prevPost, nextPost, loading } = useBlogPost();

  const blogPostJsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.content?.substring(0, 160).replace(/[#*`]/g, ""),
      "image": post.imageUrl ? [post.imageUrl] : undefined,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Unlock Her Tech",
        "logo": {
          "@type": "ImageObject",
          "url": "https://unlockhertech.com/logo.png",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id":
          post.canonicalUrl ||
          (globalThis.window !== undefined
            ? globalThis.location.href
            : `https://unlockhertech.com/blog/${slug}`),
      },
    };
  }, [post, slug]);

  useMetaData(
    post?.title || "Blog Post",
    post?.content?.substring(0, 160).replace(/[#*`]/g, ""),
    post?.canonicalUrl,
    post
      ? {
          image: post.imageUrl,
          type: "article",
          jsonLd: blogPostJsonLd,
        }
      : undefined
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link to="/" className="text-brand-coral hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen relative overflow-hidden">
      <div className="relative">
        <BrandPatternOverlay variant="watermark" />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* ── 1. Header (Breadcrumb, Image, Title, Meta & Share) ─────────── */}
          <BlogPostHeader post={post} />

          {/* ── 2. Content Body ────────────────────────────────────────────── */}
          <BlogPostContent post={post} />

          {/* ── 3. Post Navigation (Prev / Next) ───────────────────────────── */}
          <BlogPostNav prevPost={prevPost} nextPost={nextPost} />
        </article>
      </div>

      {/* ── 4. Subscribe CTA ──────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Enjoyed This Article?"
        subtitle="Subscribe to the Unlock Her Tech podcast to stay up to date with new drops."
      />
    </div>
  );
}
