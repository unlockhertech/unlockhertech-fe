import { Link } from "react-router";
import {
  HiShieldCheck,
  HiCheckBadge,
  HiMapPin,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function JobsHeroHeader() {
  return (
    <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">Inclusive Job Board</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
              <HiShieldCheck className="w-4 h-4 text-brand-yellow" />
              <span>Curated & Transparent Tech Careers</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight leading-[1.15]">
              Tech Jobs with <span className="text-brand-yellow">Inclusive Cultures</span>
            </h1>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl font-normal">
              Curated technical and product opportunities centered on women in tech and supportive allies. Every role
              is vetted for mandatory salary transparency, flexible work, and culture integrity.
            </p>

            {/* Quality Standards Highlights */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/25 text-emerald-100 border border-emerald-400/30">
                <HiCheckBadge className="w-4 h-4 text-brand-yellow" />
                100% Salary Transparent
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                <HiMapPin className="w-3.5 h-3.5 text-white/80" />
                Remote & Flexible Friendly
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                <HiShieldCheck className="w-3.5 h-3.5 text-brand-pink" />
                Vetted Inclusivity Standards
              </span>
            </div>
          </div>

          {/* Header Right Action Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center lg:text-left max-w-sm shrink-0">
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/70 mb-1">
              Employer / Hiring Lead?
            </p>
            <h2 className="text-lg font-bold text-white mb-2">Feature a Vetted Role</h2>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Reach thousands of qualified female engineers, designers, and allies actively building their tech careers.
            </p>
            <Link
              to="/collaborate?tab=job"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-white text-brand-coral font-bold text-xs hover:bg-stone-100 transition-colors shadow-sm"
            >
              <span>Submit a Transparent Role</span>
              <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
