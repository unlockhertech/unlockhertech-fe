import { useState, useMemo, useCallback } from "react";
import { useRssFeed } from "../../hooks/useRssFeed";
import {
  type SortOrder,
  type ViewMode,
  PAGE_SIZE,
  EPISODE_TAGS,
} from "./episodesTypes";

function matchesEpisodeTag(ep: { id: number; title: string; description: string; tags?: string[] }, activeTag: string): boolean {
  if (!activeTag) return true;
  if ((EPISODE_TAGS[ep.id] ?? []).includes(activeTag)) return true;
  if ((ep.tags ?? []).includes(activeTag)) return true;

  const content = `${ep.title} ${ep.description}`.toLowerCase();
  if (activeTag === "engineering") {
    return content.includes("engineer") || content.includes("code") || content.includes("software") || content.includes("tech") || content.includes("developer") || content.includes("system");
  }
  if (activeTag === "leadership") {
    return content.includes("lead") || content.includes("manage") || content.includes("career") || content.includes("mentor") || content.includes("sponsor");
  }
  if (activeTag === "startups") {
    return content.includes("startup") || content.includes("founder") || content.includes("launch") || content.includes("pivot");
  }
  if (activeTag === "inclusion") {
    return content.includes("inclusi") || content.includes("divers") || content.includes("accessib") || content.includes("women") || content.includes("equity");
  }
  if (activeTag === "ai-innovation") {
    return content.includes("ai") || content.includes("artificial intelligence") || content.includes("innovat") || content.includes("future");
  }
  return false;
}

export function useEpisodes() {
  const { episodes, loading, error, isLive } = useRssFeed();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [activeTag, setActiveTag] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return episodes
      .filter((ep) => {
        const q = search.toLowerCase();
        const matchesText =
          !q ||
          ep.title.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q);
        const matchesTag = matchesEpisodeTag(ep, activeTag);
        return matchesText && matchesTag;
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.episodeNumber - a.episodeNumber
          : a.episodeNumber - b.episodeNumber
      );
  }, [episodes, search, activeTag, sort]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleTagChange = useCallback((tag: string) => {
    setActiveTag(tag);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSortChange = useCallback((s: SortOrder) => {
    setSort(s);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setActiveTag("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((v) => v + PAGE_SIZE);
  }, []);

  const handleShowLess = useCallback(() => {
    setVisibleCount(PAGE_SIZE);
  }, []);

  return {
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
  };
}
