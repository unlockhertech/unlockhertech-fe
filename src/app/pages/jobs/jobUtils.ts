import type { Job } from "../../types";
import { cleanJobText, cleanHtmlDescription } from "../../utils/atsSync";
import { DEFAULT_POSTING_DATE, DEFAULT_VALID_THROUGH } from "./jobConstants";

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
