import { DownloadResourceModal } from "../components/DownloadResourceModal";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { BERRY, ORANGE, PINK, GREEN, BLUE, IMG_AUDIO_EQ } from "../data";
import { DEFAULT_WEEKLY_RESOURCES } from "./resources/resourceData";
import { useResources } from "./resources/useResources";
import { ResourcesHeroHeader } from "./resources/ResourcesHeroHeader";
import { ResourceCategoryFilter } from "./resources/ResourceCategoryFilter";
import { ResourceLaunchBanner } from "./resources/ResourceLaunchBanner";
import { ResourceAssessmentCallout } from "./resources/ResourceAssessmentCallout";
import { ResourceCard } from "./resources/ResourceCard";
import { ResourceSneakPeekCard } from "./resources/ResourceSneakPeekCard";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

const RESOURCES_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Unlock Her Tech Career Transition Guides",
  "itemListElement": DEFAULT_WEEKLY_RESOURCES.map((r, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": {
      "@type": "DigitalDocument",
      "name": r.title,
      "description": r.description,
      "url": `https://unlockhertech.com/resources#${r.slug}`,
      "fileFormat": "application/pdf",
      "isAccessibleForFree": true,
      "publisher": {
        "@type": "Organization",
        "name": "Unlock Her Tech",
        "url": "https://unlockhertech.com",
      },
    },
  })),
};

const BRAND_DOTS = [BERRY, ORANGE, PINK, GREEN, BLUE];

export function ResourcesPage() {
  useMetaData(
    "Career Playbooks & PDF Guides | Unlock Her Tech",
    "Free bite-sized PDF guides and career frameworks for career changers, non-tech pivoters, and ambitious women in technology.",
    undefined,
    {
      image: "/logo.png",
      type: "website",
      jsonLd: RESOURCES_META_JSON_LD,
    }
  );

  const {
    filteredResources,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    userEmail,
    now,
    isModalOpen,
    setIsModalOpen,
    activeResource,
    isEarlyAccessMode,
    handleOpenDownload,
    handleSuccessUnlock,
    handleClearUserEmail,
  } = useResources();

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <ResourcesHeroHeader
        userEmail={userEmail}
        onClearEmail={handleClearUserEmail}
      />

      {/* ── 2. Category Filter Pills ───────────────────────────────────── */}
      <ResourceCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ── 3. September 7 Launch Banner ───────────────────────────────── */}
      <ResourceLaunchBanner
        onNotifyClick={() => handleOpenDownload(null, true)}
      />

      {/* ── 3b. Interactive Assessment Callout Banner ──────────────────── */}
      <ResourceAssessmentCallout />

      {/* ── 4. Weekly Resource Card Grid ───────────────────────────────── */}
      <section className="relative overflow-hidden py-4">
        <BrandPatternOverlay variant="watermark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">Upcoming Weekly Drop Schedule</h2>
            <p className="text-stone-500 text-sm mt-1">
              1 new guide released every week starting September 7, 2026. First 3 guides are completely open access; Guides 4+ are exclusive to our community members.
            </p>
          </div>
          <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider bg-stone-200/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            Starting Sep 7, 2026
          </span>
        </div>

        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {["skeleton-card-1", "skeleton-card-2", "skeleton-card-3"].map((slotId) => (
              <div key={slotId} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 animate-pulse space-y-4">
                <div className="w-full aspect-4/3 bg-stone-200 rounded-2xl" />
                <div className="h-6 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-full" />
                <div className="h-4 bg-stone-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Published Weekly Resources */}
            {filteredResources.map((item, index) => (
              <ResourceCard
                key={item.id}
                item={item}
                index={index}
                now={now}
                userEmail={userEmail}
                onOpenDownload={handleOpenDownload}
              />
            ))}

            {/* Week 6 Sneak-Peek Card */}
            <ResourceSneakPeekCard
              onNotifyClick={() => handleOpenDownload(null, true)}
            />
          </div>
        )}
        </div>
      </section>

      {/* Signature Footer Dots */}
      <div className="flex justify-center gap-2 mt-16 mb-16">
        {BRAND_DOTS.map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-full opacity-60" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── 5. Subscribe CTA ───────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />

      {/* ── 6. Download / Notification Modal ───────────────────────────── */}
      <DownloadResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={activeResource}
        isEarlyAccessMode={isEarlyAccessMode}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </div>
  );
}
