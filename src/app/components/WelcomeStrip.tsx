import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi2";
import { Lady1Welcome, Lady2Welcome } from "./Illustrations";
import { BERRY } from "../data";

export function WelcomeStrip() {
  return (
    <section className="overflow-hidden bg-linear-to-br from-[#fdf0f7] to-[#f0f6fd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile layout: text top, illustrations bottom */}
        <div className="flex flex-col items-center sm:hidden py-10 text-center">
          <p className="mb-2 text-brand-coral font-bold text-[0.8rem] tracking-[0.12em] uppercase">
            Welcome to the mic
          </p>
          <h2
            className="mb-3 text-neutral-900 font-extrabold"
            style={{ fontSize: "clamp(1.35rem, 3vw, 1.9rem)" }}
          >
            Every Voice Belongs Here
          </h2>
          <p className="text-gray-500 text-sm mx-auto mb-5 max-w-95 leading-[1.75]">
            Unlock Her Tech is a space built for curious, ambitious women in tech — wherever you are
            in your journey.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80 text-brand-coral font-semibold"
          >
            Learn more about us <HiArrowRight className="w-4 h-4" />
          </Link>
          {/* Two illustrations side by side on mobile */}
          <div className="flex items-end justify-center gap-4 w-full mt-4">
            <div className="w-32 flex-shrink-0">
              <Lady1Welcome className="w-full h-auto" />
            </div>
            <div className="w-32 flex-shrink-0">
              <Lady2Welcome className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Desktop layout: original side-by-side */}
        <div className="hidden sm:flex items-end justify-between gap-4">
          <div className="flex-shrink-0 w-52 -mb-2">
            <Lady1Welcome className="w-full h-auto" />
          </div>

          <div className="flex-1 text-center py-12 px-4">
            <p
              className="mb-2"
              style={{
                color: BERRY,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Welcome to the mic
            </p>
            <h2
              className="mb-3"
              style={{ color: "#1a1a1a", fontSize: "clamp(1.35rem, 3vw, 1.9rem)", fontWeight: 800 }}
            >
              Every Voice Belongs Here
            </h2>
            <p
              className="text-gray-500 text-sm mx-auto mb-5"
              style={{ maxWidth: "380px", lineHeight: 1.75 }}
            >
              Unlock Her Tech is a space built for curious, ambitious women in tech — wherever you are
              in your journey.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: BERRY, fontWeight: 600 }}
            >
              Learn more about us <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-shrink-0 w-52 -mb-2">
            <Lady2Welcome className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
