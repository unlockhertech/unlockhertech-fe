import {
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2";
import { type SortOrder, type ViewMode, TAG_FILTERS } from "./episodesTypes";

interface EpisodesToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export function EpisodesToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  activeTag,
  onTagChange,
}: EpisodesToolbarProps) {
  return (
    <div className="bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tag filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {TAG_FILTERS.map(({ label, value }) => (
            <button
              key={`filter-${label}`}
              type="button"
              onClick={() => onTagChange(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
                activeTag === value
                  ? "bg-brand-coral text-white border-brand-coral"
                  : "bg-white text-gray-700 border-black/10 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search + sort + view row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search episodes…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm outline-none transition-all border border-black/10 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <HiOutlineAdjustmentsHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="pl-9 pr-8 py-3 rounded-xl bg-white text-sm text-gray-700 outline-none appearance-none cursor-pointer border border-black/10 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden shrink-0 border border-black/10">
            {(["grid", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-all cursor-pointer ${
                  view === v
                    ? "bg-brand-coral text-white"
                    : "bg-white text-gray-500 hover:text-gray-700"
                }`}
              >
                {v === "grid" ? (
                  <HiOutlineSquares2X2 className="w-4 h-4" />
                ) : (
                  <HiOutlineListBullet className="w-4 h-4" />
                )}
                <span className="hidden sm:inline capitalize">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
