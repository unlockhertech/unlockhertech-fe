import { HiXMark, HiTrash } from "react-icons/hi2";
import type { ActiveFilterChip } from "./useResources";

interface ResourceActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  totalCount: number;
  onRemoveChip: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
  searchQuery?: string;
}

export function ResourceActiveFilterChips({
  chips,
  totalCount,
  onRemoveChip,
  onClearAll,
  searchQuery,
}: Readonly<ResourceActiveFilterChipsProps>) {
  if (chips.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-xs sm:text-sm font-medium text-stone-500 py-1"
      >
        Showing {totalCount} {totalCount === 1 ? "resource" : "resources"}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-t border-stone-200/60">
      <div className="flex flex-wrap items-center gap-2">
        <span
          role="status"
          aria-live="polite"
          className="text-xs sm:text-sm font-bold text-gray-900 mr-1"
        >
          {totalCount} {totalCount === 1 ? "result" : "results"}
          {searchQuery && searchQuery.trim().length > 0 ? ` matching "${searchQuery.trim()}"` : ""}
        </span>

        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-coral/10 text-brand-coral border border-brand-coral/20 animate-fade-in"
          >
            <span>{chip.label}</span>
            <button
              type="button"
              onClick={() => onRemoveChip(chip)}
              className="p-0.5 rounded-full hover:bg-brand-coral/20 text-brand-coral transition-colors cursor-pointer"
              aria-label={`Remove filter ${chip.label}`}
            >
              <HiXMark className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-coral hover:text-brand-coral/80 hover:underline transition-colors cursor-pointer py-1"
      >
        <HiTrash className="w-3.5 h-3.5" />
        <span>Clear all filters</span>
      </button>
    </div>
  );
}
