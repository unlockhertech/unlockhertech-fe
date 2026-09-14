import { HiChevronRight, HiSparkles, HiUserGroup } from "react-icons/hi2";
import { BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";

interface ResourceLaunchBannerProps {
  onNotifyClick: () => void;
}

export function ResourceLaunchBanner({ onNotifyClick }: Readonly<ResourceLaunchBannerProps>) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        {/* Signature 5-Colour Accent Palette Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          {[BERRY, ORANGE, PINK, GREEN, BLUE].map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Soft brand corner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
          <div className="space-y-3.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral border border-pink-200 text-xs font-black uppercase tracking-wider">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>All-In-One Toolkit</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              Unlock the Complete 10-Guide Suite
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              All 10 playbooks are live now! Guides 1–3 are 100% open for direct download. Enter your email once to instantly unlock guides 4–10, plus bonus portfolio templates and AI prompts.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-600">
                <HiUserGroup className="w-4 h-4 text-brand-coral" />
                <span>Trusted by hundreds of women switching into tech.</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNotifyClick}
            className="shrink-0 px-8 py-3.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-extrabold text-sm transition-all shadow-md motion-safe:hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Unlock 10-Pack (PDF)</span>
            <HiChevronRight className="w-4 h-4 motion-safe:group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
