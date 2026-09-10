import { Link } from "react-router";
import { HiOutlineArrowRight, HiUsers } from "react-icons/hi2";
import { teamMembers } from "../../data";

export function AboutTeamSpotlight() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral text-xs font-bold uppercase tracking-wider mb-3">
              <HiUsers className="w-3.5 h-3.5" />
              <span>Behind the Movement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Meet the Leadership & Core Team
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Unlock Her Tech is powered by engineers, community builders, and mentors dedicated to creating an inclusive, high-impact space for women and non-binary people in tech.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
              <div className="flex -space-x-3 overflow-hidden">
                {teamMembers.slice(0, 4).map((m) => (
                  <img
                    key={`about-spotlight-avatar-${m.name}`}
                    src={m.photoUrl}
                    alt={m.name}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-600 pl-1">
                +{teamMembers.length} contributors & mentors
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/team"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Team & Bios</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
