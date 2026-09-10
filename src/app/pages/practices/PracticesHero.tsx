import { Link } from "react-router";
import { HiCodeBracket, HiCalendarDays, HiBell, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { imgSheLeadsTech } from "../../data";

export function PracticesHero() {
  return (
    <header className="relative bg-brand-coral text-white overflow-hidden py-20 lg:py-24">
      <BrandPatternOverlay />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left text column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-sm font-semibold mb-6">
              <HiCodeBracket className="w-4 h-4 text-brand-yellow" />
              <span>Technical Excellence Pillar · She Leads Tech</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 text-white">
              She Leads Tech
            </h1>
            <p className="text-xl sm:text-2xl font-black text-brand-pink tracking-wide mb-6">
              Theory • Practice • Review
            </p>

            <p className="text-lg sm:text-xl text-white/90 font-medium mb-6 leading-relaxed max-w-2xl">
              Interactive technical workshops designed to build deep engineering understanding and coding confidence. Learn concepts through instructor-led <strong>Theory</strong>, apply what you know in hands-on <strong>Practice</strong>, and solidify mastery in <strong>Review</strong> sessions.
            </p>

            {/* Live Session Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/25 text-xs sm:text-sm font-semibold mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse shrink-0" />
              <span>
                <strong>Live on Luma:</strong> Current sessions are <em>Theoretical (Theory)</em> with live walkthroughs!
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 flex-wrap">
              <Link
                to="/events"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <HiCalendarDays className="w-5 h-5 text-brand-coral" />
                View Upcoming Sessions
              </Link>
              <a
                href="https://luma.com/sheleadstechpractice"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md cursor-pointer"
              >
                <HiBell className="w-5 h-5 text-brand-yellow" />
                <span>Subscribe on Luma</span>
                <HiArrowTopRightOnSquare className="w-4 h-4 opacity-80" />
              </a>
              {import.meta.env.VITE_ENABLE_GET_INVOLVED === "true" && (
                <Link
                  to="/get-involved"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold transition-all flex items-center justify-center gap-2"
                >
                  Lead a Session / Mentor
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/80 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"/>Held live fortnightly
              </span>
              <span>•</span>
              <span>DSA, System Design & Full-Stack</span>
              <span>•</span>
              <span>Safe, Zero-Ego Space</span>
            </div>
          </div>

          {/* Right Logo / Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-lg opacity-85 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20 text-neutral-900 flex flex-col items-center">
                <div className="w-full aspect-square max-w-65 mx-auto flex items-center justify-center p-3 rounded-2xl mb-4">
                  <img
                    src={imgSheLeadsTech}
                    alt="She Leads Tech Logo"
                    width={260}
                    height={260}
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-coral bg-brand-pink/20 px-3 py-1 rounded-full">
                    Three Learning Formats
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2.5">
                    Theory • Practice • Review
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Current live sessions: Theoretical
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
