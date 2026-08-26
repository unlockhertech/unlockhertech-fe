import { useMetaData } from "../hooks/useMetaData";
import { useGetInvolvedForm } from "./getInvolved/useGetInvolvedForm";
import { GetInvolvedHeader } from "./getInvolved/GetInvolvedHeader";
import { GetInvolvedTabs } from "./getInvolved/GetInvolvedTabs";
import { GetInvolvedIntroCard } from "./getInvolved/GetInvolvedIntroCard";
import { GetInvolvedForm } from "./getInvolved/GetInvolvedForm";
import { GetInvolvedSuccessBanner } from "./getInvolved/GetInvolvedSuccessBanner";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

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
