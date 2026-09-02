import { Link } from "react-router";
import { HiBolt, HiArrowRight, HiCalendarDays, HiArrowTopRightOnSquare } from "react-icons/hi2";
import type { ExternalEvent } from "../../types";
import { imgSheLeadsTech, BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";

interface EventsFeaturedBannerProps {
  event?: ExternalEvent;
}

export function EventsFeaturedBanner({ event: _event }: Readonly<EventsFeaturedBannerProps> = {}) {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-10">
      <div className="relative rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        {/* Signature 5-Color Accent Palette Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          {[BERRY, ORANGE, PINK, GREEN, BLUE].map((color) => (
            <div key={color} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Soft brand corner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left Column: Context & Information */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral border border-pink-200 text-xs font-black uppercase tracking-wider">
                <HiBolt className="w-3.5 h-3.5" />
                Featured Initiative
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Fortnightly Live Series
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 mt-1 leading-snug">
                She Leads Tech Practice: LeetCode & Problem Solving Series
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
              <HiCalendarDays className="w-4 h-4 text-brand-coral shrink-0" />
              <span>Held Every 2 Weeks Live • 70-Minute Hands-On Workshops</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Interactive collaborative live coding session. We break down core algorithmic patterns, solve LeetCode-style challenges together step-by-step, and build technical interview confidence in a supportive, zero-ego space.
            </p>

            <p className="text-[11px] text-stone-500 pt-1">
              ✨ Free, safe & inclusive environment. Beginner to intermediate friendly.
            </p>
          </div>

          {/* Right Column: Visual Graphic & Action CTAs */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
            <div className="relative group max-w-[180px] sm:max-w-[200px] w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-2xl blur-sm opacity-80" />
              <div className="relative bg-white rounded-2xl p-4 border border-stone-200 shadow-md aspect-square flex items-center justify-center">
                <img
                  src={imgSheLeadsTech}
                  alt="She Leads Tech Practice Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-sm justify-center lg:justify-end flex-wrap">
              <Link
                to="/practices"
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Practice</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://luma.com/sheleadstechpractice"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-pink-50 hover:bg-pink-100/80 border border-brand-pink/60 text-brand-berry font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <HiCalendarDays className="w-4 h-4 text-brand-coral" />
                <span>Subscribe on Luma</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-brand-coral/70" />
              </a>

              {import.meta.env.VITE_ENABLE_GET_INVOLVED === "true" && (
                <Link
                  to="/get-involved"
                  className="w-full sm:w-auto px-4 py-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Lead a Session</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
