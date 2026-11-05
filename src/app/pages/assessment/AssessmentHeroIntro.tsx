import { useState } from "react";
import {
  HiSparkles,
  HiArrowRight,
  HiArrowPath,
  HiCheckCircle,
  HiClock,
  HiShieldCheck,
  HiDocumentChartBar,
  HiChevronDown,
  HiChevronUp,
  HiQueueList,
} from "react-icons/hi2";
import { BERRY, ORANGE, GREEN } from "../../data";
import { TOTAL_QUESTIONS_COUNT } from "./assessmentData";

interface AssessmentHeroIntroProps {
  totalAnswered: number;
  hasSavedProgress: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onResume: () => void;
  onViewResults: () => void;
  onViewWorksheet: () => void;
}

interface FeaturePillar {
  id: string;
  number: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const PILLARS: FeaturePillar[] = [
  {
    id: "pillar-radar",
    number: "01",
    title: "4-Pillar Visual Readiness Radar",
    description:
      "Map your confidence across Mindset, Transferable Skills, Technical Literacy, and Networking Strategy on an interactive spider chart.",
    badge: "Interactive Radar",
    badgeColor: BERRY,
  },
  {
    id: "pillar-pdf",
    number: "02",
    title: "Personalized 2-Page Action Plan (PDF)",
    description:
      "Generate an instant downloadable roadmap featuring your high-priority action steps, milestone goals, and tailored weekly study targets.",
    badge: "Instant PDF Export",
    badgeColor: ORANGE,
  },
  {
    id: "pillar-resources",
    number: "03",
    title: "Tailored Resource & Track Matching",
    description:
      "Receive automatic recommendations for curated playbooks, community workshops, and technical learning tracks matched to your growth areas.",
    badge: "Curated Recommendations",
    badgeColor: GREEN,
  },
];

interface ScoreLegendItem {
  score: number;
  label: string;
  description: string;
  badgeBg: string;
  textColor: string;
}

const SCORE_LEVELS: ScoreLegendItem[] = [
  {
    score: 1,
    label: "Rarely / Never",
    description: "Brand new territory or an area where you have little to no previous exposure.",
    badgeBg: "bg-pink-100",
    textColor: "text-brand-coral",
  },
  {
    score: 2,
    label: "Emerging",
    description: "Beginning to explore or building initial conceptual familiarity.",
    badgeBg: "bg-amber-100",
    textColor: "text-amber-800",
  },
  {
    score: 3,
    label: "Developing / Moderate",
    description: "Intermediate exposure; you apply this occasionally but are still refining it.",
    badgeBg: "bg-stone-200",
    textColor: "text-stone-700",
  },
  {
    score: 4,
    label: "Frequently / Strong",
    description: "Consistent practice and confident execution in real or professional projects.",
    badgeBg: "bg-blue-100",
    textColor: "text-blue-800",
  },
  {
    score: 5,
    label: "Always / Confident",
    description: "Established core strength; second nature and workplace-ready.",
    badgeBg: "bg-emerald-100",
    textColor: "text-emerald-800",
  },
];

export function AssessmentHeroIntro({
  totalAnswered,
  hasSavedProgress,
  isCompleted,
  onStart,
  onResume,
  onViewResults,
  onViewWorksheet,
}: Readonly<AssessmentHeroIntroProps>) {
  const [isScoringGuideOpen, setIsScoringGuideOpen] = useState(false);

  return (
    <section
      aria-labelledby="assessment-intro-heading"
      className="space-y-8 print:hidden motion-safe:animate-in motion-safe:fade-in duration-300"
    >
      {/* ── 1. Hero Pitch Card ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-linear-to-bl from-pink-100/60 via-amber-50/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badges bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-brand-coral font-extrabold text-xs uppercase tracking-wider">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>Step-by-Step Self-Assessment</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              <HiClock className="w-3.5 h-3.5 text-amber-700" />
              <span>3–5 Mins</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
              <HiShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Free & Private • Stored Locally</span>
            </div>
          </div>

          <h2
            id="assessment-intro-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight mb-4"
          >
            Discover Your Tech Transition Readiness & Concrete Next Steps
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal mb-8">
            Evaluate your readiness across 16 critical factors. Step through one focused category at a time to unlock your customized radar breakdown and downloadable 2-page career action plan.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
            {isCompleted ? (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onViewResults}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm sm:text-base shadow-md transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
                >
                  <HiDocumentChartBar className="w-5 h-5 text-brand-yellow" />
                  <span>View Your Results & Action Plan</span>
                  <HiArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <HiArrowPath className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            ) : hasSavedProgress ? (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onResume}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm sm:text-base shadow-md transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
                >
                  <span>Resume Assessment ({totalAnswered}/{TOTAL_QUESTIONS_COUNT} Answered)</span>
                  <HiArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>Start Fresh</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm sm:text-base shadow-md shadow-brand-coral/25 transition-all cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
              >
                <span>Start Free Assessment (3–5 Mins)</span>
                <HiArrowRight className="w-5 h-5 text-brand-yellow" />
              </button>
            )}

            <button
              type="button"
              onClick={onViewWorksheet}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <HiQueueList className="w-4 h-4 text-stone-500" />
              <span>Preview or Print Blank Worksheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. What You'll Receive (3 Feature Cards) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: pillar.badgeColor }}
                >
                  {pillar.badge}
                </span>
                <span className="text-xl font-black text-stone-300">
                  {pillar.number}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-stone-500">
              <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Included with zero paywalls</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Scoring Scale Guidance Dropdown ────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setIsScoringGuideOpen((prev) => !prev)}
          aria-expanded={isScoringGuideOpen}
          className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-brand-coral group-hover:bg-pink-100 transition-colors shrink-0">
              <HiSparkles className="w-5 h-5 text-brand-coral" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-brand-coral transition-colors">
                Understanding the 1–5 Rating Scale & Scoring Guidance
              </h4>
              <p className="text-xs text-stone-500">
                Click to expand the evaluation criteria and rating rubrics
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-stone-100 text-stone-600 group-hover:bg-stone-200 transition-colors shrink-0">
            {isScoringGuideOpen ? (
              <HiChevronUp className="w-4 h-4" />
            ) : (
              <HiChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isScoringGuideOpen && (
          <div className="mt-5 pt-5 border-t border-stone-100 space-y-4 motion-safe:animate-in motion-safe:fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {SCORE_LEVELS.map((item) => (
                <div
                  key={item.score}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg ${item.badgeBg} ${item.textColor} font-black text-xs flex items-center justify-center`}
                    >
                      {item.score}
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-stone-600 leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500 italic bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-amber-900">
              💡 <strong>Pro-Tip:</strong> Honest self-reflection unlocks the most accurate action steps. Scoring a 1 or 2 in an unfamiliar area directly pinpoints your highest-leverage growth opportunities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
