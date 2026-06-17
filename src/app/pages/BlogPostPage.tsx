import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Base languages
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
// Extended languages
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCalendar, HiOutlineUser, HiOutlineTag, HiOutlineShare } from "react-icons/hi2";
import { FaLinkedinIn, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import type { BlogPost } from "../types";
import { useMetaData } from "../hooks/useMetaData";
import { getAllBlogPosts, getBlogPostBySlug } from "../utils/markdown";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<{ slug: string; title: string } | null>(null);
  const [nextPost, setNextPost] = useState<{ slug: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useMetaData(post?.title || "Blog Post", post?.content?.substring(0, 160), post?.canonicalUrl);

  const shareUrl = globalThis.window === undefined ? "" : globalThis.location.href;
  const shareTitle = post?.title || "";

  useEffect(() => {
    if (!loading && post) {
      const container = document.querySelector('.blog-content');
      if (container) {
        Prism.highlightAllUnder(container);
      }
    }
  }, [loading, post]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      if (!slug) return;
      
      try {
        const postData = await getBlogPostBySlug(slug);
        if (!postData) {
          setPost(null);
          return;
        }

        const postList = await getAllBlogPosts();
        const currentIndex = postList.findIndex((p) => p.slug === slug);
        
        setPost(postData);
        if (currentIndex !== -1) {
          setNextPost(currentIndex > 0 ? { slug: postList[currentIndex - 1].slug, title: postList[currentIndex - 1].title } : null);
          setPrevPost(currentIndex < postList.length - 1 ? { slug: postList[currentIndex + 1].slug, title: postList[currentIndex + 1].title } : null);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link to="/" className="text-brand-coral hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        {post.imageUrl && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl">
            <ImageWithFallback 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4" />
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineUser className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineTag className="w-4 h-4" />
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={`tag-${tag}`} className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
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
                target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-brand-blue hover:text-white transition-all"
                title="Share on LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-neutral-900 hover:text-white transition-all"
                title="Share on X"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white transition-all"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg prose-rose max-w-none mb-16 blog-content">
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>

      <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-12">
        {prevPost ? (
          <Link
            to={`/blog/${prevPost.slug}`}
            className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-brand-coral/30 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <HiOutlineArrowLeft className="w-4 h-4" />
              <span>Previous Post</span>
            </div>
            <div className="font-bold text-gray-900 group-hover:text-brand-coral transition-colors line-clamp-2">
              {prevPost.title}
            </div>
          </Link>
        ) : <div />}

        {nextPost && (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-brand-coral/30 hover:shadow-lg transition-all text-right"
          >
            <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
              <span>Next Post</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </div>
            <div className="font-bold text-gray-900 group-hover:text-brand-coral transition-colors line-clamp-2">
              {nextPost.title}
            </div>
          </Link>
        )}
      </nav>
    </article>
  );
}
