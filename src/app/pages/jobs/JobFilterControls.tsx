import {
  HiMagnifyingGlass,
  HiXMark,
  HiBookmark,
} from "react-icons/hi2";
import {
  CATEGORIES,
  WORKPLACE_OPTIONS,
  EXPERIENCE_OPTIONS,
  SALARY_THRESHOLDS,
  INCLUSIVE_HIGHLIGHTS,
} from "./jobConstants";
import type { JobSortOption } from "./useJobs";

interface JobFilterControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  showSavedOnly: boolean;
  onToggleSavedOnly: () => void;
  savedCount: number;
  selectedCategory: string;
  onSelectCategory: (val: string) => void;
  selectedRemote: string;
  onSelectRemote: (val: string) => void;
  selectedExperience: string;
  onSelectExperience: (val: string) => void;
  selectedMinSalary: number;
  onSelectMinSalary: (val: number) => void;
  selectedHighlight: string;
  onSelectHighlight: (val: string) => void;
  sortBy: JobSortOption;
  onSortChange: (val: JobSortOption) => void;
  filteredCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function JobFilterControls({
  searchQuery,
  onSearchChange,
  showSavedOnly,
  onToggleSavedOnly,
  savedCount,
  selectedCategory,
  onSelectCategory,
  selectedRemote,
  onSelectRemote,
  selectedExperience,
  onSelectExperience,
  selectedMinSalary,
  onSelectMinSalary,
  selectedHighlight,
  onSelectHighlight,
  sortBy,
  onSortChange,
  filteredCount,
  hasActiveFilters,
  onResetFilters,
}: Readonly<JobFilterControlsProps>) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md space-y-6">
        {/* Main Search Input + Saved Tab Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <label htmlFor="jobs-search-input" className="sr-only">
              Search roles
            </label>
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="jobs-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by role title, company, skills (e.g. React, Python), or keywords…"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-coral/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Saved Jobs Tab Button */}
          <button
            type="button"
            onClick={onToggleSavedOnly}
            className={`px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              showSavedOnly
                ? "bg-brand-coral text-white border-brand-coral shadow-sm"
                : "bg-stone-50 text-gray-700 border-gray-200 hover:border-brand-coral/40"
            }`}
          >
            <HiBookmark className={`w-4 h-4 ${showSavedOnly ? "text-brand-yellow" : "text-gray-400"}`} />
            <span>Saved Roles ({savedCount})</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(({ label, value }) => {
              const isActive = selectedCategory === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelectCategory(value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-coral text-white shadow-xs"
                      : "bg-stone-100 text-gray-700 hover:bg-stone-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
          {/* 1. Workplace / Remote */}
          <div>
            <label htmlFor="workplace-filter" className="block text-[0.7rem] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
              Workplace Model
            </label>
            <select
              id="workplace-filter"
              value={selectedRemote}
              onChange={(e) => onSelectRemote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-coral/20 cursor-pointer"
            >
              {WORKPLACE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Experience Level */}
          <div>
            <label htmlFor="experience-filter" className="block text-[0.7rem] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
              Experience Level
            </label>
            <select
              id="experience-filter"
              value={selectedExperience}
              onChange={(e) => onSelectExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-coral/20 cursor-pointer"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Min Compensation Filter */}
          <div>
            <label htmlFor="salary-filter" className="block text-[0.7rem] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
              Compensation Floor
            </label>
            <select
              id="salary-filter"
              value={selectedMinSalary}
              onChange={(e) => onSelectMinSalary(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-coral/20 cursor-pointer"
            >
              {SALARY_THRESHOLDS.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Inclusive Highlights Badge Filter */}
          <div>
            <label htmlFor="highlights-filter" className="block text-[0.7rem] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
              Inclusivity Signals
            </label>
            <select
              id="highlights-filter"
              value={selectedHighlight}
              onChange={(e) => onSelectHighlight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-coral/20 cursor-pointer"
            >
              {INCLUSIVE_HIGHLIGHTS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary + Active Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              {filteredCount} {filteredCount === 1 ? "Role" : "Roles"} Found
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="font-bold text-brand-coral hover:underline ml-2 flex items-center gap-1 cursor-pointer"
              >
                <HiXMark className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label htmlFor="jobs-sort-by" className="text-gray-500 font-medium">
              Sort by:
            </label>
            <select
              id="jobs-sort-by"
              aria-label="Sort jobs by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as JobSortOption)}
              className="bg-stone-50 border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-xs text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="salary">Highest Compensation</option>
              <option value="company">Company (A–Z)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
