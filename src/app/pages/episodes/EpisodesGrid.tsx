import { HiMicrophone } from "react-icons/hi2";
import { EpisodeCard } from "../../components/EpisodeCard";
import { EpisodeListItem } from "../../components/EpisodeListItem";
import type { Episode } from "../../types";
import { type ViewMode, PAGE_SIZE } from "./episodesTypes";

interface EpisodesGridProps {
  episodes: Episode[];
  filteredCount: number;
  visibleCount: number;
  view: ViewMode;
  onClearFilters: () => void;
  onLoadMore: () => void;
  onShowLess: () => void;
}

export function EpisodesGrid({
  episodes,
  filteredCount,
  visibleCount,
  view,
  onClearFilters,
  onLoadMore,
  onShowLess,
}: Readonly<EpisodesGridProps>) {
  if (filteredCount === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-pink-50 text-brand-coral flex items-center justify-center mx-auto mb-4">
          <HiMicrophone className="w-8 h-8" />
        </div>
        <p className="text-gray-500 text-lg mb-2">No episodes found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 px-6 py-2.5 rounded-full text-sm text-white transition-all hover:opacity-90 bg-brand-coral font-semibold cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Grid view */}
      {view === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="flex flex-col gap-3">
          {episodes.map((ep) => (
            <EpisodeListItem key={ep.id} episode={ep} />
          ))}
        </div>
      )}

      {/* Load more / Show less */}
      {filteredCount > PAGE_SIZE && (
        <div className="flex justify-center gap-3 mt-12">
          {visibleCount < filteredCount && (
            <button
              type="button"
              onClick={onLoadMore}
              className="px-8 py-3 rounded-full text-white transition-all hover:opacity-90 bg-brand-coral font-semibold shadow-md cursor-pointer"
            >
              Load more episodes
            </button>
          )}
          {visibleCount > PAGE_SIZE && (
            <button
              type="button"
              onClick={onShowLess}
              className="px-8 py-3 rounded-full transition-all hover:bg-pink-50 text-brand-coral border-2 border-brand-coral bg-white font-semibold cursor-pointer"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </>
  );
}
