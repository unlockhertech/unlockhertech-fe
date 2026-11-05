import { useRef } from "react";
import {
  HiCheckCircle,
  HiArrowLeft,
  HiArrowRight,
  HiArrowDown,
  HiSparkles,
  HiHome,
} from "react-icons/hi2";
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
  onNextCategory?: () => void;
  onPrevCategory?: () => void;
  onScrollToResults: () => void;
  onBackToIntro?: () => void;
}

export function AssessmentFocusSteps({
  activeCategoryIndex,
  answers,
  scores,
  onSelectCategory,
  onSelectScore,
  onNextCategory,
  onPrevCategory,
  onScrollToResults,
  onBackToIntro,
}: Readonly<AssessmentFocusStepsProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCat = CATEGORIES[activeCategoryIndex] ?? CATEGORIES[0];
  const currentCatQuestions = QUESTIONS.filter((q) => q.catKey === currentCat.key);
  const answeredCount = currentCatQuestions.filter((q) => answers[q.id]).length;
  const isCategoryComplete = answeredCount === currentCatQuestions.length;
  const catScore = scores[currentCat.key] || 0;

  const handleCategorySwitch = (index: number) => {
    onSelectCategory(index);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrev = () => {
    if (activeCategoryIndex > 0) {
      if (onPrevCategory) {
        onPrevCategory();
      } else {
        handleCategorySwitch(activeCategoryIndex - 1);
      }
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (onBackToIntro) {
      onBackToIntro();
    }
  };

  const handleNext = () => {
    if (activeCategoryIndex < CATEGORIES.length - 1) {
      if (onNextCategory) {
        onNextCategory();
      } else {
        handleCategorySwitch(activeCategoryIndex + 1);
      }
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      onScrollToResults();
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 print:hidden scroll-mt-24">
      {/* ── 1. Step Navigation Pill Indicator ──────────────────────────── */}
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
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${cat.number}: ${cat.shortTitle}${isCatComplete ? " (completed)" : ` (${catAnsweredCount} of ${catQuestions.length} answered)`}`}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "border-brand-coral bg-pink-50/70 ring-2 ring-brand-coral/25 shadow-xs"
                  : isCatComplete
                  ? "border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/50"
                  : "border-stone-200/80 bg-white hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[0.7rem] font-black uppercase tracking-wider text-stone-500">
                  Step {cat.number} of 4
                </span>
                {isCatComplete ? (
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                    <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span className="text-[0.65rem] font-bold text-stone-400">
                    {catAnsweredCount}/{catQuestions.length}
                  </span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-extrabold truncate ${
                  isActive ? "text-brand-coral" : "text-stone-800"
                }`}
              >
                {cat.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 2. Active Step Category Questionnaire Card ────────────────── */}
      <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in duration-300">
        <CategorySection
          number={currentCat.number}
          title={currentCat.title}
          description={currentCat.description}
          badgeColor={currentCat.badgeColor}
          questions={currentCatQuestions}
          answers={answers}
          onSelectScore={onSelectScore}
        />

        {/* ── 3. Step Summary & Forward/Back Navigation Controls ─────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Category {currentCat.number} Summary
              </span>
              {isCategoryComplete && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Category Complete</span>
                </span>
              )}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 mt-1">
              {answeredCount} of {currentCatQuestions.length} answered • Score:{" "}
              <span className="text-brand-coral">{catScore} / {MAX_CATEGORY_SCORE}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeCategoryIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold transition-all cursor-pointer motion-safe:active:scale-98"
              >
                <HiArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : onBackToIntro ? (
              <button
                type="button"
                onClick={onBackToIntro}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs sm:text-sm font-bold transition-all cursor-pointer motion-safe:active:scale-98"
              >
                <HiHome className="w-4 h-4 text-stone-500" />
                <span>Overview</span>
              </button>
            ) : null}

            {activeCategoryIndex < CATEGORIES.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-98"
              >
                <span>Next: Step {activeCategoryIndex + 2}</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onScrollToResults}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-98"
              >
                <HiSparkles className="w-4 h-4 text-brand-yellow" />
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
