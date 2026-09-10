import { useRef } from "react";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiArrowDown } from "react-icons/hi2";
import {
  CATEGORIES,
  QUESTIONS,
  MAX_CATEGORY_SCORE,
  type AssessmentScores,
} from "./assessmentData";
import { CategorySection } from "./CategorySection";

interface AssessmentFocusStepsProps {
  activeCategoryIndex: number;
  answers: Record<string, number>;
  scores: AssessmentScores;
  onSelectCategory: (index: number) => void;
  onSelectScore: (questionId: string, value: number) => void;
  onScrollToResults: () => void;
}

export function AssessmentFocusSteps({
  activeCategoryIndex,
  answers,
  scores,
  onSelectCategory,
  onSelectScore,
  onScrollToResults,
}: Readonly<AssessmentFocusStepsProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCat = CATEGORIES[activeCategoryIndex] ?? CATEGORIES[0];
  const currentCatQuestions = QUESTIONS.filter((q) => q.catKey === currentCat.key);
  const answeredCount = currentCatQuestions.filter((q) => answers[q.id]).length;
  const catScore = scores[currentCat.key] || 0;

  const handleCategorySwitch = (index: number) => {
    onSelectCategory(index);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 print:hidden scroll-mt-24">
      {/* Step Navigation Pill Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CATEGORIES.map((cat, idx) => {
          const catQuestions = QUESTIONS.filter((q) => q.catKey === cat.key);
          const catAnsweredCount = catQuestions.filter((q) => answers[q.id]).length;
          const isCatComplete = catAnsweredCount === catQuestions.length;
          const isActive = activeCategoryIndex === idx;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategorySwitch(idx)}
              aria-label={`Step ${cat.number}: ${cat.shortTitle}`}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "border-brand-coral bg-pink-50/60 ring-2 ring-brand-coral/20 shadow-xs"
                  : "border-stone-200/80 bg-white hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-stone-500">
                  Step {cat.number}
                </span>
                {isCatComplete ? (
                  <HiCheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="text-[0.65rem] font-bold text-stone-400">
                    {catAnsweredCount}/{catQuestions.length}
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold mt-1.5 truncate ${isActive ? "text-brand-coral" : "text-stone-800"}`}>
                {cat.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Category Card */}
      <div className="space-y-6 animate-in fade-in duration-300">
        <CategorySection
          number={currentCat.number}
          title={currentCat.title}
          description={currentCat.description}
          badgeColor={currentCat.badgeColor}
          questions={currentCatQuestions}
          answers={answers}
          onSelectScore={onSelectScore}
        />

        {/* Step Summary & Navigation Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Category {currentCat.number} Summary
            </div>
            <div className="text-sm font-extrabold text-stone-900 mt-0.5">
              {answeredCount} of {currentCatQuestions.length} answered • Score:{" "}
              <span className="text-brand-coral">{catScore} / {MAX_CATEGORY_SCORE}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeCategoryIndex > 0 && (
              <button
                type="button"
                onClick={() => handleCategorySwitch(activeCategoryIndex - 1)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <HiArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            {activeCategoryIndex < CATEGORIES.length - 1 ? (
              <button
                type="button"
                onClick={() => handleCategorySwitch(activeCategoryIndex + 1)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
              >
                <span>Next: Step {activeCategoryIndex + 2}</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onScrollToResults}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-linear-to-r from-brand-coral to-brand-yellow hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                <span>View Full Results</span>
                <HiArrowDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
