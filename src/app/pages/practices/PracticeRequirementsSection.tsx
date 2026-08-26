import { Link } from "react-router";
import { HiCheckCircle, HiArrowRight } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { REQUIREMENTS } from "./practicesData";

export function PracticeRequirementsSection() {
  return (
    <section id="schedule" className="py-20 bg-white border-t border-gray-200/60 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: What You'll Need */}
          <div className="lg:col-span-6">
            <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm">
              <div className="inline-flex items-center gap-2 text-brand-coral font-bold text-xs uppercase tracking-wider mb-4">
                <span>📌 What You'll Need</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
                Simple Prerequisites
              </h3>
              <div className="space-y-6">
                {REQUIREMENTS.map((req) => (
                  <div key={req.text} className="flex items-start gap-4">
                    <div className="mt-1 p-1 rounded-full bg-emerald-100 text-brand-green shrink-0">
                      <HiCheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{req.text}</h4>
                      <p className="text-gray-500 text-sm">{req.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  🛡️ <strong>Safe & Supportive Space</strong>: All attendees and mentors uphold our{" "}
                  <Link to="/community-guidelines" className="text-brand-coral font-bold hover:underline">
                    Community Guidelines & Code of Conduct
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Cadence & Progression */}
          <div className="lg:col-span-6">
            <div className="relative bg-brand-coral text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/20 overflow-hidden">
              <BrandPatternOverlay />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-950 font-black text-xs uppercase tracking-wider mb-4 shadow-sm">
                  <span>🌱 Fortnightly Progression</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
                  Progressive Skill Growth
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  This is an ongoing series held <strong className="text-white">every two weeks</strong>. We start with Easy and Medium problems, gradually progressing to harder challenges as we build our skills together.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-green text-white font-bold text-xs">Phase 1</span>
                    <span>Easy & Foundational Algorithmic Warmups</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-blue text-white font-bold text-xs">Phase 2</span>
                    <span>Medium Level Core Interview Patterns</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-yellow text-neutral-900 font-bold text-xs">Phase 3</span>
                    <span>Advanced Problem-Solving & Mock Discussions</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-coral font-bold text-sm hover:bg-white/90 transition-all shadow-sm"
                  >
                    <span>Find Next Session Date</span>
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
