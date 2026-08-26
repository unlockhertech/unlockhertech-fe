import { HiOutlineRss, HiOutlineExclamationCircle } from "react-icons/hi2";

interface EpisodesStatusFeedbackProps {
  isLive: boolean;
  error: string | null;
  loading: boolean;
  visibleCount: number;
  totalFiltered: number;
  searchQuery: string;
}

export function EpisodesStatusFeedback({
  isLive,
  error,
  loading,
  visibleCount,
  totalFiltered,
  searchQuery,
}: EpisodesStatusFeedbackProps) {
  return (
    <>
      {/* Live / fallback status badge */}
      {isLive && (
        <div className="flex items-center gap-2 mb-4 text-xs text-brand-green">
          <HiOutlineRss className="w-3.5 h-3.5" />
          <span className="font-semibold">Live from RSS feed</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 mb-4 text-xs text-amber-600">
          <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
          <span>Using cached data — RSS fetch failed: {error}</span>
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
          <span>Loading from RSS feed…</span>
        </div>
      )}

      {/* Count */}
      <p className="text-gray-400 text-sm mb-6">
        Showing{" "}
        <span className="text-brand-coral font-semibold">{Math.min(visibleCount, totalFiltered)}</span>
        {" "}of{" "}
        <span className="font-semibold">{totalFiltered}</span>
        {" "}episode{totalFiltered === 1 ? "" : "s"}
        {searchQuery && <span> matching &ldquo;<em>{searchQuery}</em>&rdquo;</span>}
      </p>
    </>
  );
}
