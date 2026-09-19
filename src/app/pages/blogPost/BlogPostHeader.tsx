import { Link } from "react-router";
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineShare,
} from "react-icons/hi2";
import { FaLinkedinIn, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import type { BlogPost } from "../../types";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: Readonly<BlogPostHeaderProps>) {
  const shareUrl = globalThis.window === undefined ? "" : globalThis.location.href;
  const shareTitle = post.title || "";
  const postTags = post.tags ?? [];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 uppercase tracking-wider">
        <Link to="/" className="hover:text-brand-coral transition-colors">Home</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-brand-coral transition-colors">Blogs</Link>
        <span>/</span>
        <span className="text-brand-coral truncate max-w-xs sm:max-w-md">{post.title}</span>
      </div>

      <header className="mb-12">
        {post.imageUrl && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl border border-gray-200">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-200/80 py-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-brand-coral" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineUser className="w-4 h-4 text-brand-blue" />
              <span className="font-semibold">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineTag className="w-4 h-4 text-brand-green" />
              <div className="flex gap-2">
                {postTags.map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="bg-stone-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <span className="text-gray-300">•</span>
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <HiOutlineShare className="w-3.5 h-3.5" /> Share
            </span>
            <div className="flex gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share this post on LinkedIn"
                className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-blue hover:text-white transition-all"
                title="Share on LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share this post on X"
                className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-neutral-900 hover:text-white transition-all"
                title="Share on X"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share this post on WhatsApp"
                className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white transition-all"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
