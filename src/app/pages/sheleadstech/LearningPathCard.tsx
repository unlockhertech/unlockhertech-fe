import { Link } from "react-router";
import {
  HiAcademicCap,
  HiCodeBracket,
  HiServerStack,
  HiDevicePhoneMobile,
  HiArrowRight,
  HiSparkles,
} from "react-icons/hi2";
import type { LearningPath, PathIconType } from "./learningPathsData";

interface LearningPathCardProps {
  path: Readonly<LearningPath>;
}

function renderPathIcon(type: PathIconType) {
  switch (type) {
    case "academic":
      return <HiAcademicCap className="w-6 h-6 text-[#b52970]" />;
    case "code":
      return <HiCodeBracket className="w-6 h-6 text-[#1e72b5]" />;
    case "server":
      return <HiServerStack className="w-6 h-6 text-[#e8563a]" />;
    case "mobile":
      return <HiDevicePhoneMobile className="w-6 h-6 text-[#2b7a2b]" />;
    default:
      return <HiSparkles className="w-6 h-6 text-brand-coral" />;
  }
}

export function LearningPathCard({ path }: Readonly<LearningPathCardProps>) {
  return (
    <article className="group relative rounded-2xl sm:rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Brand Accent Gradient Bar */}
      <div className={`h-2.5 w-full bg-gradient-to-r ${path.accentGradient}`} />

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Icon, Badges, Title, Subtitle, Description */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                {renderPathIcon(path.iconType)}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${path.badgeClass}`}
              >
                {path.isLive && (
                  <span className="w-2 h-2 rounded-full bg-[#b52970] animate-pulse" />
                )}
                {path.badge}
              </span>
            </div>

            <h3 className="text-2xl font-black text-stone-900 group-hover:text-brand-coral transition-colors mb-1">
              {path.title}
            </h3>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
              {path.subtitle}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              {path.description}
            </p>
          </div>

          {/* Right Column: Focus Areas & Topic Pills */}
          <div className="lg:col-span-5 flex flex-col bg-stone-50/70 border border-stone-200/70 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-stone-700 mb-3">
              <HiSparkles className="w-3.5 h-3.5 text-brand-coral" />
              <span>Core Focus Areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {path.topics.map((t) => (
                <span
                  key={`topic-${path.slug}-${t}`}
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${path.pillBadgeClass}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 sm:px-8 py-4 bg-stone-50/80 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          <span>Theory • Practice • Review • Build</span>
        </span>
        <Link
          to={path.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-coral hover:bg-[#9e2463] rounded-full shadow-xs transition-all group-hover:gap-2.5"
          aria-label={`Explore the ${path.title}`}
        >
          <span>Explore path</span>
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}