import { FaDiscord } from "react-icons/fa6";
import { HiArrowRight, HiChatBubbleLeftRight, HiCodeBracket, HiBriefcase, HiSparkles } from "react-icons/hi2";
import { Link } from "react-router";
import { DISCORD_INVITE_URL } from "../../data";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

const DISCORD_CHANNELS = [
  {
    id: "she-leads-tech",
    icon: HiCodeBracket,
    name: "#she-leads-tech",
    description: "Pair programming, workshop discussions & LeetCode study groups.",
    badgeColor: "bg-pink-50 text-brand-coral border-pink-200",
  },
  {
    id: "podcast-chat",
    icon: HiChatBubbleLeftRight,
    name: "#podcast-discussion",
    description: "Debrief episodes, ask guest questions & suggest future topics.",
    badgeColor: "bg-blue-50 text-brand-blue border-blue-200",
  },
  {
    id: "job-opportunities",
    icon: HiBriefcase,
    name: "#job-opportunities",
    description: "Transparent salary job leads, hiring manager intros & referrals.",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    id: "intros-networking",
    icon: HiSparkles,
    name: "#intros-and-networking",
    description: "Connect with other women in tech, non-binary technologists & allies worldwide.",
    badgeColor: "bg-emerald-50 text-brand-green border-emerald-200",
  },
];

export function HomeDiscordBanner() {
  return (
    <section id="discord-community" className="py-20 bg-stone-50 border-b border-gray-200/80 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Container */}
        <div className="bg-gradient-to-br from-[#5865F2]/10 via-white to-pink-50/40 rounded-3xl p-8 sm:p-12 border border-[#5865F2]/25 shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5865F2]/15 text-[#5865F2] text-xs font-black uppercase tracking-wider mb-4 border border-[#5865F2]/20">
              <FaDiscord className="w-4 h-4" />
              <span>Official Community Launch • Now Live</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Connect, Collaborate & Grow on{" "}
              <span className="text-[#5865F2]">Discord</span>
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Learning and accelerating your tech career is faster together. Join our safe, moderated Discord community for women, non-binary professionals, and allies across the global tech ecosystem.
            </p>
          </div>

          {/* Channel Highlight Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {DISCORD_CHANNELS.map(({ id, icon: Icon, name, description, badgeColor }) => (
              <div
                key={id}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs flex flex-col justify-between hover:border-[#5865F2]/40 transition-colors"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${badgeColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900 mb-1">{name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Unlock Her Tech Discord Server"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FaDiscord className="w-5 h-5" />
              <span>Join Discord Community</span>
            </a>

            <Link
              to="/community-guidelines"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-stone-50 border border-gray-200 text-gray-700 font-bold text-sm transition-colors"
            >
              <span>Community Guidelines</span>
              <HiArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
