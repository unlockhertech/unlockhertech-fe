import { useState, useEffect, useMemo, useCallback, type MouseEvent } from "react";
import { useSearchParams } from "react-router";
import type { Job } from "../../types";
import { getAllJobs } from "../../utils/jobsSanity";
import { trackJobSave, trackJobShare } from "../../utils/analytics";
import { filterAndSortJobs, type JobSortOption } from "./jobUtils";

const STORAGE_KEY_SAVED_JOBS = "uht_saved_jobs";

export type { JobSortOption };

export function useJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || "all");
  const [selectedRemote, setSelectedRemote] = useState(() => searchParams.get("remote") || "all");
  const [selectedExperience, setSelectedExperience] = useState(() => searchParams.get("level") || "all");
  const [selectedMinSalary, setSelectedMinSalary] = useState(() => Number(searchParams.get("minSalary")) || 0);
  const [selectedHighlight, setSelectedHighlight] = useState("all");
  const [sortBy, setSortBy] = useState<JobSortOption>("newest");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Saved Jobs LocalStorage
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_JOBS);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn("Failed to load saved jobs from localStorage:", err);
      return [];
    }
  });

  // Modal & Notification States
  const [activeJobModal, setActiveJobModal] = useState<Job | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [reportedJobIds, setReportedJobIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Sync active filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedRemote !== "all") params.set("remote", selectedRemote);
    if (selectedExperience !== "all") params.set("level", selectedExperience);
    if (selectedMinSalary > 0) params.set("minSalary", String(selectedMinSalary));

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();
    if (newQueryString !== currentQueryString) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, selectedCategory, selectedRemote, selectedExperience, selectedMinSalary, searchParams, setSearchParams]);

  const toggleSaveJob = useCallback((jobId: string, e?: MouseEvent) => {
    e?.stopPropagation();
    let isNowSaved = false;
    setSavedJobIds((prev) => {
      const willBeSaved = !prev.includes(jobId);
      isNowSaved = willBeSaved;
      const next = willBeSaved
        ? [...prev, jobId]
        : prev.filter((id) => id !== jobId);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_JOBS, JSON.stringify(next));
      } catch (err) {
        console.warn("Failed to persist saved jobs to localStorage", err);
      }
      return next;
    });
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      trackJobSave(job.company, job.title, isNowSaved);
    }
  }, [jobs]);

  const handleShareJob = useCallback(async (job: Job, e?: MouseEvent) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/jobs?selected=${job.slug || job.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${job.title} at ${job.company}`, url });
      } catch (err) {
        console.debug("Native share dismissed or failed:", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedSlug(job.slug || job.id);
        setTimeout(() => setCopiedSlug(null), 2000);
      } catch (err) {
        console.debug("Clipboard copy failed:", err);
      }
    }
    trackJobShare(job.company, job.title);
  }, []);

  const handleReportJob = useCallback((job: Job, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setReportedJobIds((prev) => (prev.includes(job.id) ? prev : [...prev, job.id]));
    setToastMessage(`Thank you! "${job.title}" has been flagged for removal. Our team will verify it promptly.`);
    setTimeout(() => setToastMessage(null), 4500);
  }, []);

  const hasActiveFilters = useMemo(() => (
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedRemote !== "all" ||
    selectedExperience !== "all" ||
    selectedMinSalary > 0 ||
    selectedHighlight !== "all" ||
    showSavedOnly
  ), [
    searchQuery,
    selectedCategory,
    selectedRemote,
    selectedExperience,
    selectedMinSalary,
    selectedHighlight,
    showSavedOnly,
  ]);

  const resetAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedRemote("all");
    setSelectedExperience("all");
    setSelectedMinSalary(0);
    setSelectedHighlight("all");
    setShowSavedOnly(false);
    setSortBy("newest");
  }, []);

  const filteredJobs = useMemo(
    () =>
      filterAndSortJobs(
        jobs,
        {
          searchQuery,
          selectedCategory,
          selectedRemote,
          selectedExperience,
          selectedMinSalary,
          selectedHighlight,
          showSavedOnly,
          savedJobIds,
          reportedJobIds,
        },
        sortBy
      ),
    [
      jobs,
      searchQuery,
      selectedCategory,
      selectedRemote,
      selectedExperience,
      selectedMinSalary,
      selectedHighlight,
      showSavedOnly,
      savedJobIds,
      reportedJobIds,
      sortBy,
    ]
  );

  return {
    jobs,
    loading,
    filteredJobs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRemote,
    setSelectedRemote,
    selectedExperience,
    setSelectedExperience,
    selectedMinSalary,
    setSelectedMinSalary,
    selectedHighlight,
    setSelectedHighlight,
    sortBy,
    setSortBy,
    showSavedOnly,
    setShowSavedOnly,
    savedJobIds,
    activeJobModal,
    setActiveJobModal,
    copiedSlug,
    toastMessage,
    setToastMessage,
    hasActiveFilters,
    toggleSaveJob,
    handleShareJob,
    handleReportJob,
    resetAllFilters,
  };
}
