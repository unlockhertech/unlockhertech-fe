import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { BERRY, ORANGE, PINK, GREEN, BLUE, IMG_AUDIO_EQ } from "../data";
import { CATEGORIES, QUESTIONS } from "./assessment/assessmentData";
import { useAssessment } from "./assessment/useAssessment";
import { AssessmentHeader } from "./assessment/AssessmentHeader";
import { AssessmentHeroIntro } from "./assessment/AssessmentHeroIntro";
import { AssessmentProgressBar } from "./assessment/AssessmentProgressBar";
import { CategorySection } from "./assessment/CategorySection";
import { AssessmentFocusSteps } from "./assessment/AssessmentFocusSteps";
import { AssessmentResults } from "./assessment/AssessmentResults";
import { AssessmentStickyBar } from "./assessment/AssessmentStickyBar";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";
import { HiArrowDown, HiSparkles } from "react-icons/hi2";

export { ReadinessRadarChart } from "./assessment/ReadinessRadarChart";

const BRAND_DOT_COLORS = [BERRY, ORANGE, PINK, GREEN, BLUE];

const ASSESSMENT_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": "Tech Career Transition Self-Assessment",
  "description": "Interactive 16-question worksheet evaluating career readiness across Mindset, Transferable Skills, Technical Literacy, and Networking Strategy.",
  "provider": {
    "@type": "Organization",
    "name": "Unlock Her Tech",
    "url": "https://unlockhertech.com",
  },
  "isAccessibleForFree": true,
  "inLanguage": "en",
};

export function AssessmentPage() {
  useMetaData(
    "Career Readiness Self-Assessment | Unlock Her Tech",
    "Evaluate your mindset, transferable skills, tech literacy, and networking strategy in 5 minutes with our interactive career readiness worksheet.",
    "https://unlockhertech.com/assessment",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: ASSESSMENT_META_JSON_LD,
    }
  );

  const {
    stage,
    isIntroStage,
    isActiveStage,
    isResultsStage,
    isCompleted,
    hasSavedProgress,
    startAssessment,
    resumeAssessment,
    goToResults,
    goToIntro,
    answers,
    reflectionNotes,
    showStickyBar,
    viewMode,
    activeCategoryIndex,
    totalAnswered,
    progressPercent,
    scores,
    grandTotal,
    recommendation,
    readinessBadge,
    setViewMode,
    setActiveCategoryIndex,
    nextCategory,
    prevCategory,
    handleSelectScore,
    handleNotesChange,
    handleReset,
    triggerCelebrationConfetti,
  } = useAssessment();

  const handleStartWorksheet = () => {
    startAssessment("worksheet");
  };

  return (
    <div className="bg-stone-50 min-h-screen relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <AssessmentHeader totalAnswered={totalAnswered} onReset={handleReset} />

      {/* ── 2. Assessment Main Container ──────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Stage 1: Welcome & Value Proposition Hero */}
        {isIntroStage && (
          <AssessmentHeroIntro
            totalAnswered={totalAnswered}
            hasSavedProgress={hasSavedProgress}
            isCompleted={isCompleted}
            onStart={() => startAssessment("focus")}
            onResume={resumeAssessment}
            onViewResults={goToResults}
            onViewWorksheet={handleStartWorksheet}
          />
        )}

        {/* Stage 2: Active Step-by-Step or Full Worksheet Wizard */}
        {isActiveStage && (
          <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in duration-300">
            {/* Progress Tracker Bar & View Mode Toggle */}
            <AssessmentProgressBar
              progressPercent={progressPercent}
              totalAnswered={totalAnswered}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
            />

            {/* Focused Step-by-Step Category Flow */}
            {viewMode === "focus" ? (
              <AssessmentFocusSteps
                activeCategoryIndex={activeCategoryIndex}
                answers={answers}
                scores={scores}
                onSelectCategory={setActiveCategoryIndex}
                onSelectScore={handleSelectScore}
                onNextCategory={nextCategory}
                onPrevCategory={prevCategory}
                onScrollToResults={goToResults}
                onBackToIntro={goToIntro}
              />
            ) : (
              /* All-in-One Worksheet View */
              <div className="space-y-6">
                {CATEGORIES.map((cat, idx) => (
                  <CategorySection
                    key={cat.key}
                    number={cat.number}
                    title={cat.title}
                    description={cat.description}
                    badgeColor={cat.badgeColor}
                    questions={QUESTIONS.filter((q) => q.catKey === cat.key)}
                    answers={answers}
                    onSelectScore={handleSelectScore}
                    collapsible={true}
                    defaultOpen={idx === 0}
                  />
                ))}

                {/* Bottom Results Jump for Worksheet Mode */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                      Overall Progress
                    </span>
                    <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">
                      {totalAnswered} of 16 questions answered ({progressPercent}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={goToResults}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-98"
                  >
                    <HiSparkles className="w-4 h-4 text-brand-yellow" />
                    <span>View Your Results & Action Plan</span>
                    <HiArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stage 3: Results & Comprehensive Career Action Plan */}
        {isResultsStage && (
          <div className="motion-safe:animate-in motion-safe:fade-in duration-300">
            <AssessmentResults
              totalAnswered={totalAnswered}
              grandTotal={grandTotal}
              scores={scores}
              readinessBadge={readinessBadge}
              recommendation={recommendation}
              reflectionNotes={reflectionNotes}
              onNotesChange={handleNotesChange}
              onTriggerConfetti={triggerCelebrationConfetti}
              onEditResponses={() => startAssessment("focus")}
            />
          </div>
        )}

        {/* Printable Full Worksheet (Rendered for print when not already displaying screen worksheet) */}
        {(!isActiveStage || viewMode !== "worksheet") && (
          <div className="hidden print:block space-y-6">
            {CATEGORIES.map((cat, idx) => (
              <CategorySection
                key={cat.key}
                number={cat.number}
                title={cat.title}
                description={cat.description}
                badgeColor={cat.badgeColor}
                questions={QUESTIONS.filter((q) => q.catKey === cat.key)}
                answers={answers}
                onSelectScore={handleSelectScore}
                collapsible={false}
                defaultOpen={idx === 0}
              />
            ))}
          </div>
        )}

        {/* Signature Dots Footer Accent */}
        <div className="flex justify-center gap-2 mt-12 mb-16 print:hidden">
          {BRAND_DOT_COLORS.map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full opacity-60" style={{ backgroundColor: c }} />
          ))}
        </div>
      </main>

      {/* ── 4. Subscribe CTA ──────────────────────────────────────────── */}
      <div className="print:hidden">
        <SubscribeCTA bgImage={IMG_AUDIO_EQ} />
      </div>

      {/* ── 5. Sticky Floating Mini-Progress / Jump to Results Bar ───── */}
      {stage !== "intro" && (
        <AssessmentStickyBar
          show={showStickyBar}
          totalAnswered={totalAnswered}
          progressPercent={progressPercent}
          onScrollToResults={goToResults}
        />
      )}
    </div>
  );
}
