import { useState } from "react";
import {
  HiSparkles,
  HiChevronDown,
  HiChevronUp,
  HiCheckCircle,
  HiViewColumns,
  HiDocumentChartBar,
  HiClock,
  HiShieldCheck,
} from "react-icons/hi2";
import { BERRY, ORANGE, GREEN } from "../../data";

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  icon: typeof HiCheckCircle;
}

const STEPS: StepItem[] = [
  {
    id: "step-rate",
    stepNumber: "01",
    title: "Rate 16 Prompts Honestly",
    description:
      "Assess 4 key pillars: Mindset, Transferable Skills, Tech Literacy, and Networking. Rate your current confidence on a 1–5 scale.",
    tag: "3–5 Minutes",
    color: BERRY,
    icon: HiCheckCircle,
  },
  {
    id: "step-view",
    stepNumber: "02",
    title: "Choose Your Work Mode",
    description:
      "Use Step-by-Step Focus Mode to concentrate on one category at a time, or switch to Worksheet View to see the full questionnaire.",
    tag: "Focus or All-in-One",
    color: ORANGE,
    icon: HiViewColumns,
  },
  {
    id: "step-plan",
    stepNumber: "03",
    title: "Unlock Custom Action Plan",
    description:
      "Instantly view your interactive Radar Chart, categorized strengths and growth areas, and generate a personalized 2-page PDF Action Plan.",
    tag: "Instant & Free",
    color: GREEN,
    icon: HiDocumentChartBar,
  },
];

interface ScoreLegendItem {
  score: number;
  label: string;
  description: string;
  colorClass: string;
  badgeBg: string;
}

const SCORE_LEVELS: ScoreLegendItem[] = [
  {
    score: 1,
    label: "Rarely / Never",
    description: "Brand new territory or an area where you have little to no previous exposure.",
    colorClass: "text-brand-coral",
    badgeBg: "bg-pink-100",
  },
  {
    score: 2,
    label: "Emerging",
    description: "Beginning to explore or building initial conceptual familiarity.",
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100",
  },
  {
    score: 3,
    label: "Developing / Moderate",
    description: "Intermediate exposure; you apply this occasionally but are still refining it.",
    colorClass: "text-stone-700",
    badgeBg: "bg-stone-200",
  },
  {
    score: 4,
    label: "Frequently / Strong",
    description: "Consistent practice and confident execution in real or professional projects.",
    colorClass: "text-blue-800",
    badgeBg: "bg-blue-100",
  },
  {
    score: 5,
    label: "Always / Confident",
    description: "Established core strength; second nature and workplace-ready.",
    colorClass: "text-emerald-800",
    badgeBg: "bg-emerald-100",
  },
];

export function AssessmentInstructionsBanner() {
  const [isScoringGuideOpen, setIsScoringGuideOpen] = useState(false);

  return (
    <section
      aria-labelledby="assessment-instructions-heading"
      className="mb-8 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs print:hidden transition-all"
    >
      {/* ── Top Header Row ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral border border-pink-100 text-xs font-black uppercase tracking-wider mb-2">
            <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>How It Works</span>
          </div>
          <h2
            id="assessment-instructions-heading"
            className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug"
          >
            Complete Your Readiness Check in 3 Quick Steps
          </h2>
        </div>

        {/* Quick Highlights Badge Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200/80">
            <HiClock className="w-3.5 h-3.5 text-brand-coral" />
            <span>3–5 Mins</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200/80">
            <HiShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autosaved Locally</span>
          </span>
        </div>
      </div>

      {/* ── 3-Step Horizontal Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {STEPS.map((step) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.id}
              className="relative p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 flex flex-col justify-between hover:bg-stone-50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black text-white shadow-xs"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="text-[0.7rem] font-bold text-stone-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-stone-200/70">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                  <StepIcon className="w-4 h-4 text-brand-coral shrink-0" />
                  <span>{step.title}</span>
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Collapsible Scoring Scale Accordion ─────────────────────────── */}
      <div className="pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => setIsScoringGuideOpen((prev) => !prev)}
          aria-expanded={isScoringGuideOpen}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-stone-700 hover:text-brand-coral transition-colors cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <HiSparkles className="w-4 h-4 text-brand-yellow group-hover:scale-110 transition-transform" />
            <span>Understanding the 1–5 Rating Scale & Scoring Guidance</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[0.7rem] text-stone-500 font-semibold group-hover:text-brand-coral">
            <span>{isScoringGuideOpen ? "Hide Details" : "Show Details"}</span>
            {isScoringGuideOpen ? (
              <HiChevronUp className="w-4 h-4" />
            ) : (
              <HiChevronDown className="w-4 h-4" />
            )}
          </span>
        </button>

        {isScoringGuideOpen && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-stone-50/90 border border-stone-200/80 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {SCORE_LEVELS.map((item) => (
                <div
                  key={item.score}
                  className="p-3 rounded-xl bg-white border border-stone-200/70 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${item.badgeBg} ${item.colorClass}`}
                    >
                      {item.score}
                    </span>
                    <span className={`text-xs font-extrabold ${item.colorClass}`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[0.72rem] text-stone-600 leading-normal">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-brand-coral/5 border border-brand-coral/15 flex items-start gap-2.5 text-xs text-stone-700">
              <HiSparkles className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Honest self-reflection unlocks the best results:</strong>
                {" "}Scores of 1 or 2 are not failures—they highlight your highest-leverage growth areas where She Leads Tech curriculum tracks and playbooks can accelerate your transition.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
