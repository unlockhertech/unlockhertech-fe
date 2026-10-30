import { useMetaData } from "../hooks/useMetaData";
import { useGetInvolvedForm } from "./getInvolved/useGetInvolvedForm";
import { GetInvolvedHeader } from "./getInvolved/GetInvolvedHeader";
import { GetInvolvedTabs } from "./getInvolved/GetInvolvedTabs";
import { GetInvolvedIntroCard } from "./getInvolved/GetInvolvedIntroCard";
import { GetInvolvedForm } from "./getInvolved/GetInvolvedForm";
import { GetInvolvedSuccessBanner } from "./getInvolved/GetInvolvedSuccessBanner";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";
import { FaDiscord } from "react-icons/fa6";
import { DISCORD_INVITE_URL } from "../data";

const GET_INVOLVED_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Get Involved with Unlock Her Tech",
  "description": "Volunteer as a LeetCode mentor, apply as a podcast guest speaker, submit a transparent tech job, or collaborate as an organizational partner.",
  "url": "https://unlockhertech.com/get-involved",
};

export function GetInvolvedPage() {
  const {
    activeTab,
    metaTitle,
    submitted,
    formData,
    handleChange,
    handleTabClick,
    handleSubmit,
    handleResetForm,
  } = useGetInvolvedForm();

  useMetaData(
    metaTitle,
    "Become a LeetCode practice mentor, apply as a podcast speaker, submit a transparent job posting, or partner with Unlock Her Tech to champion women and allies in technology.",
    "https://unlockhertech.com/get-involved",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: GET_INVOLVED_META_JSON_LD,
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen pb-24 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <GetInvolvedHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* ── Tab Switcher ──────────────────────────────────────────────── */}
        <GetInvolvedTabs activeTab={activeTab} onTabClick={handleTabClick} />

        {/* ── Tab Intro & Form Card ─────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs mb-8">
          <GetInvolvedIntroCard activeTab={activeTab} />

          {submitted ? (
            <GetInvolvedSuccessBanner activeTab={activeTab} onReset={handleResetForm} />
          ) : (
            <GetInvolvedForm
              activeTab={activeTab}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* ── Discord Community Callout ─────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#5865F2]/10 via-white to-pink-50/40 rounded-3xl p-6 sm:p-8 border border-[#5865F2]/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/15 text-[#5865F2] text-xs font-black uppercase tracking-wider mb-2">
              <FaDiscord className="w-4 h-4" />
              <span>Join our Community Server</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Want to connect and collaborate in real-time?
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xl">
              Hop into our official Discord server to find study buddies, ask technical questions, discuss podcast episodes, and connect with mentors and peers.
            </p>
          </div>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Unlock Her Tech Discord Server"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm shadow-sm transition-colors shrink-0"
          >
            <FaDiscord className="w-4 h-4" />
            <span>Join Discord</span>
          </a>
        </div>

        {/* ── Community Note ───────────────────────────────────────────── */}
        <div className="text-center p-6 bg-white rounded-3xl border border-gray-200/80">
          <p className="text-gray-500 text-xs sm:text-sm">
            Prefer direct contact? You can always reach the Unlock Her Tech leadership team directly at{" "}
            <a href="mailto:info@unlockhertech.com" className="text-brand-coral font-bold hover:underline">
              info@unlockhertech.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
