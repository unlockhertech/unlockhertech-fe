import { HiOutlineTag, HiXMark, HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface BlogToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTag: string | null;
  allTags: string[];
  totalPostsCount: number;
  onSelectTag: (tag?: string) => void;
  onResetFilters: () => void;
}

export function BlogToolbar({
  searchQuery,
  onSearchChange,
  activeTag,
  allTags,
  totalPostsCount,
  onSelectTag,
  onResetFilters,
}: Readonly<BlogToolbarProps>) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs mb-10 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="blog-search-input" className="sr-only">
            Search articles
          </label>
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="blog-search-input"
            type="text"
            placeholder="Search articles by title, topic, or author…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 text-gray-800 text-sm outline-hidden transition-all border border-gray-200 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral"
          />
        </div>

        {/* Clear filters button if active */}
        {(activeTag || searchQuery) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-brand-coral hover:underline shrink-0 cursor-pointer"
          >
            Reset search & filters
          </button>
        )}
      </div>

      {/* Tag Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-500 mr-2 text-xs font-bold uppercase tracking-wider">
          <HiOutlineTag className="w-3.5 h-3.5" />
          <span>Tags:</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectTag(undefined)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            !activeTag
              ? "bg-brand-coral text-white shadow-xs"
              : "bg-stone-100 text-gray-700 hover:bg-stone-200"
          }`}
        >
          All Topics ({totalPostsCount})
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTag === tag
                ? "bg-brand-coral text-white shadow-xs"
                : "bg-stone-100 text-gray-700 hover:bg-stone-200"
            }`}
          >
            <span>{tag}</span>
            {activeTag === tag && <HiXMark className="w-3 h-3" />}
          </button>
        ))}
      </div>
    </div>
  );
}
