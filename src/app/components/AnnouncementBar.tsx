import { useState } from "react";
import { Link } from "react-router";
import { HiSparkles, HiXMark, HiArrowRight } from "react-icons/hi2";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-linear-to-r from-[#8a1f55] via-[#b42970] to-[#e8563a] text-white text-xs sm:text-sm py-2.5 px-4 relative z-50 border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-brand-coral font-black text-[0.65rem] uppercase tracking-wider shrink-0 shadow-xs">
            <HiSparkles className="w-3 h-3 animate-spin text-brand-coral" /> NEW INITIATIVE
          </span>
          <p className="truncate font-medium text-white">
            <span className="font-bold text-brand-pink">She Leads Tech Practices:</span> Bi-weekly LeetCode & Problem Solving Series for developers!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/practices"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors border border-white/30"
          >
            Learn More <HiArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Dismiss announcement"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
