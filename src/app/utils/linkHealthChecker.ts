import type { Job } from "../types";

export interface JobHealthResult {
  jobId: string;
  slug: string;
  title: string;
  company: string;
  applyUrl: string;
  isAvailable: boolean;
  statusCode?: number;
  reason?: string;
  checkedAt: string;
}

export interface BatchHealthReport {
  results: JobHealthResult[];
  summary: {
    totalChecked: number;
    availableCount: number;
    staleCount: number;
    checkedAt: string;
  };
  staleJobIds: string[];
}

export interface LinkCheckOptions {
  timeoutMs?: number;
  userAgent?: string;
  concurrency?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_USER_AGENT = "UnlockHerTech-JobHealthChecker/1.0 (+https://unlockhertech.com)";

/**
 * Common text patterns returned when ATS or career pages close a job requisition.
 */
const CLOSED_JOB_PHRASES = [
  "this job is no longer available",
  "this position is no longer available",
  "this posting is closed",
  "job is no longer open",
  "position has been filled",
  "this job has expired",
  "no longer accepting applications",
  "job requisition closed",
  "page not found",
  "404 - not found",
  "looking for something else",
  "we couldn't find the page",
];

/**
 * Validates a single job listing's applyUrl by performing an HTTP check.
 */
export async function checkJobLinkHealth(
  job: Job,
  options: LinkCheckOptions = {}
): Promise<JobHealthResult> {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const userAgent = options.userAgent || DEFAULT_USER_AGENT;
  const checkedAt = new Date().toISOString();

  if (!job.applyUrl || !job.applyUrl.startsWith("http")) {
    return {
      jobId: job.id,
      slug: job.slug,
      title: job.title,
      company: job.company,
      applyUrl: job.applyUrl,
      isAvailable: false,
      reason: "Missing or invalid HTTP application URL",
      checkedAt,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(job.applyUrl, {
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    // 404, 410, 403, 500 errors
    if (res.status === 404 || res.status === 410) {
      return {
        jobId: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        applyUrl: job.applyUrl,
        isAvailable: false,
        statusCode: res.status,
        reason: `Requisition URL returned HTTP ${res.status} (${res.status === 410 ? "Gone" : "Not Found"})`,
        checkedAt,
      };
    }

    if (!res.ok) {
      return {
        jobId: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        applyUrl: job.applyUrl,
        isAvailable: false,
        statusCode: res.status,
        reason: `HTTP ${res.status} ${res.statusText}`,
        checkedAt,
      };
    }

    // Check if redirected to a generic /careers or /404 page
    const finalUrl = res.url.toLowerCase();
    if (
      finalUrl.endsWith("/careers") ||
      finalUrl.endsWith("/careers/") ||
      finalUrl.endsWith("/jobs") ||
      finalUrl.endsWith("/jobs/") ||
      finalUrl.includes("/404") ||
      finalUrl.includes("/not-found")
    ) {
      const originalPath = new URL(job.applyUrl).pathname;
      const finalPath = new URL(res.url).pathname;
      if (originalPath.length > finalPath.length + 3) {
        return {
          jobId: job.id,
          slug: job.slug,
          title: job.title,
          company: job.company,
          applyUrl: job.applyUrl,
          isAvailable: false,
          statusCode: res.status,
          reason: `Redirected to generic index: ${res.url}`,
          checkedAt,
        };
      }
    }

    // Sample body text for closed requisition signatures
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html") || contentType.includes("application/json")) {
      const htmlText = (await res.text()).toLowerCase();
      for (const phrase of CLOSED_JOB_PHRASES) {
        if (htmlText.includes(phrase)) {
          return {
            jobId: job.id,
            slug: job.slug,
            title: job.title,
            company: job.company,
            applyUrl: job.applyUrl,
            isAvailable: false,
            statusCode: res.status,
            reason: `Page content contains closed job notice: "${phrase}"`,
            checkedAt,
          };
        }
      }
    }

    return {
      jobId: job.id,
      slug: job.slug,
      title: job.title,
      company: job.company,
      applyUrl: job.applyUrl,
      isAvailable: true,
      statusCode: res.status,
      checkedAt,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : "Network error";
    const isTimeout = err instanceof Error && err.name === "AbortError";

    return {
      jobId: job.id,
      slug: job.slug,
      title: job.title,
      company: job.company,
      applyUrl: job.applyUrl,
      isAvailable: false,
      reason: isTimeout ? `Request timed out after ${timeoutMs}ms` : errorMessage,
      checkedAt,
    };
  }
}

/**
 * Checks link health across an entire batch of jobs with controlled concurrency.
 */
export async function checkAllJobsHealth(
  jobs: Job[],
  options: LinkCheckOptions = {}
): Promise<BatchHealthReport> {
  const concurrency = options.concurrency || 4;
  const results: JobHealthResult[] = [];
  const queue = [...jobs];

  async function worker() {
    while (queue.length > 0) {
      const job = queue.shift();
      if (!job) break;
      const res = await checkJobLinkHealth(job, options);
      results.push(res);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, jobs.length) }, () => worker());
  await Promise.all(workers);

  const staleJobIds = results.filter((r) => !r.isAvailable).map((r) => r.jobId);

  return {
    results,
    summary: {
      totalChecked: results.length,
      availableCount: results.filter((r) => r.isAvailable).length,
      staleCount: staleJobIds.length,
      checkedAt: new Date().toISOString(),
    },
    staleJobIds,
  };
}
