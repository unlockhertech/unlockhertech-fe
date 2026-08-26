import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import { useBlogIndex } from "./blog/useBlogIndex";
import { BlogHeroHeader } from "./blog/BlogHeroHeader";
import { BlogToolbar } from "./blog/BlogToolbar";
import { BlogGrid } from "./blog/BlogGrid";

const BLOG_INDEX_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Unlock Her Tech Blog",
  "description": "Insights and stories from the women and non-binary professionals shaping the future of tech.",
  "url": "https://unlockhertech.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Unlock Her Tech",
    "url": "https://unlockhertech.com",
    "logo": "https://unlockhertech.com/logo.png",
  },
};

export function BlogIndexPage() {
  const {
    posts,
    allTags,
    searchQuery,
    setSearchQuery,
    loading,
    activeTag,
    filteredPosts,
    handleSelectTag,
    handleResetFilters,
  } = useBlogIndex();

  useMetaData(
    "Blog & Engineering Stories | Unlock Her Tech",
    "Insights, career advice, and deep dives from women, non-binary professionals, and allies across the technology industry.",
    "https://unlockhertech.com/blog",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: BLOG_INDEX_META_JSON_LD,
    }
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <BlogHeroHeader totalArticles={posts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── 2. Filter & Search Toolbar ───────────────────────────────────── */}
        <BlogToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTag={activeTag}
          allTags={allTags}
          totalPostsCount={posts.length}
          onSelectTag={handleSelectTag}
          onResetFilters={handleResetFilters}
        />

        {/* ── 3. Posts Count ───────────────────────────────────────────────── */}
        <p className="text-gray-500 text-xs sm:text-sm mb-6">
          Showing <span className="text-brand-coral font-bold">{filteredPosts.length}</span> of{" "}
          <span className="font-bold">{posts.length}</span> articles
          {activeTag && <span> tagged with &ldquo;<strong>{activeTag}</strong>&rdquo;</span>}
          {searchQuery && <span> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
        </p>

        {/* ── 4. Posts Grid ────────────────────────────────────────────────── */}
        <BlogGrid posts={filteredPosts} onResetFilters={handleResetFilters} />
      </main>

      {/* ── 5. Subscribe CTA ──────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Stay Informed With Our Latest Writing"
        subtitle="Subscribe to hear our newest episodes and get thoughtful reflections from women in tech delivered to you."
      />
    </div>
  );
}
