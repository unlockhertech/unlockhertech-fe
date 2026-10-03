import { useMemo } from "react";
import { DownloadResourceModal } from "../components/DownloadResourceModal";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { BERRY, ORANGE, PINK, GREEN, BLUE, IMG_AUDIO_EQ } from "../data";
import {
  DEFAULT_RESOURCES,
  RESOURCE_COLLECTIONS,
  TRANSITION_STAGES,
} from "./resources/resourceData";
import { useResources } from "./resources/useResources";
import { ResourcesHeroHeader } from "./resources/ResourcesHeroHeader";
import { ResourceTrackSwitcher } from "./resources/ResourceTrackSwitcher";
import { ResourceCategoryFilter } from "./resources/ResourceCategoryFilter";
import { ResourceLaunchBanner } from "./resources/ResourceLaunchBanner";
import { ResourceAssessmentCallout } from "./resources/ResourceAssessmentCallout";
import { ResourceStageNav } from "./resources/ResourceStageNav";
import { ResourceStageSection } from "./resources/ResourceStageSection";
import { ResourceCard } from "./resources/ResourceCard";
import { ResourceUpcomingSpotlight } from "./resources/ResourceUpcomingSpotlight";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

const RESOURCES_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Unlock Her Tech Career Transition Guides",
  "itemListElement": DEFAULT_RESOURCES.map((r, idx) => ({
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
    resources,
    filteredResources,
    upcomingForCollection,
    isLoading,
    activeCollection,
    setActiveCollection,
    selectedCategory,
    setSelectedCategory,
    selectedFormat,
    setSelectedFormat,
    searchQuery,
    setSearchQuery,
    handleResetFilters,
    userEmail,
    isModalOpen,
    setIsModalOpen,
    activeResource,
    isEarlyAccessMode,
    handleOpenDownload,
    handleSuccessUnlock,
    handleClearUserEmail,
  } = useResources();

  const resourceCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: resources.length,
    };
    resources.forEach((r) => {
      const col = r.collection || "career-toolkit";
      counts[col] = (counts[col] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const activeCollectionMeta = useMemo(() => {
    return RESOURCE_COLLECTIONS.find((c) => c.id === activeCollection);
  }, [activeCollection]);

  const careerToolkitResources = useMemo(() => {
    return filteredResources.filter(
      (r) => (r.collection || "career-toolkit") === "career-toolkit"
    );
  }, [filteredResources]);

  const nonToolkitResources = useMemo(() => {
    return filteredResources.filter(
      (r) => (r.collection || "career-toolkit") !== "career-toolkit"
    );
  }, [filteredResources]);

  const resourcesByStage = useMemo(() => {
    const grouped = new Map<string, typeof careerToolkitResources>();
    TRANSITION_STAGES.forEach((stage) => grouped.set(stage.id, []));
    careerToolkitResources.forEach((item) => {
      const stageId = item.stage ?? "stage1";
      grouped.set(stageId, [...(grouped.get(stageId) ?? []), item]);
    });
    return grouped;
  }, [careerToolkitResources]);

  const showRoadmap = activeCollection === "all" || activeCollection === "career-toolkit";
  const hasNoResults = !isLoading && filteredResources.length === 0;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <ResourcesHeroHeader
        userEmail={userEmail}
        onClearEmail={handleClearUserEmail}
      />

      {/* ── 2a. Multi-Track Collection Switcher ────────────────────────── */}
      <ResourceTrackSwitcher
        activeCollection={activeCollection}
        onSelectCollection={setActiveCollection}
        resourceCounts={resourceCounts}
      />

      {/* ── 2b. Universal Search & Category Filter ─────────────────────── */}
      <ResourceCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── 2c. 4-Stage Transition Quick Nav (Roadmap only) ────────────── */}
      {showRoadmap && <ResourceStageNav />}

      {/* ── 3. All-In-One Bundle Banner ─────────────────────────────────── */}
      {showRoadmap && (
        <ResourceLaunchBanner
          onNotifyClick={() => handleOpenDownload(null, true)}
        />
      )}

      {/* ── 3b. Interactive Assessment Callout Banner ──────────────────── */}
      {showRoadmap && <ResourceAssessmentCallout />}

      {/* ── 4. Main Resource Display ──────────────────────────────────── */}
      <section className="relative overflow-hidden py-4">
        <BrandPatternOverlay variant="watermark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Loading Skeletons */}
          {isLoading && (
            <div className="space-y-14">
              {TRANSITION_STAGES.map((stage) => (
                <div key={stage.id}>
                  <div className="h-7 bg-stone-200 rounded w-64 mb-6 animate-pulse" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[`${stage.id}-a`, `${stage.id}-b`, `${stage.id}-c`].map((slotId) => (
                      <div
                        key={slotId}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 animate-pulse space-y-4"
                      >
                        <div className="w-full aspect-4/3 bg-stone-200 rounded-2xl" />
                        <div className="h-6 bg-stone-200 rounded w-3/4" />
                        <div className="h-4 bg-stone-200 rounded w-full" />
                        <div className="h-4 bg-stone-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Filter State */}
          {!isLoading && hasNoResults && (
            <div className="text-center py-16 px-4">
              <p className="text-lg font-bold text-stone-700 mb-2">No guides match this filter.</p>
              <p className="text-sm text-stone-500 mb-5">
                Try a different category or search term, or reset to see all available guides.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-brand-coral text-white font-extrabold text-xs hover:bg-brand-coral/90 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* 4-Stage Transition Roadmap View */}
          {!isLoading && showRoadmap && careerToolkitResources.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl font-extrabold text-stone-900">
                    The 4-Stage Tech Transition Roadmap
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    All 10 guides are live now, organized across the 4 stages of your journey into tech.
                    Guides 1–3 are completely open access; Guides 4+ are unlocked instantly when you join our community.
                  </p>
                </div>
                <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider bg-stone-200/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                  All 10 Guides Available
                </span>
              </div>

              {TRANSITION_STAGES.map((stage) => (
                <ResourceStageSection
                  key={stage.id}
                  stage={stage}
                  items={resourcesByStage.get(stage.id) ?? []}
                  userEmail={userEmail}
                  onOpenDownload={handleOpenDownload}
                />
              ))}
            </div>
          )}

          {/* Dedicated Catalog View for Non-Toolkit Collections or Extra Resources */}
          {!isLoading && nonToolkitResources.length > 0 && (
            <div className="mt-12">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-stone-900">
                  {activeCollectionMeta?.label ?? "Specialized Engineering & Career Guides"}
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  {activeCollectionMeta?.description ??
                    "In-depth guides, playbooks, and templates beyond the transition roadmap."}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {nonToolkitResources.map((item, idx) => (
                  <ResourceCard
                    key={item.id}
                    item={item}
                    index={idx}
                    userEmail={userEmail}
                    onOpenDownload={handleOpenDownload}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Upcoming Resource Drops Spotlight ───────────────────────── */}
      <ResourceUpcomingSpotlight
        items={upcomingForCollection}
        userEmail={userEmail}
        onOpenDownload={handleOpenDownload}
      />

      {/* Signature Footer Dots */}
      <div className="flex justify-center gap-2 mt-16 mb-16">
        {BRAND_DOTS.map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-full opacity-60" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── 6. Subscribe CTA ───────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />

      {/* ── 7. Download / Notification Modal ───────────────────────────── */}
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
