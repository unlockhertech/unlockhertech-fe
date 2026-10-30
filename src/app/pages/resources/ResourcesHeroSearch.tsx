import { Link } from "react-router";
import {
  HiSparkles,
  HiGift,
  HiLockClosed,
  HiCheckCircle,
  HiBookmark,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface ResourcesHeroSearchProps {
  userEmail: string | null;
  onChangeEmail: () => void;
  totalCount: number;
  bookmarkedCount?: number;
  showSavedOnly?: boolean;
  onToggleSavedOnly?: (saved: boolean) => void;
}

export function ResourcesHeroSearch({
  userEmail,
  onChangeEmail,
  totalCount,
  bookmarkedCount = 0,
  showSavedOnly = false,
  onToggleSavedOnly,
}: Readonly<ResourcesHeroSearchProps>) {
  return (
    <header className="relative pt-12 pb-14 lg:pt-16 lg:pb-18 overflow-hidden bg-brand-coral text-white mb-8">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-4 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Resources Hub</span>
        </nav>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <HiSparkles className="w-4 h-4 text-brand-yellow" />
            <span>Free Community Library • {totalCount} Technical & Career Resources</span>
          </div>

          <h1
            className="text-white font-black leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.25rem)" }}
          >
            Technical & Career <br />
            <span className="text-brand-yellow">Resources Hub</span>
          </h1>

          <p className="text-white/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
            Practical playbooks, architecture cheatsheets, interactive assessment tools, and video workshops—built for career switchers, engineers, and ambitious tech leaders.
          </p>

          {/* TRUST BADGES BAR & BOOKMARK QUICK TOGGLE */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-white/90">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <HiGift className="w-4 h-4 text-brand-green" />
              <span>PDFs 1–3 Open Access</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <HiLockClosed className="w-4 h-4 text-brand-pink" />
              <span>PDF 4+ Community Access</span>
            </div>
            {bookmarkedCount > 0 && onToggleSavedOnly && (
              <button
                type="button"
                onClick={() => onToggleSavedOnly(!showSavedOnly)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                  showSavedOnly
                    ? "bg-brand-yellow text-gray-950 border-brand-yellow shadow-md"
                    : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                }`}
                aria-pressed={showSavedOnly}
              >
                <HiBookmark className="w-4 h-4" />
                <span>
                  Saved Resources ({bookmarkedCount})
                </span>
              </button>
            )}
          </div>

          {/* Cross-link to Self-Assessment */}
          <p className="pt-1 text-sm text-white/85 font-medium">
            Not sure where to start?{" "}
            <Link to="/assessment" className="text-brand-yellow font-bold hover:underline">
              Take our 2-minute readiness self-assessment
            </Link>{" "}
            to get personalized resource matches.
          </p>

          {/* User Community Status Badge */}
          {userEmail && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/25 text-emerald-100 text-xs font-bold backdrop-blur-md border border-emerald-400/40 shadow-xs">
                <HiCheckCircle className="w-4.5 h-4.5 text-emerald-300" />
                <span>Community Member: {userEmail}</span>
                <button
                  type="button"
                  onClick={onChangeEmail}
                  className="underline ml-1 text-white hover:text-stone-200 cursor-pointer"
                >
                  Switch email
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
