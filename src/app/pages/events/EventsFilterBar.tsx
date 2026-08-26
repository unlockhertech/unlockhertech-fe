import type { EventCategory } from "./eventsUtils";

interface EventsFilterBarProps {
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  totalTimelineCount: number;
  countPractical: number;
  countCommunity: number;
  pastCount: number;
  showPast: boolean;
  onToggleShowPast: () => void;
}

export function EventsFilterBar({
  selectedCategory,
  onSelectCategory,
  totalTimelineCount,
  countPractical,
  countCommunity,
  pastCount,
  showPast,
  onToggleShowPast,
}: EventsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-xs">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-brand-coral text-white shadow-xs"
              : "bg-stone-100 text-gray-700 hover:bg-stone-200"
          }`}
        >
          All Events ({totalTimelineCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("practical")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === "practical"
              ? "bg-brand-coral text-white shadow-xs"
              : "bg-stone-100 text-gray-700 hover:bg-stone-200"
          }`}
        >
          <span>💻 Practical & Coding</span>
          <span className="px-1.5 py-0.2 rounded-full text-[0.65rem] bg-white/30">{countPractical}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("community")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === "community"
              ? "bg-brand-coral text-white shadow-xs"
              : "bg-stone-100 text-gray-700 hover:bg-stone-200"
          }`}
        >
          <span>🎙️ Talks, Panels & Socials</span>
          <span className="px-1.5 py-0.2 rounded-full text-[0.65rem] bg-white/30">{countCommunity}</span>
        </button>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
        {pastCount > 0 && (
          <button
            type="button"
            onClick={onToggleShowPast}
            className="text-xs font-bold text-brand-coral hover:underline cursor-pointer"
          >
            {showPast ? "Show Upcoming Only" : `View Past Events (${pastCount})`}
          </button>
        )}
      </div>
    </div>
  );
}
