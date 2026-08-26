import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi2";
import { BlogCard } from "../../components/BlogCard";
import type { BlogPost } from "../../types";

interface HomeFeaturedPostsProps {
  posts: BlogPost[];
}

export function HomeFeaturedPosts({ posts }: HomeFeaturedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs mb-2 uppercase tracking-widest text-brand-coral font-bold">Featured Writing</p>
            <h2 className="text-3xl font-black text-gray-900">Latest Insights</h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-brand-coral hover:underline"
          >
            Read all articles <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
