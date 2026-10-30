import { useMemo } from "react";
import { DownloadResourceModal } from "../components/DownloadResourceModal";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { BERRY, ORANGE, PINK, GREEN, BLUE, IMG_AUDIO_EQ } from "../data";
import { useResources } from "./resources/useResources";
import { ResourcesHeroSearch } from "./resources/ResourcesHeroSearch";
import { ResourceTypeTabs } from "./resources/ResourceTypeTabs";
import { ResourceTopicDropdown } from "./resources/ResourceTopicDropdown";
import { ResourceActiveFilterChips } from "./resources/ResourceActiveFilterChips";
import { UniversalResourceCard } from "./resources/UniversalResourceCard";
import { ResourceFeaturedRow } from "./resources/ResourceFeaturedRow";
import { ResourceCollectionsGrid } from "./resources/ResourceCollectionsGrid";
import { ResourceCollectionView } from "./resources/ResourceCollectionView";
import { ResourceUpcomingSpotlight } from "./resources/ResourceUpcomingSpotlight";
import { ResourceUnlockToast } from "./resources/ResourceUnlockToast";
import { HiSparkles, HiArrowPath, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const BRAND_DOTS = [BERRY, ORANGE, PINK, GREEN, BLUE];

export function ResourcesPage() {
  const {
    resources,
    filteredResources,
    upcomingForCollection,
    isLoading,
    activeType,
    setActiveType,
    selectedTopic,
    setSelectedTopic,
    searchQuery,
    setSearchQuery,
    activeCollection,
    setActiveCollection,
    activeStage,
    setActiveStage,
    showSavedOnly,
    setShowSavedOnly,
    bookmarkedIds,
    toggleBookmark,
    isResourceBookmarked,
    typeCounts,
    isFiltered,
    activeFilterChips,
    handleRemoveFilterChip,
    handleResetFilters,
    handleClearAllFilters,
    visibleCount,
    handleLoadMore,
    hasMore,
    totalFilteredCount,
    userEmail,
    isModalOpen,
    handleCloseModal,
    activeResource,
    isEarlyAccessMode,
    isSwitchEmailMode,
    handleOpenDownload,
    handleSuccessUnlock,
    handleChangeEmail,
    unlockToastEmail,
    handleDismissUnlockToast,
  } = useResources();

  const resourcesJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Unlock Her Tech Universal Resources Hub",
      itemListElement: resources.map((r, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "DigitalDocument",
          name: r.title,
          description: r.description,
          url: `https://unlockhertech.com/resources#${r.slug}`,
          fileFormat: r.type === "guide" ? "application/pdf" : "text/html",
          isAccessibleForFree: true,
          publisher: {
            "@type": "Organization",
            name: "Unlock Her Tech",
            url: "https://unlockhertech.com",
          },
        },
      })),
    }),
    [resources]
  );

  useMetaData(
    "Technical & Career Resources Hub | Unlock Her Tech",
    "Discover free technical playbooks, system design cheatsheets, AI & RAG guides, career transition roadmaps, and video workshops for women in tech.",
    undefined,
    {
      image: "/logo.png",
      type: "website",
      jsonLd: resourcesJsonLd,
    }
  );

  const isCollectionSubView = activeCollection !== "all";

  const liveAnnouncement = useMemo(() => {
    if (isLoading) return "Loading resources library...";
    const count = totalFilteredCount;
    const itemWord = count === 1 ? "resource" : "resources";
    if (searchQuery.trim().length > 0) {
      return `Showing ${count} ${itemWord} matching "${searchQuery.trim()}"`;
    }
    if (selectedTopic !== "All") {
      return `Showing ${count} ${itemWord} for topic ${selectedTopic}`;
    }
    return `Showing ${count} ${itemWord}`;
  }, [isLoading, totalFilteredCount, searchQuery, selectedTopic]);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── Accessible Live Filter Announcement ───────────────────────── */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* ── 1. Hero Header ─────────────────────────── */}
      <ResourcesHeroSearch
        userEmail={userEmail}
        onChangeEmail={handleChangeEmail}
        totalCount={resources.length}
        bookmarkedCount={bookmarkedIds.length}
        showSavedOnly={showSavedOnly}
        onToggleSavedOnly={setShowSavedOnly}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ── 2. View Mode Routing ─────────────────────────────────────────── */}
        {isCollectionSubView ? (
          /* Collection Sub-View Mode */
          <ResourceCollectionView
            collectionId={activeCollection}
            activeStage={activeStage}
            onStageChange={setActiveStage}
            onBackToHub={() => setActiveCollection("all")}
            resources={filteredResources}
            userEmail={userEmail}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onOpenAction={handleOpenDownload}
            onOpenBundleModal={() => handleOpenDownload(null, true)}
          />
        ) : (
          /* Main Universal Hub Mode */
          <div className="space-y-10">
            {/* 2-Layer Filter Controls: Search Bar above Format Tabs & Topic Dropdown */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
              {/* Universal Search Bar above All Formats */}
              <div className="relative flex items-center shadow-xs rounded-2xl bg-white text-gray-900 border border-stone-200/90 focus-within:border-brand-coral focus-within:ring-3 focus-within:ring-brand-coral/20 transition-all">
                <label htmlFor="resource-search-input" className="sr-only">
                  Search by topic, keyword, or role
                </label>
                <div className="pl-4 pr-2 text-stone-400 pointer-events-none flex items-center">
                  <HiMagnifyingGlass className="w-5 h-5 text-brand-coral" />
                </div>
                <input
                  id="resource-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, keyword, or role (e.g. System Design, Resume, RAG)..."
                  className="w-full py-3.5 pr-10 text-sm sm:text-base text-gray-900 placeholder:text-stone-400 bg-transparent focus:outline-hidden"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Format Switcher (Type Tabs) & Extended Topic/Domain Dropdown */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Layer 1: Type Tabs */}
                <div className="grow min-w-0">
                  <ResourceTypeTabs
                    activeType={activeType}
                    onTypeChange={setActiveType}
                    typeCounts={typeCounts}
                  />
                </div>

                {/* Layer 2: Topic & Domain Dropdown */}
                <div className="w-full lg:w-auto shrink-0">
                  <ResourceTopicDropdown
                    selectedTopic={selectedTopic}
                    onTopicChange={setSelectedTopic}
                  />
                </div>
              </div>

              {/* Active Filter Chips & Clear All */}
              <ResourceActiveFilterChips
                chips={activeFilterChips}
                totalCount={totalFilteredCount}
                onRemoveChip={handleRemoveFilterChip}
                onClearAll={handleClearAllFilters}
                searchQuery={searchQuery}
              />
            </div>

            {/* Progressive Disclosure: If unfiltered, show Editorial Featured & Collections */}
            {!isFiltered && (
              <>
                {/* Featured Editorial Spotlight Row */}
                <ResourceFeaturedRow
                  onOpenBundleModal={() => handleOpenDownload(null, true)}
                  onSelectCollection={setActiveCollection}
                  onOpenAction={handleOpenDownload}
                />

                {/* Curated Collection Pathways Grid */}
                <ResourceCollectionsGrid
                  onSelectCollection={setActiveCollection}
                />
              </>
            )}

            {/* Universal Resource Catalog Grid Section */}
            <section aria-labelledby="all-resources-heading">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    id="all-resources-heading"
                    className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight"
                  >
                    {isFiltered ? "Matching Resources" : "All Resources & Guides"}
                  </h2>
                  <p className="text-stone-500 text-sm mt-1 font-medium">
                    {isFiltered
                      ? `Showing ${totalFilteredCount} items filtered by your criteria.`
                      : `Browse our complete multi-format collection (${resources.length} resources).`}
                  </p>
                </div>
              </div>

              {/* Loading Skeletons */}
              {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["skel-1", "skel-2", "skel-3", "skel-4", "skel-5", "skel-6"].map((slotId) => (
                    <div
                      key={slotId}
                      className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-4"
                    >
                      <div className="h-6 bg-stone-200 rounded w-1/3" />
                      <div className="h-7 bg-stone-200 rounded w-3/4" />
                      <div className="h-16 bg-stone-200 rounded w-full" />
                      <div className="h-10 bg-stone-200 rounded w-full pt-4" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty Search / Filter State */}
              {!isLoading && totalFilteredCount === 0 && (
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs max-w-2xl mx-auto">
                  <div className="w-14 h-14 rounded-full bg-pink-100 text-brand-coral flex items-center justify-center mx-auto mb-4">
                    <HiSparkles className="w-7 h-7 text-brand-yellow" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No resources match this filter
                  </h3>
                  <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
                    We couldn't find any resources matching your search or active filters. Try adjusting your keywords or reset all filters.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 rounded-full bg-brand-coral text-white font-bold text-xs sm:text-sm hover:bg-brand-coral/90 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <HiArrowPath className="w-4 h-4" />
                      <span>Reset Filter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Live Resource Grid */}
              {!isLoading && totalFilteredCount > 0 && (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.slice(0, visibleCount).map((item, idx) => (
                      <UniversalResourceCard
                        key={item.id}
                        item={item}
                        index={idx}
                        userEmail={userEmail}
                        isBookmarked={isResourceBookmarked(item.id)}
                        onToggleBookmark={toggleBookmark}
                        onOpenAction={handleOpenDownload}
                      />
                    ))}
                  </div>

                  {/* Load More Pagination */}
                  {hasMore && (
                    <div className="mt-10 text-center">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-stone-300 text-gray-800 font-bold text-xs sm:text-sm shadow-xs hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer"
                      >
                        <span>
                          Load More ({filteredResources.length - visibleCount} remaining)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* ── 3. Upcoming Resource Drops Spotlight ───────────────────────── */}
        <div className="mt-16">
          <ResourceUpcomingSpotlight
            items={upcomingForCollection}
            userEmail={userEmail}
            onOpenDownload={handleOpenDownload}
          />
        </div>

        {/* ── 4. Brand Palette Dots ──────────────────────────────────────── */}
        <div className="flex justify-center gap-2 mt-16 mb-16">
          {BRAND_DOTS.map((color) => (
            <div
              key={color}
              className="w-2.5 h-2.5 rounded-full opacity-60"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* ── 5. Subscribe CTA ───────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />

      {/* ── 6. Download / Lead Capture Modal ────────────────────────────── */}
      <DownloadResourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        resource={activeResource}
        isEarlyAccessMode={isEarlyAccessMode}
        isSwitchEmailMode={isSwitchEmailMode}
        onSuccessUnlock={handleSuccessUnlock}
      />

      {/* ── 7. Community Access Confirmation Toast ─────────────────────── */}
      <ResourceUnlockToast
        email={unlockToastEmail}
        onDismiss={handleDismissUnlockToast}
      />
    </div>
  );
}
