import { Link } from "react-router";
import { HiBolt, HiArrowRight } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { imgSheLeadsTech } from "../../data";

export function EventsFeaturedBanner() {
  return (
    <section className="bg-brand-coral text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 overflow-hidden relative">
      <BrandPatternOverlay />

      <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
        <div className="md:col-span-4 flex justify-center">
          <div className="relative max-w-[240px] sm:max-w-[260px] w-full">
            <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-2xl blur-sm opacity-80" />
            <div className="relative bg-white rounded-2xl p-4 border border-white/20 shadow-md aspect-square flex items-center justify-center">
              <img
                src={imgSheLeadsTech}
                alt="She Leads Tech Practices"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3">
            <HiBolt className="w-3.5 h-3.5 text-brand-yellow" /> Featured Initiative
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
            She Leads Tech Practices: LeetCode & Problem Solving Series
          </h2>
          <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
            Ongoing series held every two weeks. Join live interactive sessions to solve problems together, pair program, and master technical interview patterns in a supportive environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/practices"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold text-sm transition-all shadow-md hover:-translate-y-0.5"
            >
              <span>Learn More & View Details</span>
              <HiArrowRight className="w-4 h-4 text-brand-coral" />
            </Link>
            {import.meta.env.VITE_ENABLE_GET_INVOLVED === "true" && (
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm transition-all"
              >
                Lead a Practice Session
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
