import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  HiTrophy,
  HiSparkles,
  HiOutlineLightBulb,
  HiArrowRight,
  HiArrowDownTray,
  HiPrinter,
  HiArrowPath,
} from "react-icons/hi2";
import {
  TOTAL_QUESTIONS_COUNT,
  MAX_TOTAL_SCORE,
  type AssessmentScores,
  type CategoryRecommendation,
} from "./assessmentData";
import { ReadinessRadarChart } from "./ReadinessRadarChart";
import { ScoreBarCard } from "./ScoreBarCard";
import type { ReadinessBadgeInfo } from "./useAssessment";
import { generateCareerPlanPdf } from "./generateCareerPlanPdf";
import { EmailResultsCard } from "./EmailResultsCard";
import { AutoMatchedResourcesSection } from "./AutoMatchedResourcesSection";
import { getAutoMatchedResources } from "./matchedResources";
import { trackEvent } from "../../utils/analytics";

interface AssessmentResultsProps {
  totalAnswered: number;
  grandTotal: number;
  scores: AssessmentScores;
  readinessBadge: ReadinessBadgeInfo;
  recommendation: CategoryRecommendation;
  reflectionNotes: string;
  onNotesChange: (notes: string) => void;
  onTriggerConfetti: () => void;
}

export function AssessmentResults({
  totalAnswered,
  grandTotal,
  scores,
  readinessBadge,
  recommendation,
  reflectionNotes,
  onNotesChange,
  onTriggerConfetti,
}: AssessmentResultsProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const isComplete = totalAnswered === TOTAL_QUESTIONS_COUNT;

  const matchedResources = useMemo(
    () => getAutoMatchedResources(scores, totalAnswered),
    [scores, totalAnswered]
  );

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCareerPlanPdf({
        scores,
        grandTotal,
        totalAnswered,
        readinessBadge,
        recommendation,
        reflectionNotes,
      });
      trackEvent("download_career_plan_pdf", "Assessment", readinessBadge.text, grandTotal);
    } catch (err) {
      console.error("Error generating Career Plan PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="results-section" className="mt-14 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl scroll-mt-6">
      {isComplete && (
        <div
          data-testid="completion-milestone-banner"
          className="mb-8 p-6 sm:p-7 rounded-3xl bg-linear-to-r from-pink-50/80 via-amber-50/70 to-emerald-50/80 border-2 border-brand-coral/25 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-coral to-brand-yellow flex items-center justify-center text-white shadow-md shrink-0">
              <HiTrophy className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral font-extrabold text-xs uppercase tracking-wider mb-1">
                <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Milestone Achieved</span>
              </div>
              <h3 className="text-xl font-black text-stone-900">
                100% Assessment Completed! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                You've answered all 16 readiness factors across your tech transition journey.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              aria-label="Download My Career Plan (PDF)"
            >
              {isGeneratingPdf ? (
                <>
                  <HiArrowPath className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <HiArrowDownTray className="w-4 h-4 text-brand-yellow" />
                  <span>Download Career Plan (PDF)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onTriggerConfetti}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 font-extrabold text-xs sm:text-sm border border-stone-200 shadow-xs transition-all hover:scale-105 cursor-pointer"
              aria-label="Celebrate again with confetti"
            >
              <HiSparkles className="w-4 h-4 text-brand-yellow" />
              <span>Celebrate Again 🎉</span>
            </button>
          </div>
        </div>
      )}

      <div className="text-center border-b border-stone-100 pb-8">
        <span className="inline-block bg-brand-coral text-white text-xs font-extrabold px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider shadow-xs">
          Real-time Breakdown
        </span>
        <h2 className="text-3xl font-extrabold text-stone-900">Your Transition Score Summary</h2>
        <p className="text-stone-500 text-sm mt-1">Based on your ratings across all 4 core dimensions.</p>

        {/* Overall Score Card */}
        <div className="mt-6 inline-flex flex-col items-center justify-center p-6 bg-linear-to-br from-pink-50/70 via-white to-amber-50/70 rounded-3xl border border-brand-coral/20 min-w-[240px] shadow-sm">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Overall Score</span>
          <span className="text-5xl font-extrabold text-brand-coral mt-1">
            {grandTotal} <span className="text-2xl text-stone-400 font-bold">/ {MAX_TOTAL_SCORE}</span>
          </span>
          <span className={`mt-3 text-xs font-extrabold px-3.5 py-1 rounded-full border ${readinessBadge.className}`}>
            {readinessBadge.text}
          </span>
        </div>

        {/* Primary Action Buttons: PDF Export & Print */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            aria-label="Download My Career Plan (PDF)"
          >
            {isGeneratingPdf ? (
              <>
                <HiArrowPath className="w-5 h-5 animate-spin" />
                <span>Generating Personalized PDF...</span>
              </>
            ) : (
              <>
                <HiArrowDownTray className="w-5 h-5 text-brand-yellow" />
                <span>Download My Career Plan (PDF)</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-all border border-stone-200 cursor-pointer"
          >
            <HiPrinter className="w-4 h-4 text-stone-500" />
            <span>Print Worksheet</span>
          </button>
        </div>
      </div>

      {/* Visual Radar Chart + Category Progress Bars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        <div className="lg:col-span-6">
          <ReadinessRadarChart scores={scores} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="mb-2">
            <h3 className="text-base font-extrabold text-stone-900">Dimensional Progress Bars</h3>
            <p className="text-xs text-stone-500">Individual score breakdowns per competence area</p>
          </div>
          <ScoreBarCard
            title="1. Mindset & Resilience"
            score={scores.m1}
            color="#b42970"
          />
          <ScoreBarCard
            title="2. Transferable Skills"
            score={scores.m2}
            color="#e8563a"
          />
          <ScoreBarCard
            title="3. Tech Literacy & Portfolio"
            score={scores.m3}
            color="#5f9de3"
          />
          <ScoreBarCard
            title="4. Networking & Strategy"
            score={scores.m4}
            color="#72c472"
          />
        </div>
      </div>

      {/* Actionable Recommendations Box */}
      <div className="mt-8 p-6 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-amber-950">
        <h3 className="font-extrabold text-base flex items-center gap-2 text-amber-900">
          <HiOutlineLightBulb className="w-5 h-5 text-amber-600" />
          <span>{recommendation.title}</span>
        </h3>
        <p className="text-sm mt-2 leading-relaxed text-amber-900/90 font-normal">
          {recommendation.text}
        </p>
        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
          <span className="text-xs text-amber-800 font-semibold">Explore our downloadable playbooks to strengthen this area</span>
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-coral hover:underline"
          >
            <span>View PDF Guides</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Auto-matched weekly PDF guides and podcast episodes */}
      <AutoMatchedResourcesSection matches={matchedResources} />

      {/* Email Results directly to candidate */}
      <EmailResultsCard
        grandTotal={grandTotal}
        scores={scores}
        readinessBadge={readinessBadge}
        recommendation={recommendation}
        reflectionNotes={reflectionNotes}
        totalAnswered={totalAnswered}
      />

      {/* Personal Reflection Notes */}
      <div className="mt-10 pt-8 border-t border-stone-100">
        <h3 className="text-lg font-extrabold text-stone-900 mb-2">Personal Reflection & Next Actions</h3>
        <p className="text-xs text-stone-500 mb-4">
          Write down 2-3 immediate steps you will take based on your score summary. Saved automatically in your browser.
        </p>
        <textarea
          rows={4}
          value={reflectionNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Example: 1. Update my LinkedIn headline to feature my target tech role. 2. Build my first original React project without relying entirely on video tutorials."
          className="w-full p-4 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral bg-stone-50/60 text-stone-900 leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <span className="text-xs text-stone-400">
            {reflectionNotes.trim() ? "✓ Notes will be included in your PDF export" : "Tip: Your reflection notes will be saved into your PDF export."}
          </span>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-coral/10 hover:bg-brand-coral/20 text-brand-coral font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Download My Career Plan with Notes (PDF)"
          >
            <HiArrowDownTray className="w-3.5 h-3.5" />
            <span>Download Plan with Notes (PDF)</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center text-center">
        <p className="text-xs text-stone-500 max-w-xl">
          🔒 <strong>Privacy Assurance</strong>: Your responses and reflections are processed locally in your browser and never sold or shared. Learn more in our{" "}
          <Link to="/privacy-policy" className="text-brand-coral font-bold hover:underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}
