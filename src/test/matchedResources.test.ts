import { describe, it, expect } from "vitest";
import { getAutoMatchedResources } from "../app/pages/assessment/matchedResources";

describe("getAutoMatchedResources", () => {
  it("automatically matches low-scoring categories (< 60% / < 12 points) to specific guides and podcasts", () => {
    // Category m4 (Networking) scored 8/20 (< 60%)
    const scores = {
      m1: 16,
      m2: 15,
      m3: 14,
      m4: 8,
    };

    const matches = getAutoMatchedResources(scores, 16);
    expect(matches).toHaveLength(1);
    expect(matches[0].categoryKey).toBe("m4");
    expect(matches[0].categoryTitle).toMatch(/Networking/i);
    expect(matches[0].currentScore).toBe(8);
    expect(matches[0].percentage).toBe(40);
    expect(matches[0].isUnderThreshold).toBe(true);

    // Verify matched resources contain Guide 5 and networking recommendations
    const guideResource = matches[0].resources.find((r) => r.type === "guide");
    expect(guideResource).toBeDefined();
    expect(guideResource?.title).toMatch(/Guide 5: Transferable Skills & Networking Strategy/i);

    const podcastResource = matches[0].resources.find((r) => r.type === "podcast");
    expect(podcastResource).toBeDefined();
    expect(podcastResource?.title).toMatch(/Building Sustainable Communities/i);
  });

  it("matches multiple categories when several scores fall below 60%", () => {
    const scores = {
      m1: 10, // 50%
      m2: 18, // 90%
      m3: 6,  // 30%
      m4: 16, // 80%
    };

    const matches = getAutoMatchedResources(scores, 16);
    expect(matches).toHaveLength(2);
    expect(matches.map((m) => m.categoryKey)).toEqual(["m1", "m3"]);

    // m1 recommendations
    expect(matches[0].resources.some((r) => r.title.includes("Guide 1"))).toBe(true);

    // m3 recommendations
    expect(matches[1].resources.some((r) => r.title.includes("She Leads Tech"))).toBe(true);
  });

  it("falls back to lowest-scoring category when all scores are >= 60%", () => {
    const scores = {
      m1: 18,
      m2: 17,
      m3: 14, // lowest
      m4: 19,
    };

    const matches = getAutoMatchedResources(scores, 16);
    expect(matches).toHaveLength(1);
    expect(matches[0].categoryKey).toBe("m3");
    expect(matches[0].isUnderThreshold).toBe(false);
  });
});
