import { Link } from "react-router";
import {
  HiDocumentText,
  HiMicrophone,
  HiCodeBracket,
  HiArrowTopRightOnSquare,
  HiArrowRight,
  HiSparkles,
  HiExclamationCircle,
} from "react-icons/hi2";
import type { CategoryResourceMatch } from "./matchedResources";
import { trackEvent } from "../../utils/analytics";

interface AutoMatchedResourcesSectionProps {
  matches: CategoryResourceMatch[];
}

function getResourceIcon(type: string) {
  if (type === "guide") return HiDocumentText;
  if (type === "podcast") return HiMicrophone;
  return HiCodeBracket;
}

export function AutoMatchedResourcesSection({ matches }: Readonly<AutoMatchedResourcesSectionProps>) {
  if (!matches || matches.length === 0) {
    return null;
  }

  const handleResourceClick = (categoryKey: string, resourceTitle: string, url: string) => {
    trackEvent("click_matched_resource", "Assessment", `${categoryKey} -> ${resourceTitle} (${url})`);
  };

  return (
    <section
      data-testid="auto-matched-resources-section"
      className="mt-10 pt-10 border-t border-stone-200/80"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/20 text-brand-coral text-xs font-extrabold uppercase tracking-wider mb-2">
            <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Curated Curriculum • Smart Auto-Matching</span>
          </div>
          <h3 className="text-2xl font-black text-stone-900 tracking-tight">
            Tailored Resources for Your Growth Areas
          </h3>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Categories scoring under 60% are automatically paired with specific Unlock Her Tech weekly PDF guides, podcast episodes, and hands-on workshops.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {matches.map((match) => (
          <div
            key={match.categoryKey}
            className="bg-stone-50/70 border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs"
          >
            {/* Category Header & Score Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-coral text-white text-xs font-bold flex items-center justify-center">
                  {match.categoryNumber}
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  {match.categoryTitle}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    match.percentage < 60
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200"
                  }`}
                >
                  Score: {match.currentScore} / {match.maxScore} ({match.percentage}%)
                </span>
              </div>
            </div>

            {/* Growth Focus Insight */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 flex items-start gap-2 bg-white/80 p-3.5 rounded-2xl border border-stone-200/60">
              <HiExclamationCircle className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
              <span>{match.growthFocusReason}</span>
            </p>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {match.resources.map((res) => {
                const Icon = getResourceIcon(res.type);

                return (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-brand-coral/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-brand-coral" />
                        </div>
                        <span
                          className={`text-[0.65rem] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${res.badgeColor}`}
                        >
                          {res.badge}
                        </span>
                      </div>

                      <h5 className="font-extrabold text-sm text-stone-900 mb-1.5 leading-snug line-clamp-2">
                        {res.title}
                      </h5>
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mb-4">
                        {res.description}
                      </p>
                    </div>

                    {res.isExternal ? (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleResourceClick(match.categoryKey, res.title, res.url)}
                        className="inline-flex items-center justify-between text-xs font-bold text-brand-coral hover:text-brand-coral/80 pt-3 border-t border-stone-100 group cursor-pointer"
                      >
                        <span>{res.ctaText}</span>
                        <HiArrowTopRightOnSquare className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <Link
                        to={res.url}
                        onClick={() => handleResourceClick(match.categoryKey, res.title, res.url)}
                        className="inline-flex items-center justify-between text-xs font-bold text-brand-coral hover:text-brand-coral/80 pt-3 border-t border-stone-100 group cursor-pointer"
                      >
                        <span>{res.ctaText}</span>
                        <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
