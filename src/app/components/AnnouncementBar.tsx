import { useState } from "react";
import { HiXMark, HiArrowRight } from "react-icons/hi2";
import { FaDiscord } from "react-icons/fa6";
import { DISCORD_INVITE_URL } from "../data";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#5865F2] text-white text-xs sm:text-sm py-2 px-4 relative z-50 border-b border-white/15 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#5865F2] font-black text-[0.65rem] uppercase tracking-wider shrink-0 shadow-xs">
            <FaDiscord className="w-3 h-3 text-[#5865F2]" /> DISCORD LAUNCH
          </span>
          <p className="truncate font-medium text-white">
            <span className="font-bold text-white">We are live on Discord!</span>{" "}
            Join study groups, debrief podcast episodes & connect in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Discord Community"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#5865F2] hover:bg-white/90 font-bold text-xs transition-colors shadow-xs"
          >
            <span>Join Our Discord</span>
            <HiArrowRight className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
