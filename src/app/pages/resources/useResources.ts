import { useState, useEffect, useMemo, useCallback } from "react";
import type { Resource } from "../../types";
import { getAllResources } from "../../utils/sanity";
import { DEFAULT_WEEKLY_RESOURCES, type ExtendedResource } from "./resourceData";

const STORAGE_KEY_USER_EMAIL = "uht_user_email";

export function useResources() {
  const [resources, setResources] = useState<ExtendedResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_USER_EMAIL);
    } catch (err) {
      console.warn("Could not read user email from localStorage:", err);
      return null;
    }
  });
  const [now] = useState(() => Date.now());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isEarlyAccessMode, setIsEarlyAccessMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const sanityData = await getAllResources();
        if ((sanityData?.length ?? 0) > 0) {
          const enriched: ExtendedResource[] = sanityData.map((item, idx) => ({
            ...item,
            weekNumber: item.weekNumber || idx + 1,
            requiresLogin: item.requiresLogin ?? idx + 1 > 3,
            releaseDate: item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : `Sep 7, 2026`,
            releaseTimestamp: item.publishedAt
              ? new Date(item.publishedAt).getTime()
              : new Date("2026-09-07T00:00:00Z").getTime(),
          }));
          setResources(enriched);
        } else {
          setResources(DEFAULT_WEEKLY_RESOURCES);
        }
      } catch (err) {
        console.error("Failed to load resources from Sanity, using defaults:", err);
        setResources(DEFAULT_WEEKLY_RESOURCES);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResources = useMemo(() => {
    return selectedCategory === "All"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);
  }, [resources, selectedCategory]);

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

  const handleOpenDownload = useCallback((resource: ExtendedResource | null, earlyAccess = false) => {
    if (earlyAccess || !resource) {
      setActiveResource(null);
      setIsEarlyAccessMode(true);
      setIsModalOpen(true);
      return;
    }

    const currentTime = Date.now();
    const releaseTime = resource.releaseTimestamp || new Date("2026-09-07T00:00:00Z").getTime();
    const isReleased = releaseTime <= currentTime;

    if (!isReleased) {
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

  return {
    resources,
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
  };
}
