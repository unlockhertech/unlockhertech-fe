import { Link } from "react-router";
import {
  HiCalendar,
  HiGift,
  HiLockClosed,
  HiCheckCircle,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface ResourcesHeroHeaderProps {
  userEmail: string | null;
  onClearEmail: () => void;
}

export function ResourcesHeroHeader({ userEmail, onClearEmail }: ResourcesHeroHeaderProps) {
  return (
    <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white mb-12">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Resources</span>
        </div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <HiCalendar className="w-4 h-4 text-brand-yellow" />
            <span>Launching September 7, 2026 • 1 New PDF Every Week</span>
          </div>

          <h1
            className="text-white font-black leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Career Transition <br />
            <span className="text-brand-yellow">Playbooks & Guides</span>
          </h1>

          <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
            Clean, practical PDF guides created specifically for career changers, non-tech pivoters, and ambitious women in technology. Weekly uploads launch <strong>September 7, 2026</strong>!
          </p>

          {/* TRUST BADGES BAR */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-white/90">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <HiCalendar className="w-4 h-4 text-brand-yellow" />
              <span>🚀 Launches Sep 7, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <HiGift className="w-4 h-4 text-brand-green" />
              <span>PDFs 1–3 Open Access (No Login)</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <HiLockClosed className="w-4 h-4 text-brand-pink" />
              <span>PDF 4+ Community Access</span>
            </div>
          </div>

          {/* User Community Status Badge */}
          {userEmail && (
            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/25 text-emerald-100 text-xs font-bold backdrop-blur-md border border-emerald-400/40 shadow-sm">
                <HiCheckCircle className="w-4.5 h-4.5 text-emerald-300" />
                <span>Community Member: {userEmail}</span>
                <button
                  type="button"
                  onClick={onClearEmail}
                  className="underline ml-1 text-white hover:text-stone-200 cursor-pointer"
                >
                  (Change)
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
