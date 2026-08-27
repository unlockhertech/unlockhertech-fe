import { BlogCard } from "../../components/BlogCard";
import type { BlogPost } from "../../types";

interface BlogGridProps {
  posts: BlogPost[];
  onResetFilters: () => void;
}

export function BlogGrid({ posts, onResetFilters }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 shadow-xs">
        <div className="text-4xl mb-3">📖</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
          We couldn&apos;t find any posts matching your criteria. Try clearing your search or selecting a different tag.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded-full bg-brand-coral text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <section>
      <h2 className="sr-only">Published Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
