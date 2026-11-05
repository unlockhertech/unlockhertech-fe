import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import confetti from "canvas-confetti";
import { useAssessment } from "../app/pages/assessment/useAssessment";
import {
  QUESTIONS,
  TOTAL_QUESTIONS_COUNT,
} from "../app/pages/assessment/assessmentData";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("useAssessment state machine and hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initializes with default intro stage and zero answers", () => {
    const { result } = renderHook(() => useAssessment());

    expect(result.current.stage).toBe("intro");
    expect(result.current.isIntroStage).toBe(true);
    expect(result.current.isActiveStage).toBe(false);
    expect(result.current.isResultsStage).toBe(false);
    expect(result.current.hasStarted).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.hasSavedProgress).toBe(false);
    expect(result.current.totalAnswered).toBe(0);
    expect(result.current.progressPercent).toBe(0);
    expect(result.current.activeCategoryIndex).toBe(0);
  });

  it("supports custom initial stage via options", () => {
    const { result } = renderHook(() =>
      useAssessment({ initialStage: "active" })
    );

    expect(result.current.stage).toBe("active");
    expect(result.current.isActiveStage).toBe(true);
    expect(result.current.hasStarted).toBe(true);
  });

  it("transitions stages via startAssessment, goToResults, and goToIntro", () => {
    const { result } = renderHook(() => useAssessment());

    act(() => {
      result.current.startAssessment();
    });
    expect(result.current.stage).toBe("active");
    expect(result.current.isActiveStage).toBe(true);
    expect(result.current.hasStarted).toBe(true);

    act(() => {
      result.current.goToResults();
    });
    expect(result.current.stage).toBe("results");
    expect(result.current.isResultsStage).toBe(true);

    act(() => {
      result.current.goToIntro();
    });
    expect(result.current.stage).toBe("intro");
    expect(result.current.isIntroStage).toBe(true);
  });

  it("navigates categories with nextCategory, prevCategory, and goToCategory with bounds checks", () => {
    const { result } = renderHook(() => useAssessment({ initialStage: "active" }));

    expect(result.current.activeCategoryIndex).toBe(0);
    expect(result.current.isFirstCategory).toBe(true);
    expect(result.current.isLastCategory).toBe(false);
    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);

    // Advance to next
    act(() => {
      result.current.nextCategory();
    });
    expect(result.current.activeCategoryIndex).toBe(1);
    expect(result.current.canGoPrev).toBe(true);

    // Jump to last category
    act(() => {
      result.current.goToCategory(3);
    });
    expect(result.current.activeCategoryIndex).toBe(3);
    expect(result.current.isLastCategory).toBe(true);
    expect(result.current.canGoNext).toBe(false);

    // Calling nextCategory on last category stays on last or bounds safe
    act(() => {
      result.current.nextCategory();
    });
    expect(result.current.activeCategoryIndex).toBe(3);

    // Prev category
    act(() => {
      result.current.prevCategory();
    });
    expect(result.current.activeCategoryIndex).toBe(2);

    // Invalid index bounds check
    act(() => {
      result.current.goToCategory(99);
    });
    expect(result.current.activeCategoryIndex).toBe(2);

    act(() => {
      result.current.goToCategory(-5);
    });
    expect(result.current.activeCategoryIndex).toBe(2);
  });

  it("calculates category progress and completion status accurately", () => {
    const { result } = renderHook(() => useAssessment());

    expect(result.current.isCurrentCategoryComplete).toBe(false);
    expect(result.current.currentCategoryProgress.answeredCount).toBe(0);
    expect(result.current.currentCategoryProgress.totalCount).toBe(4);

    // Answer 4 questions of category 1 (m1)
    const cat1Questions = QUESTIONS.filter((q) => q.catKey === "m1");
    act(() => {
      cat1Questions.forEach((q) => {
        result.current.handleSelectScore(q.id, 4);
      });
    });

    expect(result.current.isCurrentCategoryComplete).toBe(true);
    expect(result.current.currentCategoryProgress.answeredCount).toBe(4);
    expect(result.current.currentCategoryProgress.isComplete).toBe(true);
    expect(result.current.categoryProgressMap.m1.isComplete).toBe(true);
    expect(result.current.categoryProgressMap.m2.isComplete).toBe(false);
  });

  it("resumeAssessment jumps to the first incomplete category", () => {
    const { result } = renderHook(() => useAssessment());

    // Complete category 1 (m1)
    const cat1Questions = QUESTIONS.filter((q) => q.catKey === "m1");
    act(() => {
      cat1Questions.forEach((q) => {
        result.current.handleSelectScore(q.id, 5);
      });
    });

    expect(result.current.hasSavedProgress).toBe(true);

    act(() => {
      result.current.resumeAssessment();
    });

    expect(result.current.stage).toBe("active");
    // Should jump to index 1 (m2) since m1 is complete
    expect(result.current.activeCategoryIndex).toBe(1);
    expect(result.current.activeCategory.key).toBe("m2");
  });

  it("triggers celebration and marks completed when all 16 questions are answered", () => {
    const { result } = renderHook(() => useAssessment());

    act(() => {
      QUESTIONS.forEach((q) => {
        result.current.handleSelectScore(q.id, 5);
      });
    });

    expect(result.current.totalAnswered).toBe(TOTAL_QUESTIONS_COUNT);
    expect(result.current.progressPercent).toBe(100);
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.grandTotal).toBe(80);
    expect(result.current.readinessBadge.text).toBe("High Job Search Readiness");
    expect(confetti).toHaveBeenCalled();
  });

  it("handles reset clearing answers and resetting stage to intro", () => {
    // Mock globalThis.confirm
    vi.spyOn(globalThis, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useAssessment({ initialStage: "active" }));

    act(() => {
      result.current.handleSelectScore("m1-q1", 4);
      result.current.handleNotesChange("My reflections");
      result.current.goToCategory(2);
    });

    expect(result.current.totalAnswered).toBe(1);
    expect(result.current.reflectionNotes).toBe("My reflections");

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.stage).toBe("intro");
    expect(result.current.activeCategoryIndex).toBe(0);
    expect(result.current.totalAnswered).toBe(0);
    expect(result.current.reflectionNotes).toBe("");
  });
});
