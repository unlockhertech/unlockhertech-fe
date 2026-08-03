import React, { useState } from "react";
import { Link } from "react-router";
import { HiSparkles, HiXMark, HiArrowRight } from "react-icons/hi2";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-linear-to-r from-purple-950 via-neutral-900 to-brand-coral text-white text-xs sm:text-sm py-2.5 px-4 relative z-50 border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-coral text-white font-black text-[0.65rem] uppercase tracking-wider shrink-0">
            <HiSparkles className="w-3 h-3 animate-spin" /> NEW INITIATIVE
          </span>
          <p className="truncate font-medium">
            <span className="font-bold text-pink-200">She Leads Tech Practices:</span> Bi-weekly LeetCode & Problem Solving Series for developers!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/practices"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors border border-white/20"
          >
            Learn More <HiArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Dismiss announcement"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
