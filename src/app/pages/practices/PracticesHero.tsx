import { Link } from "react-router";
import { HiCodeBracket, HiCalendarDays } from "react-icons/hi2";
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
              <span>Hands-On Engineering Community</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white">
              She Leads Tech <br />
              <span className="text-brand-pink">
                Practices
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 font-medium mb-8 leading-relaxed max-w-2xl">
              Fortnightly live LeetCode and problem-solving workshops designed to build coding confidence, master algorithmic patterns, and ace technical interviews together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/events"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <HiCalendarDays className="w-5 h-5 text-brand-coral" />
                View Upcoming Sessions
              </Link>
              {import.meta.env.VITE_ENABLE_GET_INVOLVED === "true" && (
                <Link
                  to="/get-involved"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold transition-all flex items-center justify-center gap-2"
                >
                  Lead a Session / Mentor
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/80 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                Held every 2 weeks live
              </span>
              <span>•</span>
              <span>Beginner to Intermediate Friendly</span>
              <span>•</span>
              <span>Collaborative Live Coding</span>
            </div>
          </div>

          {/* Right Logo / Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-lg opacity-85 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20 text-neutral-900 flex flex-col items-center">
                <div className="w-full aspect-square max-w-[260px] mx-auto flex items-center justify-center p-3 rounded-2xl mb-4">
                  <img
                    src={imgSheLeadsTech}
                    alt="She Leads Tech Practices Logo"
                    width={260}
                    height={260}
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-coral bg-brand-pink/20 px-3 py-1 rounded-full">
                    Live Problem-Solving Series
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2.5">
                    Build your problem-solving habit together
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
