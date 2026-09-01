import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { BERRY, ORANGE, PINK, GREEN, BLUE, IMG_AUDIO_EQ } from "../data";
import { CATEGORIES, QUESTIONS } from "./assessment/assessmentData";
import { useAssessment } from "./assessment/useAssessment";
import { AssessmentHeader } from "./assessment/AssessmentHeader";
import { AssessmentProgressBar } from "./assessment/AssessmentProgressBar";
import { CategorySection } from "./assessment/CategorySection";
import { AssessmentFocusSteps } from "./assessment/AssessmentFocusSteps";
import { AssessmentResults } from "./assessment/AssessmentResults";
import { AssessmentStickyBar } from "./assessment/AssessmentStickyBar";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

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
    handleSelectScore,
    handleNotesChange,
    handleReset,
    scrollToResults,
    triggerCelebrationConfetti,
  } = useAssessment();

  return (
    <div className="bg-stone-50 min-h-screen relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <AssessmentHeader totalAnswered={totalAnswered} onReset={handleReset} />

      {/* ── 2. Assessment Main Container ──────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Progress Tracker Bar & View Mode Toggle */}
        <AssessmentProgressBar
          progressPercent={progressPercent}
          totalAnswered={totalAnswered}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Categories Questionnaire */}
        {viewMode === "focus" ? (
          <AssessmentFocusSteps
            activeCategoryIndex={activeCategoryIndex}
            answers={answers}
            scores={scores}
            onSelectCategory={setActiveCategoryIndex}
            onSelectScore={handleSelectScore}
            onScrollToResults={scrollToResults}
          />
        ) : null}

        {/* Full Worksheet View (always rendered for print or when viewMode === 'worksheet') */}
        <div className={`space-y-10 ${viewMode === "focus" ? "hidden print:block" : "block"}`}>
          {CATEGORIES.map((cat) => (
            <CategorySection
              key={cat.key}
              number={cat.number}
              title={cat.title}
              description={cat.description}
              badgeColor={cat.badgeColor}
              questions={QUESTIONS.filter((q) => q.catKey === cat.key)}
              answers={answers}
              onSelectScore={handleSelectScore}
            />
          ))}
        </div>

        {/* ── 3. Results & Dashboard Section ───────────────────────────── */}
        <AssessmentResults
          totalAnswered={totalAnswered}
          grandTotal={grandTotal}
          scores={scores}
          readinessBadge={readinessBadge}
          recommendation={recommendation}
          reflectionNotes={reflectionNotes}
          onNotesChange={handleNotesChange}
          onTriggerConfetti={triggerCelebrationConfetti}
        />

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
      <AssessmentStickyBar
        show={showStickyBar}
        totalAnswered={totalAnswered}
        progressPercent={progressPercent}
        onScrollToResults={scrollToResults}
      />
    </div>
  );
}
