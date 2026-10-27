import { useState, useEffect, useMemo, useCallback } from "react";
import type { Resource } from "../../types";
import { getAllResources } from "../../utils/sanity";
import {
  UPCOMING_COLLECTION_PREVIEWS,
  LAUNCH_DATE,
  type ExtendedResource,
} from "./resourceData";

const STORAGE_KEY_USER_EMAIL = "uht_user_email";
const PAGE_SIZE = 9;

export function useResources() {
  const [resources, setResources] = useState<ExtendedResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollection, setActiveCollectionState] = useState("all");
  const [selectedCategory, setSelectedCategoryState] = useState("All");
  const [selectedFormat, setSelectedFormatState] = useState("all");
  const [searchQuery, setSearchQueryState] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_USER_EMAIL);
    } catch (err) {
      console.warn("Could not read user email from localStorage:", err);
      return null;
    }
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isEarlyAccessMode, setIsEarlyAccessMode] = useState(false);
  const [isSwitchEmailMode, setIsSwitchEmailMode] = useState(false);

  // Unlock confirmation banner/toast (survives navigation + filter changes)
  const [unlockToastEmail, setUnlockToastEmail] = useState<string | null>(null);

  const setActiveCollection = useCallback((col: string) => {
    setActiveCollectionState(col);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSelectedCategory = useCallback((cat: string) => {
    setSelectedCategoryState(cat);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSelectedFormat = useCallback((fmt: string) => {
    setSelectedFormatState(fmt);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
    setVisibleCount(PAGE_SIZE);
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const sanityData = await getAllResources();
        if ((sanityData?.length ?? 0) > 0) {
          const enriched: ExtendedResource[] = sanityData.map((item, idx) => ({
            ...item,
            collection: item.collection || "career-toolkit",
            format: item.format || "guide",
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
          setResources(enriched);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Failed to load resources from Sanity:", err);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((item) => {
      // 1. Collection filter
      if (activeCollection !== "all") {
        const itemCollection = item.collection || "career-toolkit";
        if (itemCollection !== activeCollection) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // 3. Format filter
      if (selectedFormat !== "all") {
        const itemFormat = item.format || "guide";
        if (itemFormat !== selectedFormat) {
          return false;
        }
      }

      // 4. Keyword search
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
  }, [resources, activeCollection, selectedCategory, selectedFormat, searchQuery]);

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

  const handleResetFilters = useCallback(() => {
    setActiveCollection("all");
    setSelectedCategory("All");
    setSelectedFormat("all");
    setSearchQuery("");
  }, [setActiveCollection, setSelectedCategory, setSelectedFormat, setSearchQuery]);

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

  const handleOpenDownload = useCallback((resource: ExtendedResource | null, bundleMode = false) => {
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
  }, [userEmail, triggerDirectDownload]);

  const handleSuccessUnlock = useCallback((email: string) => {
    setUserEmail(email);
    setIsSwitchEmailMode(false);
    // Surface an immediate, Brevo-backed confirmation so users always know
    // access is active — this toast persists independently of filter/collection changes.
    setUnlockToastEmail(email);
  }, []);

  const handleDismissUnlockToast = useCallback(() => {
    setUnlockToastEmail(null);
  }, []);

  // Opens the unlock modal pre-cleared so a user can switch accounts WITHOUT
  // losing their current access — identity is only replaced once the new
  // email is successfully submitted (see handleSuccessUnlock).
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

  return {
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
  };
}
