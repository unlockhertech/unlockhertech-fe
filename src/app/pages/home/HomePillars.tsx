import { Link } from "react-router";
import {
  HiCodeBracket,
  HiCalendarDays,
  HiOutlineMusicalNote,
  HiUsers,
  HiArrowRight,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface HomePillarsProps {
  enableGetInvolved: boolean;
}

export function HomePillars({ enableGetInvolved }: HomePillarsProps) {
  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Two Pillars, One Inclusive Tech Community
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We bridge inspirational leadership stories with practical, career-defining engineering skills.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pillar 1: She Leads Tech Practices */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-brand-coral border border-pink-100 flex items-center justify-center mb-6">
                <HiCodeBracket className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral text-[0.7rem] font-extrabold uppercase tracking-wider mb-3">
                <HiCalendarDays className="w-3.5 h-3.5" /> Fortnightly Live
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                She Leads Tech Practices
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Interactive problem-solving workshops and live group coding sessions. Build algorithmic confidence and solve technical problems together in a welcoming, low-pressure environment.
              </p>
            </div>

            <Link
              to="/practices"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-coral hover:gap-3 transition-all pt-4 border-t border-gray-100"
            >
              <span>Learn about practices</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: The Podcast */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue border border-blue-100 flex items-center justify-center mb-6">
                <HiOutlineMusicalNote className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[0.7rem] font-extrabold uppercase tracking-wider mb-3">
                Monthly Drops
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                The Podcast
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Unfiltered, in-depth conversations with women and non-binary leaders across engineering, product, cybersecurity, and startups.
              </p>
            </div>

            <Link
              to="/episodes"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:gap-3 transition-all pt-4 border-t border-gray-100"
            >
              <span>Browse all episodes</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Community & Mentorship */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-green border border-emerald-100 flex items-center justify-center mb-6">
                <HiUsers className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-brand-green text-[0.7rem] font-extrabold uppercase tracking-wider mb-3">
                {enableGetInvolved ? "Get Involved" : "Community"}
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                Mentorship & Connection
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {enableGetInvolved
                  ? "Share knowledge as a practice lead, guest speaker, or community partner. We foster genuine connections that open doors across the industry."
                  : "Connect with like-minded peers, mentors, and allies. We foster genuine connections that open doors and empower everyone across the industry."}
              </p>
            </div>

            <Link
              to={enableGetInvolved ? "/get-involved" : "/about"}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:gap-3 transition-all pt-4 border-t border-gray-100"
            >
              <span>{enableGetInvolved ? "Get involved with us" : "Learn more about us"}</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
