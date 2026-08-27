import { useMemo } from "react";
import { HiInformationCircle, HiXMark, HiFunnel } from "react-icons/hi2";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import { useJobs } from "./jobs/useJobs";
import { buildJobsJsonLd } from "./jobs/jobUtils";
import { JobsHeroHeader } from "./jobs/JobsHeroHeader";
import { JobFilterControls } from "./jobs/JobFilterControls";
import { JobCard } from "./jobs/JobCard";
import { JobDetailsModal } from "./jobs/JobDetailsModal";
import { JobVettingStandards } from "./jobs/JobVettingStandards";

export function JobsPage() {
  const {
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
  } = useJobs();

  // Schema.org JobPosting structured data for Google Jobs rich results
  const jobsJsonLd = useMemo(() => buildJobsJsonLd(jobs), [jobs]);

  useMetaData(
    "Inclusive Tech Job Board | Unlock Her Tech",
    "Curated technical and non-technical opportunities centered on women in tech and supportive allies. Every role is vetted for mandatory salary transparency, flexible culture, and inclusive practices.",
    "https://unlockhertech.com/jobs",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: jobsJsonLd,
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── Toast Notification for Reporting ─────────────────────────────── */}
      {toastMessage && (
        <aside
          aria-label="Notification"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 text-xs sm:text-sm font-medium animate-in fade-in slide-from-bottom-3 duration-200"
        >
          <HiInformationCircle className="w-5 h-5 text-brand-yellow shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-white/60 hover:text-white rounded-full ml-2 cursor-pointer"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* ── 1. Hero Header ───────────────────────────────────────────────── */}
      <JobsHeroHeader />

      {/* ── 2. Filter & Search Control Center ────────────────────────────── */}
      <JobFilterControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => setShowSavedOnly(!showSavedOnly)}
        savedCount={savedJobIds.length}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRemote={selectedRemote}
        onSelectRemote={setSelectedRemote}
        selectedExperience={selectedExperience}
        onSelectExperience={setSelectedExperience}
        selectedMinSalary={selectedMinSalary}
        onSelectMinSalary={setSelectedMinSalary}
        selectedHighlight={selectedHighlight}
        onSelectHighlight={setSelectedHighlight}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filteredCount={filteredJobs.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetAllFilters}
      />

      {/* ── 3. Jobs Listing Grid ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-600">Loading verified inclusive opportunities…</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-brand-coral flex items-center justify-center mx-auto mb-4">
              <HiFunnel className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No roles match your filters</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Try relaxing your compensation filter, clearing specific tech tags, or exploring our broader categories.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-coral text-white font-bold text-sm shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <section>
            <h2 className="sr-only">Available Vetted Opportunities</h2>
            <div className="space-y-4 sm:space-y-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  copiedSlug={copiedSlug}
                  onSelectJob={setActiveJobModal}
                  onToggleSave={toggleSaveJob}
                  onShare={handleShareJob}
                  onReport={handleReportJob}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── 4. Inclusivity & Transparency Vetting Standards ──────────────── */}
      <JobVettingStandards />

      {/* ── 5. Job Detail Modal / Drawer ─────────────────────────────────── */}
      <JobDetailsModal
        job={activeJobModal}
        onClose={() => setActiveJobModal(null)}
        isSaved={activeJobModal ? savedJobIds.includes(activeJobModal.id) : false}
        onToggleSave={toggleSaveJob}
        onReport={handleReportJob}
      />

      {/* ── 6. Job Alert / Newsletter CTA ────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Get Weekly Inclusive Role Drops"
        subtitle="Subscribe for weekly vetted job drops with verified salaries, remote flexibility, and transparent employer cultures."
      />
    </div>
  );
}
