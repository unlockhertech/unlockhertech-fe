import { describe, it, expect } from 'vitest';
import {
  isJobActive,
  matchesSavedStatus,
  matchesCategory,
  matchesRemote,
  matchesExperience,
  matchesMinSalary,
  matchesHighlight,
  matchesSearchQuery,
  compareJobs,
  filterAndSortJobs,
  type JobFilterCriteria
} from '../app/pages/jobs/jobUtils';
import type { Job } from '../app/types';

const SAMPLE_JOB_1: Job = {
  id: "job-1",
  title: "Staff Frontend Engineer",
  slug: "staff-frontend",
  company: "Stripe",
  category: "Engineering & Dev",
  location: "Remote (Global)",
  remoteStatus: "Remote (Global)",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  salaryRange: "$150,000 - $180,000",
  minSalary: 150000,
  currency: "USD",
  techStack: ["TypeScript", "React", "Next.js"],
  whyApply: "Inclusive culture and transparent bands.",
  description: "Lead modern web interfaces.",
  inclusiveHighlights: ["Verified Inclusive", "Flexible Hours", "Parental Leave"],
  applyUrl: "https://stripe.com/jobs/1",
  source: "Stripe Careers",
  featured: true,
  verifiedInclusive: true,
  publishedAt: "2026-08-20T10:00:00.000Z",
};

const SAMPLE_JOB_2: Job = {
  id: "job-2",
  title: "Product Designer",
  slug: "product-designer",
  company: "Figma",
  category: "Product & Design",
  location: "Remote (UK/Europe)",
  remoteStatus: "Remote (UK/Europe)",
  employmentType: "Full-time",
  experienceLevel: "Mid-Level",
  salaryRange: "$120,000 - $140,000",
  minSalary: 120000,
  currency: "USD",
  techStack: ["Figma", "Design Systems"],
  whyApply: "Design for millions of creators.",
  description: "Create seamless workflows.",
  inclusiveHighlights: ["Verified Inclusive"],
  applyUrl: "https://figma.com/jobs/2",
  source: "Figma Careers",
  featured: false,
  verifiedInclusive: true,
  publishedAt: "2026-08-25T10:00:00.000Z",
};

const SAMPLE_JOB_CLOSED: Job = {
  ...SAMPLE_JOB_1,
  id: "job-closed",
  status: "closed",
};

describe('jobUtils', () => {
  describe('isJobActive', () => {
    it('returns true for active jobs not in reported list', () => {
      expect(isJobActive(SAMPLE_JOB_1, [])).toBe(true);
    });

    it('returns false if job is closed, expired, or archived', () => {
      expect(isJobActive(SAMPLE_JOB_CLOSED, [])).toBe(false);
      expect(isJobActive({ ...SAMPLE_JOB_1, status: "expired" }, [])).toBe(false);
      expect(isJobActive({ ...SAMPLE_JOB_1, isArchived: true }, [])).toBe(false);
    });

    it('returns false if job ID is in reportedJobIds', () => {
      expect(isJobActive(SAMPLE_JOB_1, ["job-1"])).toBe(false);
    });
  });

  describe('matchesSavedStatus', () => {
    it('returns true when showSavedOnly is false', () => {
      expect(matchesSavedStatus("job-1", false, [])).toBe(true);
    });

    it('returns true only if saved when showSavedOnly is true', () => {
      expect(matchesSavedStatus("job-1", true, ["job-1"])).toBe(true);
      expect(matchesSavedStatus("job-1", true, ["job-2"])).toBe(false);
    });
  });

  describe('matchesCategory', () => {
    it('matches all or matching category', () => {
      expect(matchesCategory("Engineering & Dev", "all")).toBe(true);
      expect(matchesCategory("Engineering & Dev", "Engineering & Dev")).toBe(true);
      expect(matchesCategory("Engineering & Dev", "Product & Design")).toBe(false);
    });
  });

  describe('matchesRemote', () => {
    it('matches all or matching remote status', () => {
      expect(matchesRemote("Remote (Global)", "all")).toBe(true);
      expect(matchesRemote("Remote (Global)", "Remote (Global)")).toBe(true);
      expect(matchesRemote("Remote (Global)", "Hybrid")).toBe(false);
    });
  });

  describe('matchesExperience', () => {
    it('matches all or matching experience level', () => {
      expect(matchesExperience("Senior", "all")).toBe(true);
      expect(matchesExperience("Senior", "Senior")).toBe(true);
      expect(matchesExperience("Senior", "Junior")).toBe(false);
    });
  });

  describe('matchesMinSalary', () => {
    it('matches zero or salary above threshold', () => {
      expect(matchesMinSalary(150000, 0)).toBe(true);
      expect(matchesMinSalary(150000, 140000)).toBe(true);
      expect(matchesMinSalary(120000, 140000)).toBe(false);
    });
  });

  describe('matchesHighlight', () => {
    it('matches all or highlight in list', () => {
      expect(matchesHighlight(["Verified Inclusive"], "all")).toBe(true);
      expect(matchesHighlight(["Verified Inclusive", "Flexible Hours"], "Flexible Hours")).toBe(true);
      expect(matchesHighlight(["Verified Inclusive"], "Flexible Hours")).toBe(false);
    });
  });

  describe('matchesSearchQuery', () => {
    it('matches title, company, location, whyApply, or techStack', () => {
      expect(matchesSearchQuery(SAMPLE_JOB_1, "")).toBe(true);
      expect(matchesSearchQuery(SAMPLE_JOB_1, "Frontend")).toBe(true);
      expect(matchesSearchQuery(SAMPLE_JOB_1, "stripe")).toBe(true);
      expect(matchesSearchQuery(SAMPLE_JOB_1, "TypeScript")).toBe(true);
      expect(matchesSearchQuery(SAMPLE_JOB_1, "NonExistentKeyword")).toBe(false);
    });
  });

  describe('compareJobs', () => {
    it('sorts by salary descending', () => {
      expect(compareJobs(SAMPLE_JOB_1, SAMPLE_JOB_2, "salary")).toBeLessThan(0);
    });

    it('sorts by company ascending', () => {
      expect(compareJobs(SAMPLE_JOB_1, SAMPLE_JOB_2, "company")).toBeGreaterThan(0); // Stripe vs Figma
    });

    it('sorts by featured first, then newest date', () => {
      expect(compareJobs(SAMPLE_JOB_1, SAMPLE_JOB_2, "newest")).toBeLessThan(0); // SAMPLE_JOB_1 is featured
    });
  });

  describe('filterAndSortJobs', () => {
    const criteria: JobFilterCriteria = {
      searchQuery: "",
      selectedCategory: "all",
      selectedRemote: "all",
      selectedExperience: "all",
      selectedMinSalary: 0,
      selectedHighlight: "all",
      showSavedOnly: false,
      savedJobIds: [],
      reportedJobIds: [],
    };

    it('filters and sorts correctly across multiple criteria', () => {
      const results = filterAndSortJobs([SAMPLE_JOB_1, SAMPLE_JOB_2, SAMPLE_JOB_CLOSED], criteria, "newest");
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe("job-1");
    });
  });
});
