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
function createStaleResult(
  job: Job,
  reason: string,
  checkedAt: string,
  statusCode?: number
): JobHealthResult {
  return {
    jobId: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    applyUrl: job.applyUrl,
    isAvailable: false,
    statusCode,
    reason,
    checkedAt,
  };
}

function isGenericRedirect(resUrl: string, applyUrl: string): boolean {
  const finalUrl = resUrl.toLowerCase();
  const isGenericPath =
    finalUrl.endsWith("/careers") ||
    finalUrl.endsWith("/careers/") ||
    finalUrl.endsWith("/jobs") ||
    finalUrl.endsWith("/jobs/") ||
    finalUrl.includes("/404") ||
    finalUrl.includes("/not-found");

  if (!isGenericPath) return false;

  try {
    const originalPath = new URL(applyUrl).pathname;
    const finalPath = new URL(resUrl).pathname;
    return originalPath.length > finalPath.length + 3;
  } catch (err) {
    console.debug("Failed to compare URL paths during redirect check:", err);
    return false;
  }
}

async function checkBodyForClosedPhrase(res: Response): Promise<string | null> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/json")) {
    return null;
  }

  const htmlText = (await res.text()).toLowerCase();
  for (const phrase of CLOSED_JOB_PHRASES) {
    if (htmlText.includes(phrase)) {
      return phrase;
    }
  }
  return null;
}

function evaluateResponseStatus(job: Job, res: Response, checkedAt: string): JobHealthResult | null {
  if (res.status === 404 || res.status === 410) {
    const statusLabel = res.status === 410 ? "Gone" : "Not Found";
    return createStaleResult(
      job,
      `Requisition URL returned HTTP ${res.status} (${statusLabel})`,
      checkedAt,
      res.status
    );
  }

  if (!res.ok) {
    return createStaleResult(job, `HTTP ${res.status} ${res.statusText}`, checkedAt, res.status);
  }

  if (isGenericRedirect(res.url, job.applyUrl)) {
    return createStaleResult(job, `Redirected to generic index: ${res.url}`, checkedAt, res.status);
  }

  return null;
}

function formatFetchError(
  job: Job,
  err: unknown,
  timeoutMs: number,
  checkedAt: string
): JobHealthResult {
  const errorMessage = err instanceof Error ? err.message : "Network error";
  const isTimeout = err instanceof Error && err.name === "AbortError";
  const reason = isTimeout ? `Request timed out after ${timeoutMs}ms` : errorMessage;

  return createStaleResult(job, reason, checkedAt);
}

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
    return createStaleResult(job, "Missing or invalid HTTP application URL", checkedAt);
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

    const statusError = evaluateResponseStatus(job, res, checkedAt);
    if (statusError) {
      return statusError;
    }

    const closedPhrase = await checkBodyForClosedPhrase(res);
    if (closedPhrase) {
      return createStaleResult(
        job,
        `Page content contains closed job notice: "${closedPhrase}"`,
        checkedAt,
        res.status
      );
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
    return formatFetchError(job, err, timeoutMs, checkedAt);
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
