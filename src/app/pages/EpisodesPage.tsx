import { useMemo } from "react";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import { useEpisodes } from "./episodes/useEpisodes";
import { EpisodesHeroHeader } from "./episodes/EpisodesHeroHeader";
import { EpisodesToolbar } from "./episodes/EpisodesToolbar";
import { EpisodesStatusFeedback } from "./episodes/EpisodesStatusFeedback";
import { EpisodesGrid } from "./episodes/EpisodesGrid";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

export function EpisodesPage() {
  const {
    episodes,
    loading,
    error,
    isLive,
    search,
    sort,
    view,
    setView,
    activeTag,
    filtered,
    visible,
    visibleCount,
    handleSearchChange,
    handleTagChange,
    handleSortChange,
    handleClearFilters,
    handleLoadMore,
    handleShowLess,
  } = useEpisodes();

  const podcastJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": "Unlock Her Tech Podcast",
    "description": "A podcast that amplifies the voices of women and underrepresented leaders in technology through authentic conversations that inspire change and action.",
    "url": "https://unlockhertech.com/episodes",
    "inLanguage": "en",
    "publisher": {
      "@type": "Organization",
      "name": "Unlock Her Tech",
      "url": "https://unlockhertech.com",
      "logo": "https://unlockhertech.com/logo.png",
    },
    "hasPart": episodes.slice(0, 15).map((ep) => ({
      "@type": "PodcastEpisode",
      "name": ep.title,
      "description": ep.description?.replace(/<[^>]*>?/gm, "").substring(0, 200),
      "datePublished": ep.date,
      "episodeNumber": ep.episodeNumber,
      "duration": ep.duration,
      "associatedMedia": {
        "@type": "MediaObject",
        "contentUrl": ep.audioUrl,
      },
    })),
  }), [episodes]);

  useMetaData(
    "Episodes | Unlock Her Tech Podcast",
    "Listen to authentic conversations with women leaders, engineers, founders, and innovators breaking barriers across technology.",
    "https://unlockhertech.com/episodes",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: podcastJsonLd,
    }
  );

  return (
    <div>
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <EpisodesHeroHeader totalEpisodes={episodes.length} />

      {/* ── 2. Toolbar (Search, Sort, Tag filters, View Switcher) ─────────── */}
      <EpisodesToolbar
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
        view={view}
        onViewChange={setView}
        activeTag={activeTag}
        onTagChange={handleTagChange}
      />

      {/* ── 3. Results Section ────────────────────────────────────────────── */}
      <div className="py-8 bg-stone-50 relative overflow-hidden">
        <BrandPatternOverlay variant="watermark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <EpisodesStatusFeedback
            isLive={isLive}
            error={error}
            loading={loading}
            visibleCount={visibleCount}
            totalFiltered={filtered.length}
            searchQuery={search}
          />

          <EpisodesGrid
            episodes={visible}
            filteredCount={filtered.length}
            visibleCount={visibleCount}
            view={view}
            onClearFilters={handleClearFilters}
            onLoadMore={handleLoadMore}
            onShowLess={handleShowLess}
          />
        </div>
      </div>

      {/* ── 4. Subscribe CTA ──────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Subscribe & Never Miss a Drop"
        subtitle="A new episode lands every month. Pick your platform and stay plugged in."
      />
    </div>
  );
}