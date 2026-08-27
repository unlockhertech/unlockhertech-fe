import { sanityClient } from "./sanity";
import { cleanMojibake } from "./atsSync";
import vettedJobsData from "../../../data/vetted-jobs.json";
import type { Job, JobRemoteStatus } from "../types";

const INITIAL_SEED_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer (Growth & Platform)",
    slug: "gitlab-senior-full-stack-engineer",
    company: "GitLab",
    companyLogoUrl: "https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png",
    category: "Engineering & Dev",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "$142,000 – $185,000 USD",
    minSalary: 142000,
    currency: "USD",
    techStack: ["React", "Ruby on Rails", "GraphQL", "PostgreSQL", "GitLab CI"],
    whyApply: "100% all-remote organization with public compensation bands, flexible asynchronous workflows, and $1,500/year professional development stipend.",
    description: "GitLab is seeking a Senior Full Stack Engineer to lead user onboarding and collaboration workflows.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave", "Learning Stipend"],
    applyUrl: "https://job-boards.greenhouse.io/gitlab/jobs/5231902",
    source: "GitLab Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: true,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

function cleanJobRecord(job: Job): Job {
  return {
    ...job,
    title: cleanMojibake(job.title),
    company: cleanMojibake(job.company),
    location: cleanMojibake(job.location),
    remoteStatus: cleanMojibake(job.remoteStatus) as JobRemoteStatus,
    salaryRange: cleanMojibake(job.salaryRange),
    whyApply: cleanMojibake(job.whyApply),
    description: cleanMojibake(job.description),
    techStack: job.techStack?.map(cleanMojibake),
    inclusiveHighlights: job.inclusiveHighlights?.map(cleanMojibake),
  };
}

export const CURATED_SEED_JOBS: Job[] = (
  Array.isArray(vettedJobsData) && vettedJobsData.length > 0
    ? (vettedJobsData as unknown as Job[]).map(cleanJobRecord)
    : INITIAL_SEED_JOBS.map(cleanJobRecord)
);

export async function getAllJobs(): Promise<Job[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      return CURATED_SEED_JOBS.filter((j) => (!j.status || j.status === "active") && !j.isArchived);
    }

    const query = `*[_type == "job" && (!defined(status) || status == "active") && (!defined(isArchived) || isArchived == false)] | order(publishedAt desc) {
      "id": _id,
      title,
      "slug": slug.current,
      company,
      "companyLogo": companyLogo.asset->url,
      companyLogoUrl,
      category,
      location,
      remoteStatus,
      employmentType,
      experienceLevel,
      salaryRange,
      minSalary,
      currency,
      techStack,
      whyApply,
      description,
      inclusiveHighlights,
      applyUrl,
      source,
      status,
      isArchived,
      featured,
      verifiedInclusive,
      publishedAt,
      deadline
    }`;

    const jobs: Job[] = await sanityClient.fetch(query);
    if (!jobs || jobs.length === 0) {
      return CURATED_SEED_JOBS.filter((j) => (!j.status || j.status === "active") && !j.isArchived);
    }

    const now = Date.now();
    return jobs
      .map(cleanJobRecord)
      .filter((job) => {
        if (job.deadline) {
          const deadlineTime = new Date(job.deadline).getTime();
          if (!Number.isNaN(deadlineTime) && deadlineTime < now) {
            return false;
          }
        }
        return true;
      });
  } catch (error) {
    console.warn("Error fetching jobs from Sanity, using curated seed list:", error);
    return CURATED_SEED_JOBS.filter((j) => (!j.status || j.status === "active") && !j.isArchived);
  }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      const found = CURATED_SEED_JOBS.find((j) => j.slug === slug);
      return found ? cleanJobRecord(found) : null;
    }

    const query = `*[_type == "job" && slug.current == $slug][0] {
      "id": _id,
      title,
      "slug": slug.current,
      company,
      "companyLogo": companyLogo.asset->url,
      companyLogoUrl,
      category,
      location,
      remoteStatus,
      employmentType,
      experienceLevel,
      salaryRange,
      minSalary,
      currency,
      techStack,
      whyApply,
      description,
      inclusiveHighlights,
      applyUrl,
      source,
      featured,
      verifiedInclusive,
      publishedAt,
      deadline
    }`;

    const job = await sanityClient.fetch(query, { slug });
    if (job) return cleanJobRecord(job);
    const found = CURATED_SEED_JOBS.find((j) => j.slug === slug);
    return found ? cleanJobRecord(found) : null;
  } catch (error) {
    console.warn(`Error fetching job "${slug}" from Sanity, checking seed list:`, error);
    const found = CURATED_SEED_JOBS.find((j) => j.slug === slug);
    return found ? cleanJobRecord(found) : null;
  }
}
