import { Link } from "react-router";
import { HiCalendarDays } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface EventsHeroHeaderProps {
  upcomingCount: number;
}

export function EventsHeroHeader({ upcomingCount }: EventsHeroHeaderProps) {
  return (
    <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Events</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-2xl bg-white/15">
            <HiCalendarDays className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
            Community Events
          </h1>
        </div>
        <p className="text-white/80 max-w-140 leading-[1.8] text-base sm:text-lg">
          Hands-on LeetCode practices, technical workshops, and inspiring community conversations.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-pink">
            {upcomingCount} Upcoming
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-yellow">
            Fortnightly Practices
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-blue">
            Virtual & Live
          </span>
        </div>
      </div>
    </header>
  );
}
