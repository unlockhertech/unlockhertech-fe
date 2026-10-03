import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { RESOURCE_CATEGORIES, RESOURCE_FORMATS } from "./resourceData";

interface ResourceCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFormat?: string;
  onSelectFormat?: (format: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function ResourceCategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedFormat = "all",
  onSelectFormat,
  searchQuery = "",
  onSearchChange,
}: Readonly<ResourceCategoryFilterProps>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
      {/* Search Bar & Format Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white rounded-2xl shadow-xs p-3 border border-stone-200/80">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 min-w-[240px]">
            <label htmlFor="resource-search-input" className="sr-only">
              Search guides, playbooks, and templates
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <HiMagnifyingGlass className="w-4 h-4" />
            </div>
            <input
              id="resource-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by keyword, topic, or role..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-coral focus:bg-white text-stone-900 transition-all placeholder:text-stone-400"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Format Pills */}
        {onSelectFormat && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {RESOURCE_FORMATS.map((fmt) => {
              const isFmtActive = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onSelectFormat(fmt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isFmtActive
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                  }`}
                >
                  {fmt.shortLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="bg-white rounded-2xl shadow-xs p-2.5 border border-stone-200/80 flex items-center justify-start gap-1.5 overflow-x-auto scrollbar-none">
        {RESOURCE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-coral text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
