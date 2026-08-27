import type { Job } from "../../types";
import { cleanJobText, cleanHtmlDescription } from "../../utils/atsSync";
import { DEFAULT_POSTING_DATE, DEFAULT_VALID_THROUGH } from "./jobConstants";

export type JobSortOption = "newest" | "salary" | "company";

export interface JobFilterCriteria {
  searchQuery: string;
  selectedCategory: string;
  selectedRemote: string;
  selectedExperience: string;
  selectedMinSalary: number;
  selectedHighlight: string;
  showSavedOnly: boolean;
  savedJobIds: string[];
  reportedJobIds: string[];
}

export function isJobActive(job: Job, reportedJobIds: string[]): boolean {
  if (job.status === "closed" || job.status === "expired" || job.isArchived) {
    return false;
  }
  return !reportedJobIds.includes(job.id);
}

export function matchesSavedStatus(
  jobId: string,
  showSavedOnly: boolean,
  savedJobIds: string[]
): boolean {
  return !showSavedOnly || savedJobIds.includes(jobId);
}

export function matchesCategory(
  category: string | undefined,
  selectedCategory: string
): boolean {
  return selectedCategory === "all" || category === selectedCategory;
}

export function matchesRemote(
  remoteStatus: string | undefined,
  selectedRemote: string
): boolean {
  return selectedRemote === "all" || remoteStatus === selectedRemote;
}

export function matchesExperience(
  experienceLevel: string | undefined,
  selectedExperience: string
): boolean {
  return selectedExperience === "all" || experienceLevel === selectedExperience;
}

export function matchesMinSalary(
  minSalary: number | undefined,
  selectedMinSalary: number
): boolean {
  return selectedMinSalary <= 0 || (minSalary ?? 0) >= selectedMinSalary;
}

export function matchesHighlight(
  highlights: string[] | undefined,
  selectedHighlight: string
): boolean {
  return selectedHighlight === "all" || (highlights?.includes(selectedHighlight) ?? false);
}

export function matchesSearchQuery(job: Job, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchableFields = [
    job.title,
    job.company,
    job.location,
    job.whyApply,
    ...(job.techStack ?? []),
  ];

  return searchableFields.some((field) =>
    (field ?? "").toLowerCase().includes(normalizedQuery)
  );
}

export function matchesFilterCriteria(
  job: Job,
  criteria: JobFilterCriteria
): boolean {
  return (
    isJobActive(job, criteria.reportedJobIds) &&
    matchesSavedStatus(job.id, criteria.showSavedOnly, criteria.savedJobIds) &&
    matchesCategory(job.category, criteria.selectedCategory) &&
    matchesRemote(job.remoteStatus, criteria.selectedRemote) &&
    matchesExperience(job.experienceLevel, criteria.selectedExperience) &&
    matchesMinSalary(job.minSalary, criteria.selectedMinSalary) &&
    matchesHighlight(job.inclusiveHighlights, criteria.selectedHighlight) &&
    matchesSearchQuery(job, criteria.searchQuery)
  );
}

export function compareJobs(a: Job, b: Job, sortBy: JobSortOption): number {
  if (sortBy === "salary") {
    return (b.minSalary ?? 0) - (a.minSalary ?? 0);
  }
  if (sortBy === "company") {
    return a.company.localeCompare(b.company);
  }

  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  return timeB - timeA;
}

export function filterAndSortJobs(
  jobs: Job[],
  criteria: JobFilterCriteria,
  sortBy: JobSortOption
): Job[] {
  return jobs
    .filter((job) => matchesFilterCriteria(job, criteria))
    .sort((a, b) => compareJobs(a, b, sortBy));
}


export function buildJobsJsonLd(jobs: Job[]) {
  if (!jobs || jobs.length === 0) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Inclusive Tech Job Board | Unlock Her Tech",
      "description": "Curated technical and non-technical opportunities centered on women in tech and supportive allies with transparent pay.",
      "url": "https://unlockhertech.com/jobs",
    };
  }

  const jobPostings = jobs.slice(0, 30).map((job) => {
    let employmentTypeFormatted = "FULL_TIME";
    if (job.employmentType) {
      const type = job.employmentType.toLowerCase();
      if (type.includes("contract")) employmentTypeFormatted = "CONTRACTOR";
      else if (type.includes("part")) employmentTypeFormatted = "PART_TIME";
      else if (type.includes("intern")) employmentTypeFormatted = "INTERN";
      else if (type.includes("temporary")) employmentTypeFormatted = "TEMPORARY";
    }

    const isRemote =
      (job.remoteStatus || "").toLowerCase().includes("remote") ||
      (job.location || "").toLowerCase().includes("remote");

    return {
      "@type": "JobPosting",
      "title": cleanJobText(job.title),
      "description": cleanHtmlDescription(
        job.description ||
          job.whyApply ||
          `${job.title} at ${job.company}. Vetted for inclusive culture and salary transparency by Unlock Her Tech.`
      ),
      "datePosted": job.publishedAt ? new Date(job.publishedAt).toISOString() : DEFAULT_POSTING_DATE,
      "validThrough": job.deadline ? new Date(job.deadline).toISOString() : DEFAULT_VALID_THROUGH,
      "employmentType": employmentTypeFormatted,
      "hiringOrganization": {
        "@type": "Organization",
        "name": cleanJobText(job.company),
        "logo": job.companyLogo || job.companyLogoUrl || "https://unlockhertech.com/logo.png",
        "sameAs": "https://unlockhertech.com",
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cleanJobText(job.location || "Remote"),
        },
      },
      ...(isRemote
        ? {
            "jobLocationType": "TELECOMMUTE",
            "applicantLocationRequirements": {
              "@type": "Country",
              "name": (job.remoteStatus || "").includes("UK")
                ? "United Kingdom"
                : (job.remoteStatus || "").includes("US")
                ? "United States"
                : "Global",
            },
          }
        : {}),
      ...(job.minSalary
        ? {
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": job.currency || "USD",
              "value": {
                "@type": "QuantitativeValue",
                "value": job.minSalary,
                "unitText": "YEAR",
              },
            },
          }
        : {}),
      "directApply": true,
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": jobPostings,
  };
}
