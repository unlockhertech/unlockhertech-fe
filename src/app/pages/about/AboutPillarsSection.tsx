import { Link } from "react-router";
import {
  HiOutlineCodeBracket,
  HiOutlineMicrophone,
  HiCheckCircle,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function AboutPillarsSection() {
  return (
    <section className="py-20 bg-stone-50 border-b border-gray-200/80 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            What We Do Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Two Pillars, Unified Purpose
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            We combine deep technical upskilling with community storytelling to empower technologists at every career inflection point.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pillar 1: Practices */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                <HiOutlineCodeBracket className="w-7 h-7" />
              </div>
              <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Hands-On Engineering
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-4 mb-3">She Leads Tech</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Technical sessions structured across Theory, Practice, and Review. We learn concepts together, solve problems live, and reinforce knowledge across DSA, system design, and software engineering.
              </p>
              <div className="space-y-2 mb-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  <span>Held live</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  <span>Theory, Practice & Review formats</span>
                </div>
              </div>
            </div>
            <Link
              to="/practices"
              className="inline-flex items-center gap-2 font-bold text-sm text-brand-coral hover:underline pt-4 border-t border-gray-100"
            >
              <span>Learn about She Leads Tech</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Podcast */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-brand-coral flex items-center justify-center mb-6">
                <HiOutlineMicrophone className="w-7 h-7" />
              </div>
              <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-brand-coral bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Authentic Stories
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-4 mb-3">The Unlock Her Tech Podcast</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Weekly deep-dive conversations with female founders, staff engineers, AI researchers, and tech allies. Real challenges, authentic lessons, and actionable career advice from people reshaping the industry.
              </p>
              <div className="space-y-2 mb-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                  <span>Weekly long-form episodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-4 h-4 text-brand-coral shrink-0" />
                  <span>Available on Spotify, Apple Podcasts & YouTube</span>
                </div>
              </div>
            </div>
            <Link
              to="/episodes"
              className="inline-flex items-center gap-2 font-bold text-sm text-brand-coral hover:underline pt-4 border-t border-gray-100"
            >
              <span>Listen to podcast episodes</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
