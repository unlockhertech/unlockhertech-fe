import { useEffect, useState } from "react";
import { TRANSITION_STAGES } from "./resourceData";

function scrollToStage(stageId: string) {
  const target = document.getElementById(stageId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function useActiveStageId(): string {
  const [activeStageId, setActiveStageId] = useState(TRANSITION_STAGES[0]?.id ?? "");

  useEffect(() => {
    const sections = TRANSITION_STAGES.map((stage) => document.getElementById(stage.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveStageId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeStageId;
}

export function ResourceStageNav() {
  const activeStageId = useActiveStageId();

  return (
    <nav
      aria-label="Jump to transition stage"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
    >
      <div className="flex items-center gap-2.5 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center pb-1 sm:pb-0 snap-x snap-mandatory scrollbar-hide">
        {TRANSITION_STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              type="button"
              aria-current={isActive ? "true" : undefined}
              aria-label={`Jump to Stage ${stage.number}: ${stage.shortLabel}`}
              onClick={() => scrollToStage(stage.id)}
              className={`shrink-0 snap-start inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-xs text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                  : "bg-white border-stone-200 text-stone-700 hover:border-brand-coral hover:text-brand-coral"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ backgroundColor: stage.accentColor }}
              >
                {stage.number}
              </span>
              <span>{stage.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
