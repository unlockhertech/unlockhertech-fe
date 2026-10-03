import { useState, useEffect, useMemo, useCallback } from "react";
import type { Resource } from "../../types";
import { getAllResources } from "../../utils/sanity";
import {
  DEFAULT_RESOURCES,
  UPCOMING_COLLECTION_PREVIEWS,
  LAUNCH_DATE,
  type ExtendedResource,
} from "./resourceData";

const STORAGE_KEY_USER_EMAIL = "uht_user_email";

export function useResources() {
  const [resources, setResources] = useState<ExtendedResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
          setResources(DEFAULT_RESOURCES);
        }
      } catch (err) {
        console.error("Failed to load resources from Sanity, using defaults:", err);
        setResources(DEFAULT_RESOURCES);
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
  }, []);

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
