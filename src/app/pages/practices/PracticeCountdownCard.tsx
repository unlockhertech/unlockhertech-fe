import { Link } from "react-router";
import {
  HiCalendarDays,
  HiCodeBracket,
  HiArrowTopRightOnSquare,
  HiBell,
  HiSparkles,
} from "react-icons/hi2";
import { usePracticeCountdown } from "./usePracticeCountdown";
import { trackEvent } from "../../utils/analytics";
import { BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";

interface PracticeCountdownCardProps {
  customTargetDate?: Date;
}

export function PracticeCountdownCard({ customTargetDate }: PracticeCountdownCardProps) {
  const {
    days,
    hours,
    minutes,
    seconds,
    isLive,
    topic,
    sessionNumber,
    formattedDate,
    formattedTime,
    googleCalendarUrl,
  } = usePracticeCountdown(customTargetDate);

  const handleCalendarClick = () => {
    trackEvent("add_to_calendar", "Practices", topic);
  };

  const handleRsvpClick = () => {
    trackEvent("click_practice_rsvp", "Practices", `Session #${sessionNumber} - ${topic}`);
  };

  return (
    <section
      data-testid="practice-countdown-section"
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-14"
    >
      <div className="relative rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        {/* Signature 5-Color Accent Palette Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          {[BERRY, ORANGE, PINK, GREEN, BLUE].map((color, idx) => (
            <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Soft brand corner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left Column: Context & Topic Spotlight */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral border border-pink-200 text-xs font-black uppercase tracking-wider">
                <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-ping" : "bg-brand-coral animate-pulse"}`} />
                {isLive ? "Live Now" : `Session #${sessionNumber} Countdown`}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Fortnightly Live Series
              </span>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-coral flex items-center gap-1">
                <HiSparkles className="w-3.5 h-3.5" />
                Next Topic Spotlight
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 leading-snug">
                {topic}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
              <HiCalendarDays className="w-4 h-4 text-brand-coral shrink-0" />
              <span>{formattedDate} • {formattedTime}</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Interactive collaborative live coding session. We break down the algorithmic pattern, code the solution together step-by-step, and practice mock technical interview discussions in a supportive peer space.
            </p>
          </div>

          {/* Right Column: Live Clock Digits & Action CTAs */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center space-y-6">
            {isLive ? (
              /* Live in progress state */
              <div className="w-full bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center shadow-inner">
                <div className="inline-flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Workshop is Live in Progress!</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 mb-3">
                  We are coding {topic} right now!
                </h3>
                <Link
                  to="/events"
                  onClick={handleRsvpClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md hover:scale-105"
                >
                  <HiCodeBracket className="w-5 h-5" />
                  <span>Join Live Workshop</span>
                </Link>
              </div>
            ) : (
              /* Warm Brand Countdown Clock Grid */
              <div
                data-testid="countdown-digits-grid"
                className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-md text-center"
              >
                {/* Days */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col justify-center">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 font-mono tracking-tight">
                    {String(days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-stone-500 uppercase tracking-wider mt-1">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col justify-center">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-coral font-mono tracking-tight">
                    {String(hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-stone-500 uppercase tracking-wider mt-1">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col justify-center">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-blue font-mono tracking-tight">
                    {String(minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-stone-500 uppercase tracking-wider mt-1">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="bg-pink-50/60 border border-brand-pink/50 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col justify-center">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-coral font-mono tracking-tight">
                    {String(seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-brand-coral uppercase tracking-wider mt-1">
                    Secs
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center lg:justify-end">
              <Link
                to="/events"
                onClick={handleRsvpClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <HiBell className="w-4 h-4" />
                <span>RSVP & Get Workshop Link</span>
              </Link>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCalendarClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Add to Google Cal</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-stone-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
