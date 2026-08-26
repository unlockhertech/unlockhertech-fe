import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkJobLinkHealth, checkAllJobsHealth } from "../app/utils/linkHealthChecker";
import type { Job } from "../app/types";

const MOCK_JOB: Job = {
  id: "test-job-1",
  title: "Frontend Engineer",
  slug: "testcorp-frontend-engineer",
  company: "TestCorp",
  category: "Engineering & Dev",
  location: "Remote (Global)",
  remoteStatus: "Remote (Global)",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  salaryRange: "$130,000 – $160,000 USD",
  whyApply: "Inclusive culture",
  description: "Build clean UIs",
  applyUrl: "https://job-boards.greenhouse.io/testcorp/jobs/123456",
};

describe("linkHealthChecker", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("identifies a live 200 OK job requisition as available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      url: "https://job-boards.greenhouse.io/testcorp/jobs/123456",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => "<html><body><h1>Frontend Engineer</h1><button>Apply Now</button></body></html>",
    } as unknown as Response);

    const result = await checkJobLinkHealth(MOCK_JOB);
    expect(result.isAvailable).toBe(true);
    expect(result.statusCode).toBe(200);
  });

  it("identifies a 404 Not Found job link as unavailable / stale", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      url: "https://job-boards.greenhouse.io/testcorp/jobs/123456",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => "Not Found",
    } as unknown as Response);

    const result = await checkJobLinkHealth(MOCK_JOB);
    expect(result.isAvailable).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.reason).toContain("404");
  });

  it("identifies a page containing a 'job is no longer available' notice as closed", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      url: "https://job-boards.greenhouse.io/testcorp/jobs/123456",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => "<div>Sorry, this job is no longer available. Check out other roles.</div>",
    } as unknown as Response);

    const result = await checkJobLinkHealth(MOCK_JOB);
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toContain("this job is no longer available");
  });

  it("identifies redirect from specific job to generic /careers page as stale", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      url: "https://testcorp.com/careers",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => "<html><body><h1>Careers at TestCorp</h1></body></html>",
    } as unknown as Response);

    const result = await checkJobLinkHealth(MOCK_JOB);
    expect(result.isAvailable).toBe(false);
    expect(result.reason).toContain("Redirected to generic index");
  });

  it("runs batch health checking across multiple jobs", async () => {
    const jobLive: Job = { ...MOCK_JOB, id: "live-1", applyUrl: "https://example.com/job/1" };
    const jobDead: Job = { ...MOCK_JOB, id: "dead-2", applyUrl: "https://example.com/job/2" };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: "https://example.com/job/1",
        headers: new Headers({ "content-type": "text/html" }),
        text: async () => "Live Posting",
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        url: "https://example.com/job/2",
        headers: new Headers({ "content-type": "text/html" }),
        text: async () => "Not Found",
      } as unknown as Response);

    const batch = await checkAllJobsHealth([jobLive, jobDead]);
    expect(batch.summary.totalChecked).toBe(2);
    expect(batch.summary.availableCount).toBe(1);
    expect(batch.summary.staleCount).toBe(1);
    expect(batch.staleJobIds).toEqual(["dead-2"]);
  });
});
