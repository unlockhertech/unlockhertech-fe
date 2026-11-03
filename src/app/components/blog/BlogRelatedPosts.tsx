import { useMemo } from "react";
import { Link } from "react-router";
import { HiOutlineArrowRight, HiOutlineClock } from "react-icons/hi2";
import type { BlogPost } from "../../types";
import { ImageWithFallback } from "../ImageWithFallback";

export interface BlogRelatedPostsProps {
  currentSlug: string;
  currentTags?: string[];
  posts: BlogPost[];
  className?: string;
}

export function BlogRelatedPosts({
  currentSlug,
  currentTags = [],
  posts = [],
  className = "",
}: Readonly<BlogRelatedPostsProps>) {
  const relatedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const otherPosts = posts.filter((p) => p.slug !== currentSlug);
    if (otherPosts.length === 0) return [];

    const tagSet = new Set(currentTags.map((t) => t.toLowerCase()));

    // Sort by number of shared tags, then by date descending
    const scored = otherPosts.map((post) => {
      const postTags = post.tags ?? [];
      const sharedCount = postTags.filter((t) =>
        tagSet.has(t.toLowerCase())
      ).length;
      return { post, score: sharedCount };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

    return scored.slice(0, 3).map((item) => item.post);
  }, [posts, currentSlug, currentTags]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      className={`my-16 pt-12 border-t border-gray-200/90 dark:border-gray-800 not-prose ${className}`}
      aria-label="Recommended reading articles"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-berry">
            Continue Reading
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mt-1">
            Recommended Reading
          </h2>
        </div>

        <Link
          to="/blog"
          className="text-xs sm:text-sm font-bold text-brand-coral hover:text-brand-berry inline-flex items-center gap-1 transition-colors"
        >
          <span>All articles</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const postTags = post.tags ?? [];
          return (
            <Link
              key={`related-${post.slug}`}
              to={`/blog/${post.slug}`}
              aria-label={`Read recommended post: ${post.title}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-brand-berry/40 hover:shadow-lg transition-all duration-300"
            >
              {post.imageUrl && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {postTags.slice(0, 1).map((tag) => (
                      <span
                        key={`rel-tag-${post.slug}-${tag}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-brand-berry bg-brand-berry/10 px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {post.readingTime && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                      <HiOutlineClock className="w-3 h-3" />
                      <span>{post.readingTime}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-berry transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                    {post.author}
                  </span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
