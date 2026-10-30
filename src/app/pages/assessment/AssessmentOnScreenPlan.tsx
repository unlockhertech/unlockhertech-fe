import { useMemo } from "react";
import { Link } from "react-router";
import {
  HiCheckCircle,
  HiOutlineSparkles,
  HiOutlineArrowDownTray,
  HiArrowPath,
  HiOutlinePrinter,
  HiArrowRight,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import {
  MAX_TOTAL_SCORE,
  MAX_CATEGORY_SCORE,
  type AssessmentScores,
  type CategoryRecommendation,
} from "./assessmentData";
import type { ReadinessBadgeInfo } from "./useAssessment";

interface AssessmentOnScreenPlanProps {
  scores: AssessmentScores;
  grandTotal: number;
  totalAnswered: number;
  readinessBadge: ReadinessBadgeInfo;
  recommendation: CategoryRecommendation;
  onDownloadPdf?: () => void;
  isGeneratingPdf?: boolean;
}

interface ActionItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timeline: string;
  categoryTag: string;
}

function getPrioritizedActionItems(scores: AssessmentScores): ActionItem[] {
  const items: ActionItem[] = [];

  // Sort categories by score ascending to identify greatest growth opportunities
  const categoryRanking: { key: keyof AssessmentScores; score: number }[] = [
    { key: "m1", score: scores.m1 },
    { key: "m2", score: scores.m2 },
    { key: "m3", score: scores.m3 },
    { key: "m4", score: scores.m4 },
  ];
  categoryRanking.sort((a, b) => a.score - b.score);

  const primaryLowest = categoryRanking[0]?.key ?? "m1";
  const secondaryLowest = categoryRanking[1]?.key ?? "m2";

  // Action 1: Tailored to primary lowest dimension
  if (primaryLowest === "m1") {
    items.push({
      id: "action-mindset",
      stepNumber: 1,
      title: "Establish a 45-Minute Daily Growth Rhythm",
      description: "Set a predictable learning block daily rather than marathon sessions. Reframe debugging roadblocks as puzzle solving to build technical stamina.",
      timeline: "Week 1–2",
      categoryTag: "Mindset & Resilience",
    });
  } else if (primaryLowest === "m2") {
    items.push({
      id: "action-skills",
      stepNumber: 1,
      title: "Quantify Non-Tech Transferable Impact",
      description: "Audit your past achievements and convert non-tech responsibilities into tech-aligned metrics (revenue, process speed, stakeholder management).",
      timeline: "Week 1–2",
      categoryTag: "Skills Translation",
    });
  } else if (primaryLowest === "m3") {
    items.push({
      id: "action-tech",
      stepNumber: 1,
      title: "Ship One End-to-End Proof of Work Project",
      description: "Build an original, deployed application with clean Git commit history, comprehensive README, and a short loom demo video.",
      timeline: "Week 1–3",
      categoryTag: "Technical Portfolio",
    });
  } else {
    items.push({
      id: "action-networking",
      stepNumber: 1,
      title: "Optimize LinkedIn Headline & Reach Out to 3 Peers",
      description: "Update your headline with target stack and domain expertise. Schedule three 15-minute coffee chats with working engineers or hiring managers.",
      timeline: "Week 1–2",
      categoryTag: "Strategic Networking",
    });
  }

  // Action 2: Secondary dimension or portfolio reinforcement
  if (secondaryLowest === "m3" || primaryLowest !== "m3") {
    items.push({
      id: "action-portfolio",
      stepNumber: 2,
      title: "Practice Explaining Projects with the STAR Method",
      description: "Record yourself explaining technical architecture decisions, trade-offs, and debugging hurdles using Situation, Task, Action, and Result structure.",
      timeline: "Week 3–4",
      categoryTag: "Interview Readiness",
    });
  } else {
    items.push({
      id: "action-translation",
      stepNumber: 2,
      title: "Translate Past Domain Knowledge to Industry Advantage",
      description: "Target companies operating in your past domain (FinTech, HealthTech, EdTech) where your business context outranks fresh CS graduates.",
      timeline: "Week 2–3",
      categoryTag: "Domain Positioning",
    });
  }

  // Action 3: Community & Application Pipeline
  items.push({
    id: "action-pipeline",
    stepNumber: 3,
    title: "Join Community Circles & Build in Public",
    description: "Share your weekly learning insights on LinkedIn or Discord community channels to attract warm inbound referrals and mentorship opportunities.",
    timeline: "Ongoing",
    categoryTag: "Community & Career",
  });

  return items;
}

