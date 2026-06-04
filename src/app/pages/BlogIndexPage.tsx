import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { HiOutlineTag, HiXMark } from "react-icons/hi2";
import type { BlogPost } from "../types";
import { useMetaData } from "../hooks/useMetaData";
import { BlogCard } from "../components/BlogCard";
import { getAllBlogPosts } from "../utils/markdown";

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTag = searchParams.get("tag");

  useMetaData("Blog", "Insights and stories from the women shaping the future of tech.");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const postList = await getAllBlogPosts();
        const tagsSet = new Set(postList.flatMap(post => post.tags ?? []));

        setPosts(postList);
        setAllTags(Array.from(tagsSet).sort());
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags?.includes(activeTag))
    : posts;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <header className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Insights & <span className="text-brand-coral">Stories</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exploring the intersection of technology, inclusion, and the women shaping our future.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* Tag Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-2 text-gray-500 mr-2">
            <HiOutlineTag className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Filter by Tag:</span>
          </div>
          
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !activeTag 
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Posts
          </button>

          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchParams({ tag })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTag === tag
                  ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tag}
              {activeTag === tag && <HiXMark className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try selecting a different tag or viewing all posts.</p>
          </div>
        )}
      </main>
    </div>
  );
}
