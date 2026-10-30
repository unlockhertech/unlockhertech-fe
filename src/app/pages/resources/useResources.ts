import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Resource, ResourceType } from "../../types";
import { getAllResources } from "../../utils/sanity";
import { useSanityQuery } from "../../hooks/useSanityQuery";
import {
  UPCOMING_COLLECTION_PREVIEWS,
  LAUNCH_DATE,
  RESOURCE_TOPIC_GROUPS,
  type ExtendedResource,
} from "./resourceData";
import {
  getBookmarkedIds,
  toggleBookmarkId,
  subscribeBookmarks,
} from "./resourceBookmarks";

const STORAGE_KEY_USER_EMAIL = "uht_user_email";
const PAGE_SIZE = 9;

export interface ActiveFilterChip {
  id: string;
  type: "type" | "topic" | "query" | "stage" | "saved";
  label: string;
  value: string;
}

export function useResources() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven query state
  const typeParam = searchParams.get("type") || searchParams.get("format") || "all";
  const topicParam = searchParams.get("topic") || searchParams.get("category") || "All";
  const queryParam = searchParams.get("q") || "";
  const collectionParam = searchParams.get("collection") || "all";
  const stageParam = searchParams.get("stage") || "all";
  const savedParam = searchParams.get("saved") === "true";

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Stored user email (for auto-unlocking PDFs)
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_USER_EMAIL);
    } catch (err) {
      console.warn("Could not read user email from localStorage:", err);
      return null;
    }
  });

  // Reactive Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarkedIds());

  useEffect(() => {
    const unsubscribe = subscribeBookmarks((ids) => {
      setBookmarkedIds(ids);
    });
    return unsubscribe;
  }, []);

  // Modal State for Lead Capture
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isEarlyAccessMode, setIsEarlyAccessMode] = useState(false);
  const [isSwitchEmailMode, setIsSwitchEmailMode] = useState(false);
  const [unlockToastEmail, setUnlockToastEmail] = useState<string | null>(null);

  const fetchResources = useCallback(async (): Promise<ExtendedResource[]> => {
    const sanityData = await getAllResources();
    if ((sanityData?.length ?? 0) > 0) {
      return sanityData.map((item, idx) => ({
        ...item,
        type: item.type || (item.format as ResourceType) || "guide",
        collection: item.collection || "career-toolkit",
        targetLevel: item.targetLevel || "All Levels",
        tags: item.tags || [],
        weekNumber: item.weekNumber || idx + 1,
        requiresLogin: item.requiresLogin ?? idx + 1 > 3,
        releaseDate: item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : new Date(LAUNCH_DATE).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
        releaseTimestamp: item.publishedAt
          ? new Date(item.publishedAt).getTime()
          : new Date(`${LAUNCH_DATE}T00:00:00Z`).getTime(),
      }));
    }
    return [];
  }, []);

  const { data: sanityResources, loading: isLoading } = useSanityQuery<ExtendedResource[]>(
    "sanity_all_resources",
    fetchResources
  );

  const resources = useMemo(() => sanityResources ?? [], [sanityResources]);

  // URL state update helpers
  const setActiveType = useCallback(
    (type: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (type === "all") {
            next.delete("type");
            next.delete("format");
          } else {
            next.set("type", type);
            next.delete("format");
          }
          return next;
        },
        { replace: false }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  const setSelectedTopic = useCallback(
    (topic: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (topic === "All") {
            next.delete("topic");
            next.delete("category");
          } else {
            next.set("topic", topic);
            next.delete("category");
          }
          return next;
        },
        { replace: false }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  const setSearchQuery = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const trimmed = q.trim();
          if (trimmed.length === 0) {
            next.delete("q");
          } else {
            next.set("q", q);
          }
          return next;
        },
        { replace: true }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  const setActiveCollection = useCallback(
    (col: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (col === "all") {
            next.delete("collection");
            next.delete("stage");
          } else {
            next.set("collection", col);
          }
          return next;
        },
        { replace: false }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  const setActiveStage = useCallback(
    (stage: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (stage === "all") {
            next.delete("stage");
          } else {
            next.set("stage", stage);
          }
          return next;
        },
        { replace: false }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  const setShowSavedOnly = useCallback(
    (saved: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (saved) {
            next.set("saved", "true");
          } else {
            next.delete("saved");
          }
          return next;
        },
        { replace: false }
      );
      setVisibleCount(PAGE_SIZE);
    },
    [setSearchParams]
  );

  // Backwards compatibility aliases
  const selectedCategory = topicParam;
  const setSelectedCategory = setSelectedTopic;
  const selectedFormat = typeParam;
  const setSelectedFormat = setActiveType;
  const searchQuery = queryParam;
  const activeType = typeParam;
  const selectedTopic = topicParam;
  const activeCollection = collectionParam;
  const activeStage = stageParam;
  const showSavedOnly = savedParam;

  // Filter evaluation logic
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((item) => {
      // 1. Saved-only filter
      if (showSavedOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }

      // 2. Collection filter
      if (activeCollection !== "all") {
        const itemCol = item.collection || "career-toolkit";
        if (itemCol !== activeCollection) {
          return false;
        }
      }

      // 3. Stage filter (for Career Switch Toolkit roadmap)
      if (activeStage !== "all") {
        if (item.stage !== activeStage) {
          return false;
        }
      }

      // 4. Type filter
      if (activeType !== "all") {
        const itemType = item.type || (item.format as ResourceType) || "guide";
        if (itemType !== activeType) {
          return false;
        }
      }

      // 5. Topic / Category filter
      if (selectedTopic !== "All") {
        // Match exact category or cluster match if selected is a cluster ID
        const isClusterMatch =
          RESOURCE_TOPIC_GROUPS.find((g) => g.clusterLabel === selectedTopic || g.clusterId === selectedTopic)
            ?.topics.includes(item.category) ?? false;
        if (item.category !== selectedTopic && !isClusterMatch) {
          return false;
        }
      }

      // 6. Keyword search
      if (q.length > 0) {
        const titleMatch = item.title?.toLowerCase().includes(q) ?? false;
        const descMatch = item.description?.toLowerCase().includes(q) ?? false;
        const catMatch = item.category?.toLowerCase().includes(q) ?? false;
        const tagsMatch = item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!titleMatch && !descMatch && !catMatch && !tagsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    resources,
    showSavedOnly,
    bookmarkedIds,
    activeCollection,
    activeStage,
    activeType,
    selectedTopic,
    searchQuery,
  ]);

  // Compute live counts per type tab
  const typeCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const baseItems = resources.filter((item) => {
      if (showSavedOnly && !bookmarkedIds.includes(item.id)) return false;
      if (activeCollection !== "all") {
        const itemCol = item.collection || "career-toolkit";
        if (itemCol !== activeCollection) return false;
      }
      if (activeStage !== "all" && item.stage !== activeStage) return false;
      if (selectedTopic !== "All") {
        const isClusterMatch =
          RESOURCE_TOPIC_GROUPS.find((g) => g.clusterLabel === selectedTopic || g.clusterId === selectedTopic)
            ?.topics.includes(item.category) ?? false;
        if (item.category !== selectedTopic && !isClusterMatch) return false;
      }
      if (q.length > 0) {
        const titleMatch = item.title?.toLowerCase().includes(q) ?? false;
        const descMatch = item.description?.toLowerCase().includes(q) ?? false;
        const catMatch = item.category?.toLowerCase().includes(q) ?? false;
        const tagsMatch = item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!titleMatch && !descMatch && !catMatch && !tagsMatch) return false;
      }
      return true;
    });

    const counts: Record<string, number> = {
      all: baseItems.length,
      guide: 0,
      template: 0,
      tool: 0,
      video: 0,
      article: 0,
    };

    baseItems.forEach((item) => {
      const t = item.type || (item.format as ResourceType) || "guide";
      if (counts[t] !== undefined) {
        counts[t] += 1;
      }
    });

    return counts;
  }, [resources, showSavedOnly, bookmarkedIds, activeCollection, activeStage, selectedTopic, searchQuery]);

  // Active filter chips
  const isFiltered = useMemo(() => {
    return (
      activeType !== "all" ||
      selectedTopic !== "All" ||
      searchQuery.trim().length > 0 ||
      (activeCollection !== "all" && activeCollection !== "career-toolkit") ||
      showSavedOnly
    );
  }, [activeType, selectedTopic, searchQuery, activeCollection, showSavedOnly]);

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    if (activeType !== "all") {
      const typeLabel =
        activeType === "guide"
          ? "Guides & PDFs"
          : activeType === "template"
          ? "Templates"
          : activeType === "tool"
          ? "Tools"
          : activeType === "video"
          ? "Videos"
          : "Articles";
      chips.push({ id: `type-${activeType}`, type: "type", label: typeLabel, value: activeType });
    }
    if (selectedTopic !== "All") {
      chips.push({ id: `topic-${selectedTopic}`, type: "topic", label: selectedTopic, value: selectedTopic });
    }
    if (searchQuery.trim().length > 0) {
      chips.push({ id: "query", type: "query", label: `"${searchQuery.trim()}"`, value: searchQuery.trim() });
    }
    if (showSavedOnly) {
      chips.push({ id: "saved", type: "saved", label: "Saved Only", value: "true" });
    }
    return chips;
  }, [activeType, selectedTopic, searchQuery, showSavedOnly]);

  const handleRemoveFilterChip = useCallback(
    (chip: ActiveFilterChip) => {
      if (chip.type === "type") setActiveType("all");
      if (chip.type === "topic") setSelectedTopic("All");
      if (chip.type === "query") setSearchQuery("");
      if (chip.type === "stage") setActiveStage("all");
      if (chip.type === "saved") setShowSavedOnly(false);
    },
    [setActiveType, setSelectedTopic, setSearchQuery, setActiveStage, setShowSavedOnly]
  );

  const handleResetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("type");
        next.delete("format");
        next.delete("topic");
        next.delete("category");
        next.delete("q");
        next.delete("stage");
        next.delete("saved");
        return next;
      },
      { replace: false }
    );
    setVisibleCount(PAGE_SIZE);
  }, [setSearchParams]);

  const handleClearAllFilters = handleResetFilters;

  // Bookmark Toggle
  const toggleBookmark = useCallback((id: string) => {
    toggleBookmarkId(id);
  }, []);

  const isResourceBookmarked = useCallback(
    (id: string) => {
      return bookmarkedIds.includes(id);
    },
    [bookmarkedIds]
  );

  // Direct Action & Download Trigger
  const triggerDirectDownload = useCallback((resource: Resource) => {
    if (resource.pdfUrl) {
      const link = document.createElement("a");
      link.href = resource.pdfUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${resource.slug || "unlock-her-tech-guide"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, []);

  const handleOpenDownload = useCallback(
    (resource: ExtendedResource | null, bundleMode = false) => {
      if (bundleMode || !resource) {
        setActiveResource(null);
        setIsEarlyAccessMode(true);
        setIsModalOpen(true);
        return;
      }

      if (resource.isComingSoon) {
        setActiveResource(resource);
        setIsEarlyAccessMode(true);
        setIsModalOpen(true);
        return;
      }

      // External or web action
      if (resource.actionUrl && !resource.pdfUrl) {
        if (resource.actionUrl.startsWith("/")) {
          window.location.href = resource.actionUrl;
        } else {
          window.open(resource.actionUrl, "_blank", "noopener,noreferrer");
        }
        return;
      }

      const weekNum = resource.weekNumber || 1;
      const requiresCredentials = resource.requiresLogin || weekNum > 3;

      if (!requiresCredentials) {
        triggerDirectDownload(resource);
        return;
      }

      if (userEmail) {
        triggerDirectDownload(resource);
        return;
      }

      setActiveResource(resource);
      setIsEarlyAccessMode(false);
      setIsModalOpen(true);
    },
    [userEmail, triggerDirectDownload]
  );

  const handleSuccessUnlock = useCallback((email: string) => {
    setUserEmail(email);
    setIsSwitchEmailMode(false);
    setUnlockToastEmail(email);
  }, []);

  const handleDismissUnlockToast = useCallback(() => {
    setUnlockToastEmail(null);
  }, []);

  const handleChangeEmail = useCallback(() => {
    setActiveResource(null);
    setIsEarlyAccessMode(true);
    setIsSwitchEmailMode(true);
    setIsModalOpen(true);
  }, []);

  const handleClearUserEmail = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_USER_EMAIL);
      localStorage.removeItem("uht_community_member");
    } catch (err) {
      console.warn("Could not clear user email from localStorage:", err);
    }
    setUserEmail(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsSwitchEmailMode(false);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const hasMore = filteredResources.length > visibleCount;

  const upcomingForCollection = useMemo(() => {
    const list =
      activeCollection === "all"
        ? UPCOMING_COLLECTION_PREVIEWS
        : UPCOMING_COLLECTION_PREVIEWS.filter((item) => item.collection === activeCollection);

    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) {
      return list;
    }

    return list.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(q) ?? false;
      const descMatch = item.description?.toLowerCase().includes(q) ?? false;
      const catMatch = item.category?.toLowerCase().includes(q) ?? false;
      return titleMatch || descMatch || catMatch;
    });
  }, [activeCollection, searchQuery]);

  return {
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
    totalFilteredCount: filteredResources.length,
    userEmail,
    isModalOpen,
    setIsModalOpen,
    handleCloseModal,
    activeResource,
    isEarlyAccessMode,
    isSwitchEmailMode,
    handleOpenDownload,
    handleSuccessUnlock,
    handleClearUserEmail,
    handleChangeEmail,
    unlockToastEmail,
    handleDismissUnlockToast,
    // Backwards compatibility
    selectedCategory,
    setSelectedCategory,
    selectedFormat,
    setSelectedFormat,
  };
}
