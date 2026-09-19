import { useState, useEffect, type ComponentType } from "react";
import { useSearchParams } from "react-router";
import {
  HiCheck,
  HiBookOpen,
  HiWrenchScrewdriver,
  HiArrowPath,
  HiSquares2X2,
  HiArrowRight,
  HiSparkles,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import {
  LEARNING_FORMATS,
  KEY_DIFFERENCES,
  type LearningFormat,
} from "./practicesData";

export type FormatTabId = "all" | "theory" | "practice" | "review";

interface StageTabItem {
  id: FormatTabId;
  stageNumber?: string;
  label: string;
  short: string;
  badge?: string;
  badgeColor?: string;
  icon: ComponentType<{ className?: string }>;
}

const STAGE_TABS: StageTabItem[] = [
  {
    id: "all",
    label: "Overview & Compare",
    short: "Overview",
    icon: HiSquares2X2,
  },
  {
    id: "theory",
    stageNumber: "Stage 1",
    label: "Theory",
    short: "Theory",
    badge: "Live on Luma",
    badgeColor: "bg-[#ff6051] text-white",
    icon: HiBookOpen,
  },
  {
    id: "practice",
    stageNumber: "Stage 2",
    label: "Practice",
    short: "Practice",
    badge: "Interactive Doing",
    badgeColor: "bg-[#b52970] text-white",
    icon: HiWrenchScrewdriver,
  },
  {
    id: "review",
    stageNumber: "Stage 3",
    label: "Review",
    short: "Review",
    badge: "Mastery & Recall",
    badgeColor: "bg-[#72c472] text-white",
    icon: HiArrowPath,
  },
];

function parseValidTab(rawTab: string | null | undefined): FormatTabId | null {
  if (!rawTab) return null;
  const normalized = rawTab.toLowerCase().replace("#", "").trim();
  if (normalized === "theory" || normalized === "practice" || normalized === "review" || normalized === "all") {
    return normalized as FormatTabId;
  }
  return null;
}

function getTabButtonClass(tabId: FormatTabId, activeTab: FormatTabId): string {
  if (tabId === activeTab) {
    if (tabId === "theory") {
      return "bg-[#ff6051] text-white shadow-md border-[#ff6051] font-bold";
    }
    if (tabId === "practice") {
      return "bg-[#b52970] text-white shadow-md border-[#b52970] font-bold";
    }
    if (tabId === "review") {
      return "bg-[#72c472] text-stone-900 shadow-md border-[#72c472] font-bold";
    }
    return "bg-brand-coral text-white shadow-md border-brand-coral font-bold";
  }
  return "bg-white text-gray-700 hover:text-gray-900 hover:bg-stone-100 border-gray-200 font-semibold";
}

function getCardAccentBorder(formatId: "theory" | "practice" | "review"): string {
  if (formatId === "theory") return "border-[#ff6051]/40 hover:border-[#ff6051]";
  if (formatId === "practice") return "border-[#b52970]/40 hover:border-[#b52970]";
  return "border-[#72c472]/50 hover:border-[#72c472]";
}

function getFormatAccentText(formatId: "theory" | "practice" | "review"): string {
  if (formatId === "theory") return "text-[#ff6051]";
  if (formatId === "practice") return "text-[#b52970]";
  return "text-[#72c472]";
}

function getFormatAccentBg(formatId: "theory" | "practice" | "review"): string {
  if (formatId === "theory") return "bg-[#ff6051]";
  if (formatId === "practice") return "bg-[#b52970]";
  return "bg-[#72c472]";
}

interface FormatDetailViewProps {
  format: LearningFormat;
  onSelectTab: (tabId: FormatTabId) => void;
}

function FormatDetailView({ format, onSelectTab }: Readonly<FormatDetailViewProps>) {
  const Icon = format.icon;
  const accentText = getFormatAccentText(format.id);
  const accentBg = getFormatAccentBg(format.id);

  return (
    <div
      id={`tabpanel-${format.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${format.id}`}
      className="space-y-8 animate-fadeIn"
    >
      {/* Format Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl bg-stone-50 border border-gray-200 ${accentText} flex items-center justify-center shrink-0 shadow-xs`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{format.title}</h3>
                <span className={`text-[0.7rem] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${format.badgeColor}`}>
                  {format.badge}
                </span>
                {format.currentLive && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    Live Format
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-500 mt-1">{format.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Mantra Banner */}
        <div className="bg-stone-50 border border-gray-200 rounded-2xl p-5 mb-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block mb-1">
              Think of {format.shortName} as:
            </span>
            <p className="text-base sm:text-lg font-black text-stone-900 italic">
              {format.mantra}
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Key Dynamic:
            </span>
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl bg-white border border-gray-200 ${accentText} inline-block`}>
              {format.keyDifference}
            </span>
          </div>
        </div>

        {/* Grid: Purpose & Instructor Role */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Purpose & Topics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-gray-200 shadow-2xs h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-3 flex items-center gap-2">
                  <HiSparkles className={`w-4 h-4 ${accentText}`} />
                  Purpose of the Initiative
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  {format.purpose}
                </p>
              </div>

              <div>
                <h5 className="text-xs uppercase font-extrabold text-gray-600 tracking-wider mb-3">
                  Sample Topics & Activities:
                </h5>
                <ul className="space-y-2">
                  {format.topicsOrActivities.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2`} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Role */}
          <div className="lg:col-span-6">
            <div className="bg-stone-50/70 rounded-2xl p-6 border border-gray-200 shadow-2xs">
              <h4 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-3.5 flex items-center gap-2">
                <HiCheck className={`w-4 h-4 ${accentText}`} />
                What the Instructor Does
              </h4>
              <ul className="space-y-2.5">
                {format.instructorRole.map((roleItem) => (
                  <li key={roleItem} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <HiCheck className={`w-4 h-4 ${accentText} shrink-0 mt-0.5`} />
                    <span>{roleItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Switcher Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
            <span>Explore other formats:</span>
            {LEARNING_FORMATS.filter((f) => f.id !== format.id).map((other) => (
              <button
                key={other.id}
                type="button"
                onClick={() => onSelectTab(other.id)}
                className={`text-xs font-bold ${getFormatAccentText(other.id)} hover:underline cursor-pointer`}
              >
                {other.shortName}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab("all")}
            className="text-xs font-bold text-gray-700 hover:text-brand-coral transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Back to All Formats & Compare</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface OverviewStagesViewProps {
  onSelectTab: (tabId: FormatTabId) => void;
}

function OverviewStagesView({ onSelectTab }: Readonly<OverviewStagesViewProps>) {
  return (
    <div
      id="tabpanel-all"
      role="tabpanel"
      aria-labelledby="tab-all"
      className="space-y-12 animate-fadeIn"
    >
      {/* 3 Stages Summary Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {LEARNING_FORMATS.map((format, idx) => {
          const Icon = format.icon;
          const borderClass = getCardAccentBorder(format.id);
          const stageNumber = `Stage ${idx + 1}`;

          return (
            <div
              key={format.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border ${borderClass} shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group`}
            >
              <div>
                {/* Top Header Badge & Live status */}
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] uppercase font-black text-gray-400 bg-stone-100 px-2.5 py-0.5 rounded-md">
                      {stageNumber}
                    </span>
                    <span className={`text-[0.7rem] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${format.badgeColor}`}>
                      {format.badge}
                    </span>
                  </div>
                  {format.currentLive && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                      Live Format
                    </span>
                  )}
                </div>

                {/* Format Title & Subtitle */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className={`w-11 h-11 rounded-2xl bg-stone-50 border border-gray-200 ${getFormatAccentText(format.id)} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{format.title}</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{format.subtitle}</p>
                  </div>
                </div>

                {/* Mantra Pill */}
                <div className="bg-stone-50 border border-gray-200 rounded-2xl p-3.5 mb-5 shadow-2xs">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block mb-1">
                    Think of {format.shortName} as:
                  </span>
                  <p className="text-sm font-extrabold text-stone-900 italic">
                    {format.mantra}
                  </p>
                </div>

                {/* Purpose Short summary */}
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {format.purpose}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onSelectTab(format.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-gray-200 text-gray-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 hover:border-current cursor-pointer"
                >
                  <span>Explore {format.shortName} Format</span>
                  <HiArrowRight className={`w-4 h-4 ${getFormatAccentText(format.id)} group-hover:translate-x-0.5 transition-transform`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Key Difference Comparison Table */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Quick Comparison
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            The Key Difference
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            How the roles and focus shift across the three She Leads Tech formats.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {KEY_DIFFERENCES.map((diff) => (
            <div
              key={diff.format}
              className={`rounded-2xl p-6 border ${diff.color} shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-black text-gray-900">
                    {diff.format}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${diff.badgeColor}`}>
                    {diff.format === "Theory" ? "Learning" : diff.format === "Practice" ? "Doing" : "Strengthening"}
                  </span>
                </div>

                <div className="space-y-3 mb-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 font-semibold block text-[11px] uppercase tracking-wider">Leadership:</span>
                    <span className="font-bold text-gray-900">{diff.whoLeads}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block text-[11px] uppercase tracking-wider">Participants:</span>
                    <span className="font-semibold text-gray-800">{diff.participantsRole}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                  Core Loop:
                </span>
                <p className="text-xs font-black italic text-gray-900">
                  {diff.coreFocus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SheLeadsTechStagesNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFormat = parseValidTab(searchParams.get("format"));
  const [hashTab, setHashTab] = useState<FormatTabId | null>(() => {
    if (typeof window !== "undefined") {
      return parseValidTab(window.location.hash);
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setHashTab(parseValidTab(window.location.hash));
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const activeTab: FormatTabId = queryFormat ?? hashTab ?? "all";

  const handleTabChange = (tabId: FormatTabId) => {
    setHashTab(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tabId === "all") {
          next.delete("format");
        } else {
          next.set("format", tabId);
        }
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  };

  const selectedFormat = LEARNING_FORMATS.find((f) => f.id === activeTab);

  return (
    <section id="learning-formats" className="py-16 sm:py-20 bg-stone-50 border-y border-gray-200 relative overflow-hidden scroll-mt-10">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Learning Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            She Leads Tech Learning Formats
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Three interconnected stages designed to guide you from foundational comprehension to hands-on execution and long-term engineering mastery.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex justify-center mb-10">
          <div
            role="tablist"
            aria-label="She Leads Tech Learning Formats"
            className="inline-flex p-1.5 rounded-2xl bg-stone-200/80 border border-gray-300 gap-1.5 flex-wrap justify-center shadow-inner"
          >
            {STAGE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              const buttonClass = getTabButtonClass(tab.id, activeTab);

              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${buttonClass}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.stageNumber && (
                    <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-sm ${isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-gray-500"}`}>
                      {tab.stageNumber}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Panel */}
        {activeTab === "all" || !selectedFormat ? (
          <OverviewStagesView onSelectTab={handleTabChange} />
        ) : (
          <FormatDetailView format={selectedFormat} onSelectTab={handleTabChange} />
        )}

      </div>
    </section>
  );
}
