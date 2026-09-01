import { HiBell, HiChevronRight, HiSparkles, HiClock } from "react-icons/hi2";
import { BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";
import { usePlaybookCountdown } from "./usePlaybookCountdown";

interface ResourceLaunchBannerProps {
  onNotifyClick: () => void;
}

export function ResourceLaunchBanner({ onNotifyClick }: Readonly<ResourceLaunchBannerProps>) {
  const { days, hours, minutes, seconds, isLaunched, formattedTargetDate } = usePlaybookCountdown();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative rounded-3xl bg-linear-to-br from-[#8a1f55] via-[#b42970] to-[#e8563a] p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-xl border border-white/20">
        {/* Signature 5-Color Accent Palette Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          {[BERRY, ORANGE, PINK, GREEN, BLUE].map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Background glow accents */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-brand-pink/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Weekly Drop Roadmap</span>
              </span>
              <span className="text-xs text-white/80 font-medium">
                {isLaunched ? "Next Weekly Drop" : "Official Launch Countdown"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {isLaunched
                ? "Next Playbook Drop Coming Soon"
                : "Weekly Uploads Begin September 7, 2026"}
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              We are releasing 1 actionable PDF playbook every week! Guides 1, 2, and 3 will be <strong>100% open for direct download</strong>. Enter your email to be alerted the second each drop goes live!
            </p>

            <div className="flex items-center gap-2 text-xs text-white/80 font-semibold pt-1">
              <HiClock className="w-4 h-4 text-brand-yellow" />
              <span>Target Drop Date: {formattedTargetDate} (09:00 UK Time)</span>
            </div>
          </div>

          {/* Right Countdown & CTA column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center space-y-5">
            {/* Live Playbook Countdown Grid */}
            <div
              data-testid="playbook-countdown-grid"
              className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-sm text-center"
            >
              {/* Days */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(days).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider mt-0.5">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-brand-yellow font-mono">
                  {String(hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider mt-0.5">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {String(minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider mt-0.5">
                  Mins
                </span>
              </div>

              {/* Seconds */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-brand-pink font-mono">
                  {String(seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider mt-0.5">
                  Secs
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col items-center lg:items-end gap-2 w-full max-w-sm">
              <button
                type="button"
                onClick={onNotifyClick}
                className="w-full px-8 py-3.5 rounded-full bg-white hover:bg-white/95 text-brand-coral font-black text-sm transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <HiBell className="w-5 h-5 text-brand-coral" />
                <span>{isLaunched ? "Get Notified for Next Drop" : "Notify Me on September 7"}</span>
                <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-white/80 text-[11px] font-medium text-center lg:text-right">
                1 Playbook Every Week • 100% Free Direct Access • Zero Spam
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
