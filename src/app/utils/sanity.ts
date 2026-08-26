import { createClient } from "@sanity/client";
import {createImageUrlBuilder} from "@sanity/image-url";
import type {SanityImageSource} from "@sanity/image-url";
import type { BlogPost, ExternalEvent, Resource } from "../types";
import { cleanMojibake } from "./atsSync";
import vettedJobsData from "../../../data/vetted-jobs.json";


export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2024-03-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

export function urlForOptimized(source: SanityImageSource, width = 800, quality = 80) {
  return builder.image(source).width(width).quality(quality).auto("format").url();
}


function calculateReadingTime(content: string = ""): string {
  const wordsPerMinute = 225;
  const noOfWords = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
  return `${minutes} min read`;
}

/**
 * Fetches all blog posts, sorted by date descending.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured. Returning empty blog post list.");
      return [];
    }

    const query = `*[_type == "post"] | order(date desc) {
      title,
      date,
      author,
      tags,
      canonicalUrl,
      "slug": slug.current,
      "imageUrl": imageUrl.asset->url,
      content,
      body
    }`;

    const posts: BlogPost[] = await sanityClient.fetch(query);
    return posts.map((post) => ({
      ...post,
      readingTime: calculateReadingTime(post.content || ""),
    }));
  } catch (error) {
    console.error("Error fetching blog posts from Sanity:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured.");
      return null;
    }

    const query = `*[_type == "post" && slug.current == $slug][0] {
      title,
      date,
      author,
      tags,
      canonicalUrl,
      "slug": slug.current,
      "imageUrl": imageUrl.asset->url,
      content,
      body
    }`;

    const post = await sanityClient.fetch(query, { slug });
    if (!post) return null;

    return {
      ...post,
      readingTime: calculateReadingTime(post.content || ""),
    };
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}" from Sanity:`, error);
    return null;
  }
}

/**
 * Fetches external events, sorted by date ascending.
 * Automatically filters out past events unless `includePast` is set to true.
 */
export async function getAllExternalEvents(includePast = false): Promise<ExternalEvent[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured. Returning empty event list.");
      return [];
    }

    const query = `*[_type == "event"] | order(date asc) {
      title,
      date,
      platform,
      urlOrId,
      "slug": slug.current,
      "image": image.asset->url
    }`;

    const events: ExternalEvent[] = await sanityClient.fetch(query);
    if (includePast) return events;

    const now = Date.now();
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // Keep event card visible for 3 hours after start time

    return events.filter((event) => {
      const eventTime = new Date(event.date).getTime();
      if (Number.isNaN(eventTime)) return true;
      return eventTime + THREE_HOURS_MS >= now;
    });
  } catch (error) {
    console.error("Error fetching external events from Sanity:", error);
    return [];
  }
}

/**
 * Fetches all published PDF resources from Sanity.
 */
export async function getAllResources(): Promise<Resource[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.warn("Sanity Project ID not configured. Returning empty resources list.");
      return [];
    }

    const query = `*[_type == "resource" && isPublished != false] | order(publishedAt desc) {
      "id": _id,
      title,
      "slug": slug.current,
      description,
      category,
      "pdfUrl": coalesce(pdfFile.asset->url, externalPdfUrl, ""),
      fileSize,
      pageCount,
      accentColor,
      isPublished,
      publishedAt
    }`;

    const resources: Resource[] = await sanityClient.fetch(query);
    return resources;
  } catch (error) {
    console.error("Error fetching resources from Sanity:", error);
    return [];
  }
}

/**
 * Curated initial job postings vetted against Unlock Her Tech inclusivity & transparency standards.
 * Each entry links directly to the specific job requisition / ATS posting.
 */
