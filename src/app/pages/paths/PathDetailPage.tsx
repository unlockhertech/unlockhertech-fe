import { Link, useParams } from "react-router";
import {
  HiAcademicCap,
  HiCodeBracket,
  HiServerStack,
  HiDevicePhoneMobile,
  HiSparkles,
  HiArrowLeft,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi2";
import { LEARNING_PATHS, type PathIconType } from "../sheleadstech/learningPathsData";
import { isPathEnabled } from "../../featureFlags";
import { DISCORD_INVITE_URL } from "../../data";

function renderDetailPathIcon(type: PathIconType) {
  switch (type) {
    case "academic":
      return <HiAcademicCap className="w-8 h-8 text-[#b52970]" />;
    case "code":
      return <HiCodeBracket className="w-8 h-8 text-[#1e72b5]" />;
    case "server":
      return <HiServerStack className="w-8 h-8 text-[#e8563a]" />;
    case "mobile":
      return <HiDevicePhoneMobile className="w-8 h-8 text-[#2b7a2b]" />;
    default:
      return <HiSparkles className="w-8 h-8 text-brand-coral" />;
  }
}

export function PathDetailPage() {
  const { slug } = useParams();
  const path = LEARNING_PATHS.find((p) => p.slug === slug);
  const enabled = slug ? isPathEnabled(slug) : false;

  return (
    <div className="bg-stone-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            to="/she-leads-tech"
            className="inline-flex items-center gap-2 text-sm text-brand-coral font-bold hover:underline"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to She Leads Tech</span>
          </Link>
        </div>

        {path && enabled ? (
          <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm overflow-hidden">
            {/* Top Accent Gradient */}
            <div className={`h-3 w-full bg-gradient-to-r ${path.accentGradient}`} />

            <div className="p-6 sm:p-10">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center shadow-xs">
                    {renderDetailPathIcon(path.iconType)}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${path.badgeClass}`}
                    >
                      {path.isLive && (
                        <span className="w-2 h-2 rounded-full bg-[#b52970] animate-pulse" />
                      )}
                      {path.badge}
                    </span>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">
                      {path.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-4">
                {path.title}
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {path.description}
              </p>

              {/* Focus Areas Section */}
              <section className="mb-10 bg-stone-50/70 border border-stone-200/80 rounded-2xl p-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 flex items-center gap-2">
                  <HiSparkles className="w-4 h-4 text-brand-coral" />
                  <span>Core Curriculum Modules & Topics</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {path.topics.map((t) => (
                    <span
                      key={`topic-pill-${path.slug}-${t}`}
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors shadow-xs ${path.pillBadgeClass}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>

              {/* How It Works & 4 Formats */}
              <section className="mb-8">
                <h2 className="text-xl font-black text-stone-900 mb-4">
                  How You Learn This Path
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-stone-200 bg-white">
                    <p className="text-xs font-black uppercase tracking-wider text-[#ff6051] mb-1">
                      Stage 1 • Theory
                    </p>
                    <p className="text-sm text-stone-700">
                      Instructor-led concept deconstruction with visual architecture blueprints and mental models.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200 bg-white">
                    <p className="text-xs font-black uppercase tracking-wider text-[#b52970] mb-1">
                      Stage 2 • Practice
                    </p>
                    <p className="text-sm text-stone-700">
                      Hands-on collaborative problem solving and live coding with supportive peers and mentors.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200 bg-white">
                    <p className="text-xs font-black uppercase tracking-wider text-[#72c472] mb-1">
                      Stage 3 • Review
                    </p>
                    <p className="text-sm text-stone-700">
                      Active recall, edge-case breakdowns, and spaced repetition to solidify long-term retention.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200 bg-white">
                    <p className="text-xs font-black uppercase tracking-wider text-brand-blue mb-1">
                      Stage 4 • Build
                    </p>
                    <p className="text-sm text-stone-700">
                      End-to-end real-world projects shipped to GitHub for your engineering portfolio.
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA Row */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <HiCheckCircle className="w-4 h-4 text-[#72c472]" />
                  <span>Free community workshops synced via Luma & Discord</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition"
                  >
                    <span>Join Discord Study Group</span>
                  </a>
                  <Link
                    to="/she-leads-tech"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-brand-coral hover:bg-[#9e2463] rounded-full shadow-xs transition"
                  >
                    <span>View Upcoming Workshops</span>
                    <HiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-8 sm:p-12 border border-stone-200 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-brand-coral mb-4">
              <HiSparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
              Path In Active Preparation
            </h1>
            <p className="text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
              We are finalizing the workshop curriculum, practice problem sets, and build projects for this learning pathway.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/she-leads-tech"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-coral hover:bg-[#9e2463] rounded-full shadow-xs transition"
                aria-label="Back to She Leads Tech"
              >
                <span>Explore Live Workshops</span>
              </Link>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition"
              >
                <span>Get Notified on Discord</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
