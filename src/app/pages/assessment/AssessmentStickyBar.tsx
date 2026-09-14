import { HiSparkles, HiArrowDown } from "react-icons/hi2";
import { TOTAL_QUESTIONS_COUNT } from "./assessmentData";

interface AssessmentStickyBarProps {
  show: boolean;
  totalAnswered: number;
  progressPercent: number;
  onScrollToResults: () => void;
}

export function AssessmentStickyBar({
  show,
  totalAnswered,
  progressPercent,
  onScrollToResults,
}: Readonly<AssessmentStickyBarProps>) {
  if (!show) return null;

  const isComplete = totalAnswered === TOTAL_QUESTIONS_COUNT;

  return (
    <aside
      aria-label="Assessment progress and quick jump"
      data-testid="sticky-progress-bar"
      className="fixed bottom-5 inset-x-0 mx-auto max-w-lg z-40 px-4 pointer-events-none print:hidden transition-all duration-300 transform translate-y-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3"
    >
      <div className="pointer-events-auto bg-stone-900/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-white/15 flex items-center justify-between gap-4">
        {isComplete ? (
          <button
            type="button"
            onClick={onScrollToResults}
            className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-brand-coral via-pink-600 to-brand-coral hover:opacity-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-coral/30 cursor-pointer transition-transform motion-safe:active:scale-98"
          >
            <HiSparkles className="w-5 h-5 text-brand-yellow shrink-0 motion-safe:animate-pulse" />
            <span>16/16 Completed — View Your Results</span>
            <HiArrowDown className="w-4 h-4 shrink-0" />
          </button>
        ) : (
          <>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-stone-200 truncate">
                  {totalAnswered}/{TOTAL_QUESTIONS_COUNT} Answered
                </span>
                <span className="text-brand-yellow font-extrabold ml-2 shrink-0">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-brand-coral via-brand-yellow to-brand-blue h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onScrollToResults}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer border border-white/10 motion-safe:active:scale-95"
            >
              <span>Results</span>
              <HiArrowDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
