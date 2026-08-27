import { Link } from "react-router";
import { FaLinkedin } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { teamMembers } from "../../data";

export function AboutTeamSpotlight() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
              Behind the Movement
            </span>
            <h2 className="text-3xl font-black text-gray-900">Meet the Team</h2>
          </div>
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-coral hover:underline"
          >
            <span>View Full Team & Bios</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.slice(0, 3).map((m) => (
            <div
              key={`about-team-${m.name}`}
              className="bg-stone-50 rounded-3xl p-6 border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{m.name}</h3>
                    <p className="text-xs font-bold text-brand-coral uppercase tracking-wider mt-0.5">{m.role}</p>
                  </div>
                </div>
                {m.tagline && (
                  <p className="text-xs italic text-gray-600 mb-3 bg-white p-2.5 rounded-xl border border-black/5">
                    &ldquo;{m.tagline}&rdquo;
                  </p>
                )}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {m.bio}
                </p>
              </div>

              {m.linkedinUrl && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${m.name}'s LinkedIn profile`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a66c2] hover:underline"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-coral text-brand-coral font-bold text-sm hover:bg-pink-50 transition-colors shadow-xs"
          >
            <span>Meet all team members</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
