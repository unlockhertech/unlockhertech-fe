import { Link } from "react-router";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";
import type { AdjacentPost } from "./useBlogPost";

interface BlogPostNavProps {
  prevPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
}

export function BlogPostNav({ prevPost, nextPost }: BlogPostNavProps) {
  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-12" aria-label="Blog post navigation">
      {prevPost ? (
        <Link
          to={`/blog/${prevPost.slug}`}
          aria-label={`Read previous post: ${prevPost.title}`}
          className="group p-6 rounded-3xl bg-white border border-gray-200 hover:border-brand-coral/40 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-2 text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
            <HiOutlineArrowLeft className="w-4 h-4 text-brand-coral" />
            <span>Previous Article</span>
          </div>
          <div className="font-extrabold text-gray-900 group-hover:text-brand-coral transition-colors line-clamp-2">
            {prevPost.title}
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextPost && (
        <Link
          to={`/blog/${nextPost.slug}`}
          aria-label={`Read next post: ${nextPost.title}`}
          className="group p-6 rounded-3xl bg-white border border-gray-200 hover:border-brand-coral/40 hover:shadow-md transition-all text-right"
        >
          <div className="flex items-center justify-end gap-2 text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">
            <span>Next Article</span>
            <HiOutlineArrowRight className="w-4 h-4 text-brand-coral" />
          </div>
          <div className="font-extrabold text-gray-900 group-hover:text-brand-coral transition-colors line-clamp-2">
            {nextPost.title}
          </div>
        </Link>
      )}
    </nav>
  );
}
