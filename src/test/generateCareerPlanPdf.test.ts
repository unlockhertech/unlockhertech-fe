import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateCareerPlanPdf, sanitizeForPdf } from "../app/pages/assessment/generateCareerPlanPdf";
import { RECOMMENDATIONS } from "../app/pages/assessment/assessmentData";

describe("generateCareerPlanPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sanitizes emojis and unicode symbols for clean PDF rendering", () => {
    expect(sanitizeForPdf("🚀 High Job Search Readiness")).toBe("High Job Search Readiness");
    expect(sanitizeForPdf("⚡ Developing Transitioner")).toBe("Developing Transitioner");
    expect(sanitizeForPdf("🌱 Foundations Stage")).toBe("Foundations Stage");
    expect(sanitizeForPdf("🎯 Technical Literacy • Level 1")).toBe("Technical Literacy | Level 1");
    expect(sanitizeForPdf("“Smart Quotes” and ‘Apostrophes’ — Em Dash…")).toBe('"Smart Quotes" and \'Apostrophes\' - Em Dash...');
  });

  it("generates and downloads a career plan PDF successfully without errors", async () => {
    const mockOptions = {
      scores: { m1: 18, m2: 15, m3: 12, m4: 16 },
      grandTotal: 61,
      totalAnswered: 16,
      readinessBadge: {
        text: "⚡ Developing Transitioner",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      },
      recommendation: RECOMMENDATIONS.m3,
      reflectionNotes: "1. Build 2 full-stack projects. 2. Practice STAR responses daily.",
      candidateName: "Jane Doe",
    };

    await expect(generateCareerPlanPdf(mockOptions)).resolves.not.toThrow();
  });

  it("handles empty reflection notes and partial assessment answers", async () => {
    const mockOptions = {
      scores: { m1: 5, m2: 4, m3: 3, m4: 2 },
      grandTotal: 14,
      totalAnswered: 4,
      readinessBadge: {
        text: "In Progress (4/16 Answered)",
        className: "bg-stone-100 text-stone-700 border-stone-200",
      },
      recommendation: RECOMMENDATIONS.m4,
      reflectionNotes: "",
    };

    await expect(generateCareerPlanPdf(mockOptions)).resolves.not.toThrow();
  });
});