export function AssessmentOnScreenPlan({
  scores,
  grandTotal,
  totalAnswered,
  readinessBadge,
  recommendation,
  onDownloadPdf,
  isGeneratingPdf = false,
}: Readonly<AssessmentOnScreenPlanProps>) {
  const actionItems = useMemo(() => getPrioritizedActionItems(scores), [scores]);

  const categoryCards = [
    { title: "Mindset & Resilience", score: scores.m1, color: "#b42970" },
    { title: "Transferable Skills", score: scores.m2, color: "#e8563a" },
    { title: "Tech Literacy & Portfolio", score: scores.m3, color: "#5f9de3" },
    { title: "Networking & Strategy", score: scores.m4, color: "#72c472" },
  ];

  return (
    <section
      aria-labelledby="action-plan-heading"
      className="mt-8 p-6 sm:p-8 rounded-3xl bg-linear-to-br from-white via-stone-50 to-pink-50/40 text-gray-900 shadow-xl border border-brand-coral/20"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral font-extrabold text-xs uppercase tracking-wider mb-2 border border-brand-coral/20">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Interactive On-Screen Dashboard</span>
          </div>
          <h3 id="action-plan-heading" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Your Personalized Career Action Plan
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
            Tailored focus areas, score breakdown, and prioritized next steps generated directly from your assessment responses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border ${readinessBadge.className}`}>
            {readinessBadge.text}
          </span>
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            {grandTotal} / {MAX_TOTAL_SCORE} pts
          </span>
        </div>
      </div>

      {/* 4-Dimension Quick Breakdown Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {categoryCards.map((card) => {
          const percent = Math.min(100, Math.round((card.score / MAX_CATEGORY_SCORE) * 100));
          return (
            <div
              key={card.title}
              className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between"
            >
              <div className="text-[11px] sm:text-xs text-stone-600 font-semibold truncate">
                {card.title}
              </div>
              <div className="flex items-baseline justify-between mt-2 mb-1.5">
                <span className="text-lg sm:text-xl font-black text-gray-900">{card.score}</span>
                <span className="text-[10px] sm:text-xs text-stone-500 font-bold">/ {MAX_CATEGORY_SCORE}</span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: card.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Recommendation Callout */}
      {recommendation && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            Primary Focus · {recommendation.title}
          </p>
          <p className="text-xs text-amber-900/90 leading-relaxed font-normal">
            {recommendation.text}
          </p>
        </div>
      )}

      {/* Top 3 Prioritized Action Steps */}
      <div className="space-y-3 sm:space-y-4 pt-2">
        <div className="flex items-center gap-2 text-sm font-extrabold text-stone-800">
          <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-brand-coral" />
          <span>Top 3 Prioritized Action Steps</span>
        </div>

        <ol className="space-y-3">
          {actionItems.map((item) => (
            <li
              key={item.id}
              className="p-4 rounded-2xl bg-white hover:bg-stone-50/80 transition-colors border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-brand-coral text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                  {item.stepNumber}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {item.categoryTag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-coral shrink-0 pl-10 sm:pl-0">
                {item.timeline}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action Footer Callouts */}
      <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{totalAnswered} of 16 factors analyzed. Free printable format available.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all motion-safe:hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              aria-label="Download My Career Plan (PDF)"
            >
              {isGeneratingPdf ? (
                <>
                  <HiArrowPath className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <HiOutlineArrowDownTray className="w-4 h-4 text-brand-yellow" />
                  <span>Download PDF Plan</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-colors border border-stone-200 cursor-pointer"
          >
            <HiOutlinePrinter className="w-4 h-4" />
            <span>Print</span>
          </button>

          <Link
            to="/resources"
            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-brand-coral font-bold text-xs sm:text-sm transition-colors border border-pink-200"
          >
            <span>Explore Playbooks</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
