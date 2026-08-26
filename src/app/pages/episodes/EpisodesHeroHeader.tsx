import { Link } from "react-router";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface EpisodesHeroHeaderProps {
  totalEpisodes: number;
}

export function EpisodesHeroHeader({ totalEpisodes }: EpisodesHeroHeaderProps) {
  return (
    <header className="relative py-16 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Episodes</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-2xl bg-white/15">
            <HiOutlineMusicalNote className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
            All Episodes
          </h1>
        </div>
        <p className="text-white/70 max-w-125 leading-[1.75]">
          Every conversation we&apos;ve ever had — search, filter, and find the one that speaks to you.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-pink">
            {totalEpisodes} Episodes
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-yellow">
            Season 1
          </span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-blue">
            Monthly drops
          </span>
        </div>
      </div>
    </header>
  );
}
