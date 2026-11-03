import { Link } from "react-router";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi2";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { BlogShareBar } from "../../components/blog/BlogShareBar";
import type { BlogPost } from "../../types";

interface BlogPostHeaderProps {
  post: BlogPost;
}

const TAG_COLOR_CLASSES = [
  "bg-brand-berry/10 text-brand-berry border-brand-berry/20",
  "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  "bg-brand-coral/10 text-brand-coral border-brand-coral/20",
  "bg-brand-green/10 text-brand-green border-brand-green/20",
  "bg-brand-yellow/15 text-amber-700 dark:text-amber-300 border-amber-400/30",
];

function getTagBadgeClass(index: number): string {
  const safeIndex = Math.abs(index) % TAG_COLOR_CLASSES.length;
  return TAG_COLOR_CLASSES[safeIndex] ?? TAG_COLOR_CLASSES[0] ?? "";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return (parts[0]?.[0] ?? "U").toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function BlogPostHeader({ post }: Readonly<BlogPostHeaderProps>) {
  const shareUrl =
    globalThis.window === undefined ? "" : globalThis.location.href;
  const shareTitle = post.title || "";
  const postTags = post.tags ?? [];

  return (
    <header className="mb-10 sm:mb-14 not-prose">
      {/* Breadcrumb Navigation */}
      <nav
        className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-brand-berry transition-colors">
          Home
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <Link to="/blog" className="hover:text-brand-berry transition-colors">
          Blogs
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-brand-berry truncate max-w-xs sm:max-w-md font-semibold">
          {post.title}
        </span>
      </nav>

      {/* Category / Tags Badges */}
      {postTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {postTags.map((tag, idx) => (
            <span
              key={`header-tag-${tag}`}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${getTagBadgeClass(idx)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-[1.15] mb-8">
        {post.title}
      </h1>

      {/* Author & Metadata Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-y border-gray-200/90 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-berry/20"
                loading="lazy"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-brand-berry to-brand-coral text-white font-bold text-base shadow-xs">
                {getInitials(post.author)}
              </div>
            )}
          </div>

          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {post.author}
            </div>
            {post.authorRole && (
              <p className="text-xs font-semibold text-brand-blue mb-0.5">
                {post.authorRole}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <HiOutlineCalendar className="w-3.5 h-3.5 text-brand-coral" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {post.readingTime && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center gap-1 font-medium">
                    <HiOutlineClock className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{post.readingTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Social Share Bar */}
        <BlogShareBar url={shareUrl} title={shareTitle} />
      </div>

      {/* Hero Featured Image */}
      {post.imageUrl && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-800">
          <ImageWithFallback
            src={post.imageUrl}
            alt={post.title}
            className="w-full aspect-video md:aspect-[21/9] object-cover"
          />
        </div>
      )}
    </header>
  );
}
