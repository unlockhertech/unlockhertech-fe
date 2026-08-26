import { Link } from "react-router";
import {
  HiAcademicCap,
  HiCodeBracket,
  HiCalendarDays,
  HiArrowRight,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { imgSheLeadsTech } from "../../data";

export function HomeSheLeadsTechBanner() {
  return (
    <section className="py-16 bg-brand-coral text-white relative overflow-hidden">
      <BrandPatternOverlay />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-md opacity-85" />
              <div className="relative bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden border border-white/20 aspect-square flex items-center justify-center">
                <img
                  src={imgSheLeadsTech}
                  alt="She Leads Tech Practices Banner"
                  className="w-full h-full max-h-64 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              <HiAcademicCap className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Signature Community Series</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 text-white">
              Master Algorithms in a <br className="hidden sm:inline" />
              <span className="text-brand-pink">Supportive Environment</span>
            </h2>

            <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed max-w-2xl font-medium">
              No judgment, no competitive stress. Just friendly pair programming, algorithm deconstructions, and structured practice every two weeks.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiCodeBracket className="w-4 h-4 text-brand-yellow" /> Two Pointers & Sliding Window
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiAcademicCap className="w-4 h-4 text-brand-blue" /> Trees & Graph Traversals
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiCalendarDays className="w-4 h-4 text-brand-green" /> Every 2 Weeks
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/practices"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Practice Details</span>
                <HiArrowRight className="w-4 h-4 text-brand-coral" />
              </Link>
              <Link
                to="/events"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold transition-all flex items-center justify-center gap-2 text-sm"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
