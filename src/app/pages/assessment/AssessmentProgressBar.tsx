import { HiQueueList, HiViewColumns } from "react-icons/hi2";
import { TOTAL_QUESTIONS_COUNT } from "./assessmentData";

interface AssessmentProgressBarProps {
  progressPercent: number;
  totalAnswered: number;
  viewMode: "worksheet" | "focus";
  onToggleViewMode: (mode: "worksheet" | "focus") => void;
}

export function AssessmentProgressBar({
  progressPercent,
  totalAnswered,
  viewMode,
  onToggleViewMode,
}: AssessmentProgressBarProps) {
  return (
    <div className="mb-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs print:hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider block">
            Assessment Completion Progress
          </span>
          <span className="text-sm font-extrabold text-brand-coral mt-0.5 block">
            {progressPercent}% Completed ({totalAnswered}/{TOTAL_QUESTIONS_COUNT} questions)
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onToggleViewMode("worksheet")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "worksheet"
                ? "bg-white text-stone-900 shadow-xs ring-1 ring-stone-200/60"
                : "text-stone-500 hover:text-stone-800"
            }`}
            aria-pressed={viewMode === "worksheet"}
          >
            <HiQueueList className="w-4 h-4 text-brand-coral" />
            <span>Worksheet View</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode("focus")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "focus"
                ? "bg-white text-stone-900 shadow-xs ring-1 ring-stone-200/60"
                : "text-stone-500 hover:text-stone-800"
            }`}
            aria-pressed={viewMode === "focus"}
          >
            <HiViewColumns className="w-4 h-4 text-brand-yellow" />
            <span>Focus Mode (Step-by-Step)</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-stone-200/60">
        <div
          className="bg-linear-to-r from-brand-coral via-brand-yellow to-brand-blue h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
