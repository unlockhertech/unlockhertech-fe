import { Link } from "react-router";
import { HiOutlineUsers } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function AboutHeroHeader() {
  return (
    <div className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">About</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
          <HiOutlineUsers className="w-4 h-4 text-brand-yellow" />
          <span>Built by Tech Professionals, for Tech Professionals</span>
        </div>
        <h1 className="text-white mb-4 font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
          About Unlock Her Tech
        </h1>
        <p className="text-white/80 max-w-140 leading-[1.8] text-base sm:text-lg">
          Where authentic storytelling meets hands-on technical growth. We amplify underrepresented voices, break down engineering barriers, and build confidence together.
        </p>
      </div>
    </div>
  );
}
