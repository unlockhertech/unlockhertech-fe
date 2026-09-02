import { Link } from "react-router";
import { HiOutlineUsers } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";

const PALETTE_DOTS = [
  { id: "dot-berry", c: BERRY },
  { id: "dot-orange", c: ORANGE },
  { id: "dot-pink", c: PINK },
  { id: "dot-green", c: GREEN },
  { id: "dot-blue", c: BLUE },
];

export function TeamHeroHeader() {
  return (
    <header className="relative py-16 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Team</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-2xl bg-white/15">
            <HiOutlineUsers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
            Meet the Team
          </h1>
        </div>
        <p className="text-white/80 max-w-140 leading-[1.8] text-base">
          The passionate minds united by one mission — amplifying women, non-binary technologists, and allies in tech, and building technical confidence together.
        </p>

        {/* Colour dots */}
        <div className="flex gap-2 mt-6">
          {PALETTE_DOTS.map((dot) => (
            <div key={dot.id} className="w-3 h-3 rounded-full bg-white opacity-60" />
          ))}
        </div>
      </div>
    </header>
  );
}
