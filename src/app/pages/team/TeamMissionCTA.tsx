import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";

export function TeamMissionCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-10 text-center bg-linear-to-br from-[#fdf0f7] to-[#f0f6fd] border-2 border-brand-pink">
          <p className="text-xs uppercase tracking-widest mb-3 text-brand-coral font-bold">Be part of the story</p>
          <h2 className="mb-4 text-neutral-900 font-extrabold" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
            Want to Hear From Them?
          </h2>
          <p className="text-gray-500 mb-8 max-w-105 mx-auto leading-[1.75]">
            Tune in to our latest episode and hear the team in action — or subscribe so you never miss what we create next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/episodes"
              aria-label="Listen to Unlock Her Tech podcast episodes"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white transition-all hover:opacity-90 shadow-md bg-brand-coral font-semibold"
            >
              <span>Listen to Our Podcast</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              aria-label="Read about Unlock Her Tech mission"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 transition-all hover:bg-pink-50 border-brand-coral text-brand-coral font-semibold"
            >
              <span>Our Mission</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