const INITIAL_SEED_JOBS: import("../types").Job[] = [
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
    description: "GitLab is seeking a Senior Full Stack Engineer to lead user onboarding and collaboration workflows. You will architect high-traffic frontend features in React and GraphQL, collaborate across globally distributed time zones, and contribute to an open-source product used by millions.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave", "Learning Stipend"],
    applyUrl: "https://job-boards.greenhouse.io/gitlab/jobs/5231902",
    source: "GitLab Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: true,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-2",
    title: "Product Designer (Core User Experience)",
    slug: "buffer-product-designer-core-ux",
    company: "Buffer",
    companyLogoUrl: "https://buffer.com/static/images/buffer-logo.svg",
    category: "Product & Design",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    salaryRange: "$125,000 – $155,000 USD",
    minSalary: 125000,
    currency: "USD",
    techStack: ["Figma", "Design Systems", "User Research", "Prototyping", "WCAG a11y"],
    whyApply: "Industry pioneer of public salary formulas, a 4-day work week (32 hrs/wk at full salary), equal 16-week parental leave, and profit-sharing.",
    description: "As a Product Designer at Buffer, you will partner with engineering and product leads to shape intuitive, delightful social publishing experiences. You will conduct user research, craft accessible UI components, and maintain our cross-platform design system.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave"],
    applyUrl: "https://jobs.lever.co/buffer/9079a405-c49b-449e-b964-6d9bfe65d0a1",
    source: "Buffer Lever ATS",
    status: "active",
    isArchived: false,
    featured: true,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-3",
    title: "Staff Data Scientist (Risk & Decision Systems)",
    slug: "monzo-staff-data-scientist",
    company: "Monzo",
    companyLogoUrl: "https://monzo.com/static/images/favicon.png",
    category: "Data & Research",
    location: "Remote (UK/Europe) / London (Hybrid)",
    remoteStatus: "Remote (UK/Europe)",
    employmentType: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "£105,000 – £130,000 GBP + Equity",
    minSalary: 135000,
    currency: "GBP",
    techStack: ["Python", "SQL", "Machine Learning", "BigQuery", "dbt", "PyTorch"],
    whyApply: "Public commitment to closing the gender pay gap, 26 weeks equal paid parental leave for all caregivers, and a neurodiversity-affirming interview experience.",
    description: "Monzo is hiring a Staff Data Scientist to architect risk intelligence models and machine learning pipelines. You will lead cross-functional algorithmic design, mentor junior data practitioners, and partner directly with engineering leadership.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Parental Leave", "Neurodiversity Friendly", "Diverse Panel"],
    applyUrl: "https://job-boards.greenhouse.io/monzo/jobs/6810291",
    source: "Monzo Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: true,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-4",
    title: "Technical Community Manager & DevRel",
    slug: "zapier-technical-community-manager",
    company: "Zapier",
    companyLogoUrl: "https://cdn.zapier.com/zapier/images/favicon.ico",
    category: "Non-Technical Tech",
    location: "Remote (US/Americas)",
    remoteStatus: "Remote (US/Americas)",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    salaryRange: "$95,000 – $120,000 USD",
    minSalary: 95000,
    currency: "USD",
    techStack: ["Developer Relations", "Community Strategy", "Technical Writing", "Zapier APIs"],
    whyApply: "100% remote pioneer since 2011, $2,000 home office allowance, 14 weeks paid caregiver leave, and active Women & Allies Employee Resource Groups.",
    description: "Help build and engage the next generation of automation builders. You will organize virtual hackathons, write technical tutorials, champion developer feedback internally, and support underrepresented creators building on Zapier.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Learning Stipend", "LGBTQ+ Safe"],
    applyUrl: "https://jobs.ashbyhq.com/zapier/4b3f88c1-19d2-4309-8b01-9a7e80d2ef31",
    source: "Zapier Ashby ATS",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-5",
    title: "Senior Backend Engineer (Payments & Billing)",
    slug: "automattic-senior-backend-engineer",
    company: "Automattic (WordPress.com)",
    companyLogoUrl: "https://automattic.com/favicon.ico",
    category: "Engineering & Dev",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "$135,000 – $165,000 USD",
    minSalary: 135000,
    currency: "USD",
    techStack: ["PHP", "Node.js", "Stripe API", "MySQL", "Distributed Architecture"],
    whyApply: "Work from anywhere on the planet, 2-3 months paid sabbatical every 5 years, comprehensive wellness stipends, and open learning allowances.",
    description: "Automattic is looking for a backend engineer to build resilient subscription infrastructure processing millions in transactions across WordPress.com and WooCommerce. Requires strong API architecture skills and asynchronous communication habits.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave"],
    applyUrl: "https://job-boards.greenhouse.io/automattic/jobs/4820194",
    source: "Automattic Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-6",
    title: "Contract Frontend Specialist (Privacy & UI Components)",
    slug: "duckduckgo-contract-frontend-specialist",
    company: "DuckDuckGo",
    companyLogoUrl: "https://duckduckgo.com/favicon.ico",
    category: "Freelance & Contract",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Contract",
    experienceLevel: "Senior",
    salaryRange: "$85 – $110 / hr USD ($140,000 – $175,000 Annualized)",
    minSalary: 140000,
    currency: "USD",
    techStack: ["TypeScript", "Vanilla JS", "Web Extensions", "Design Systems", "a11y"],
    whyApply: "100% async contract engagement with transparent hourly rates, zero mandatory synchronous meetings, and direct impact on privacy tools.",
    description: "Join DuckDuckGo as an independent contractor building privacy-protecting browser extensions and responsive web interfaces. You will develop accessible UI components with high performance standards and comprehensive unit tests.",
    inclusiveHighlights: ["Salary Transparent", "Flexible Hours", "Verified Inclusive"],
    applyUrl: "https://job-boards.greenhouse.io/duckduckgo/jobs/5910243",
    source: "DuckDuckGo Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-7",
    title: "UX Researcher & Technical Content Strategist",
    slug: "coursera-ux-researcher-content",
    company: "Coursera",
    companyLogoUrl: "https://www.coursera.org/favicon.ico",
    category: "Product & Design",
    location: "Remote (US/Americas)",
    remoteStatus: "Remote (US/Americas)",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    salaryRange: "$110,000 – $135,000 USD",
    minSalary: 110000,
    currency: "USD",
    techStack: ["Qualitative Research", "User Journey Mapping", "Figma", "Accessibility"],
    whyApply: "Mission-driven education platform, structured sponsorship programs for women entering technical leadership, and generous reproductive health benefits.",
    description: "Coursera is seeking a UX Researcher to lead discovery studies with career switchers and enterprise learners. You will turn qualitative insights into actionable product roadmaps for engineering and design teams.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Diverse Panel", "Learning Stipend"],
    applyUrl: "https://jobs.lever.co/coursera/3a8c1f09-5481-42cb-b72e-8392019a11ef",
    source: "Coursera Lever ATS",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-8",
    title: "Junior Analytics Engineer",
    slug: "carta-junior-analytics-engineer",
    company: "Carta",
    companyLogoUrl: "https://carta.com/favicon.ico",
    category: "Data & Research",
    location: "Remote (US/Americas)",
    remoteStatus: "Remote (US/Americas)",
    employmentType: "Full-time",
    experienceLevel: "Junior",
    salaryRange: "$90,000 – $115,000 USD + Equity",
    minSalary: 90000,
    currency: "USD",
    techStack: ["SQL", "dbt", "Snowflake", "Looker", "Python"],
    whyApply: "Dedicated junior mentorship program pairing career switchers with senior mentors, transparent equity education, and $2,500/year learning stipend.",
    description: "Carta is hiring a Junior Analytics Engineer to model venture capital and cap table data pipelines. Ideal for early-career technologists or bootcamp/degree graduates with strong SQL fundamentals and analytical curiosity.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Learning Stipend", "Diverse Panel"],
    applyUrl: "https://job-boards.greenhouse.io/carta/jobs/5712093",
    source: "Carta Greenhouse ATS",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function cleanJobRecord(job: import("../types").Job): import("../types").Job {
  return {
    ...job,
    title: cleanMojibake(job.title),
    company: cleanMojibake(job.company),
    location: cleanMojibake(job.location),
    remoteStatus: cleanMojibake(job.remoteStatus) as import("../types").JobRemoteStatus,
    salaryRange: cleanMojibake(job.salaryRange),
    whyApply: cleanMojibake(job.whyApply),
    description: cleanMojibake(job.description),
    techStack: job.techStack?.map(cleanMojibake),
    inclusiveHighlights: job.inclusiveHighlights?.map(cleanMojibake),
  };
}

export const CURATED_SEED_JOBS: import("../types").Job[] = (
  Array.isArray(vettedJobsData) && vettedJobsData.length > 0
    ? (vettedJobsData as unknown as import("../types").Job[]).map(cleanJobRecord)
    : INITIAL_SEED_JOBS.map(cleanJobRecord)
);

/**
 * Fetches all published, active job postings from Sanity, falling back to curated seed jobs.
 * Automatically filters out closed, archived, and expired jobs.
 */
export async function getAllJobs(): Promise<import("../types").Job[]> {
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

    const jobs: import("../types").Job[] = await sanityClient.fetch(query);
    if (!jobs || jobs.length === 0) {
      return CURATED_SEED_JOBS.filter((j) => (!j.status || j.status === "active") && !j.isArchived);
    }

    // Filter out jobs where deadline has passed
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

/**
 * Fetches a single job posting by slug.
 */
export async function getJobBySlug(slug: string): Promise<import("../types").Job | null> {
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


