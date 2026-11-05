import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  QUESTIONS,
  CATEGORIES,
  RECOMMENDATIONS,
  TOTAL_QUESTIONS_COUNT,
  type CategoryKey,
  type AssessmentScores,
} from "./assessmentData";

const STORAGE_KEY_ANSWERS = "uht_assessment_answers";
const STORAGE_KEY_NOTES = "uht_assessment_notes";

export type AssessmentStage = "intro" | "active" | "results";

export interface ReadinessBadgeInfo {
  text: string;
  className: string;
}

export interface CategoryProgress {
  categoryKey: CategoryKey;
  answeredCount: number;
  totalCount: number;
  progressPercent: number;
  isComplete: boolean;
}

export interface UseAssessmentOptions {
  initialStage?: AssessmentStage;
  defaultViewMode?: "worksheet" | "focus";
}

function calculateReadinessBadge(
  totalAnswered: number,
  grandTotal: number
): ReadinessBadgeInfo {
  if (totalAnswered < TOTAL_QUESTIONS_COUNT) {
    return {
      text: `In Progress (${totalAnswered}/${TOTAL_QUESTIONS_COUNT} Answered)`,
      className: "bg-stone-100 text-stone-700 border-stone-200",
    };
  }
  if (grandTotal >= 65) {
    return {
      text: "High Job Search Readiness",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  }
  if (grandTotal >= 45) {
    return {
      text: "Developing Transitioner",
      className: "bg-amber-100 text-amber-800 border-amber-200",
    };
  }
  return {
    text: "Foundations Stage",
    className: "bg-pink-100 text-brand-coral border-pink-200",
  };
}

export function useAssessment(options?: Readonly<UseAssessmentOptions>) {
  const [stage, setStage] = useState<AssessmentStage>(
    options?.initialStage ?? "intro"
  );

  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn("Error loading saved assessment answers:", e);
      return {};
    }
  });

  const [reflectionNotes, setReflectionNotes] = useState<string>(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      return savedNotes || "";
    } catch (e) {
      console.warn("Error loading saved assessment notes:", e);
      return "";
    }
  });

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [viewMode, setViewMode] = useState<"worksheet" | "focus">(
    options?.defaultViewMode ?? "focus"
  );
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const hasCelebratedRef = useRef(false);

  const triggerCelebrationConfetti = useCallback(() => {
    try {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#b42970", "#e8563a", "#fed43f", "#5f9de3", "#72c472"],
        });
      }
    } catch (e) {
      console.warn("Confetti effect failed:", e);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToResults = useCallback(() => {
    const resultsElement = document.getElementById("results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (stage === "results") {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [stage]);

  const handleSelectScore = useCallback(
    (questionId: string, value: number) => {
      setAnswers((prev) => {
        const prevCount = Object.keys(prev).length;
        const updated = { ...prev, [questionId]: value };
        const newCount = Object.keys(updated).length;

        try {
          localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to save answer:", e);
        }

        if (
          newCount === TOTAL_QUESTIONS_COUNT &&
          prevCount < TOTAL_QUESTIONS_COUNT &&
          !hasCelebratedRef.current
        ) {
          hasCelebratedRef.current = true;
          triggerCelebrationConfetti();
        }

        return updated;
      });
    },
    [triggerCelebrationConfetti]
  );

  const handleNotesChange = useCallback((val: string) => {
    setReflectionNotes(val);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, val);
    } catch (e) {
      console.warn("Failed to save notes:", e);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (globalThis.confirm("Are you sure you want to reset your responses?")) {
      setAnswers({});
      setReflectionNotes("");
      setStage("intro");
      setViewMode("focus");
      setActiveCategoryIndex(0);
      hasCelebratedRef.current = false;
      try {
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        localStorage.removeItem(STORAGE_KEY_NOTES);
      } catch (e) {
        console.warn("Failed to clear localStorage on reset:", e);
      }
    }
  }, []);

  const totalAnswered = useMemo(() => Object.keys(answers).length, [answers]);
  const progressPercent = useMemo(
    () => Math.round((totalAnswered / TOTAL_QUESTIONS_COUNT) * 100),
    [totalAnswered]
  );

  const isCompleted = useMemo(
    () => totalAnswered === TOTAL_QUESTIONS_COUNT,
    [totalAnswered]
  );

  const hasSavedProgress = useMemo(
    () => totalAnswered > 0 && totalAnswered < TOTAL_QUESTIONS_COUNT,
    [totalAnswered]
  );

  const scores: AssessmentScores = useMemo(() => {
    const calculated: AssessmentScores = { m1: 0, m2: 0, m3: 0, m4: 0 };
    QUESTIONS.forEach((q) => {
      if (answers[q.id]) {
        calculated[q.catKey] += answers[q.id];
      }
    });
    return calculated;
  }, [answers]);

  const grandTotal = useMemo(
    () => scores.m1 + scores.m2 + scores.m3 + scores.m4,
    [scores]
  );

  const minCat: CategoryKey = useMemo(() => {
    let lowest: CategoryKey = "m1";
    let minVal = scores.m1;

    (Object.keys(scores) as CategoryKey[]).forEach((cat) => {
      if (scores[cat] < minVal) {
        minVal = scores[cat];
        lowest = cat;
      }
    });
    return lowest;
  }, [scores]);

  const readinessBadge: ReadinessBadgeInfo = useMemo(
    () => calculateReadinessBadge(totalAnswered, grandTotal),
    [totalAnswered, grandTotal]
  );

  const categoryProgressMap = useMemo(() => {
    const map: Record<CategoryKey, CategoryProgress> = {
      m1: { categoryKey: "m1", answeredCount: 0, totalCount: 0, progressPercent: 0, isComplete: false },
      m2: { categoryKey: "m2", answeredCount: 0, totalCount: 0, progressPercent: 0, isComplete: false },
      m3: { categoryKey: "m3", answeredCount: 0, totalCount: 0, progressPercent: 0, isComplete: false },
      m4: { categoryKey: "m4", answeredCount: 0, totalCount: 0, progressPercent: 0, isComplete: false },
    };

    CATEGORIES.forEach((cat) => {
      const catQuestions = QUESTIONS.filter((q) => q.catKey === cat.key);
      const totalCount = catQuestions.length;
      const answeredCount = catQuestions.filter(
        (q) => typeof answers[q.id] === "number" && answers[q.id] > 0
      ).length;
      const percent =
        totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

      map[cat.key] = {
        categoryKey: cat.key,
        answeredCount,
        totalCount,
        progressPercent: percent,
        isComplete: totalCount > 0 && answeredCount === totalCount,
      };
    });

    return map;
  }, [answers]);

  const categoryProgressList = useMemo(
    () => CATEGORIES.map((cat) => categoryProgressMap[cat.key]),
    [categoryProgressMap]
  );

  const activeCategory = useMemo(() => {
    const safeIndex =
      activeCategoryIndex >= 0 && activeCategoryIndex < CATEGORIES.length
        ? activeCategoryIndex
        : 0;
    return CATEGORIES[safeIndex] ?? CATEGORIES[0];
  }, [activeCategoryIndex]);

  const activeCategoryQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.catKey === activeCategory.key),
    [activeCategory]
  );

  const currentCategoryProgress = useMemo(
    () => categoryProgressMap[activeCategory.key],
    [categoryProgressMap, activeCategory]
  );

  const isCurrentCategoryComplete = useMemo(
    () => currentCategoryProgress?.isComplete ?? false,
    [currentCategoryProgress]
  );

  const isFirstCategory = activeCategoryIndex === 0;
  const isLastCategory = activeCategoryIndex === CATEGORIES.length - 1;
  const canGoPrev = activeCategoryIndex > 0;
  const canGoNext = activeCategoryIndex < CATEGORIES.length - 1;

  const goToCategory = useCallback((index: number) => {
    if (index >= 0 && index < CATEGORIES.length) {
      setActiveCategoryIndex(index);
    }
  }, []);

  const nextCategory = useCallback(() => {
    setActiveCategoryIndex((prev) =>
      prev < CATEGORIES.length - 1 ? prev + 1 : prev
    );
  }, []);

  const prevCategory = useCallback(() => {
    setActiveCategoryIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const startAssessment = useCallback(
    (mode: "worksheet" | "focus" = "focus") => {
      setStage("active");
      setViewMode(mode);
      setActiveCategoryIndex(0);
    },
    []
  );

  const resumeAssessment = useCallback(() => {
    setStage("active");
    setViewMode("focus");
    const firstIncompleteIdx = CATEGORIES.findIndex(
      (cat) => !categoryProgressMap[cat.key]?.isComplete
    );
    setActiveCategoryIndex(firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0);
  }, [categoryProgressMap]);

  const goToResults = useCallback(() => {
    setStage("results");
    scrollToResults();
  }, [scrollToResults]);

  const goToIntro = useCallback(() => {
    setStage("intro");
  }, []);

  return {
    stage,
    setStage,
    hasStarted: stage !== "intro",
    isIntroStage: stage === "intro",
    isActiveStage: stage === "active",
    isResultsStage: stage === "results",
    isCompleted,
    hasSavedProgress,
    startAssessment,
    resumeAssessment,
    goToResults,
    goToIntro,
    answers,
    reflectionNotes,
    showStickyBar,
    viewMode,
    activeCategoryIndex,
    activeCategory,
    activeCategoryQuestions,
    categoryProgressMap,
    categoryProgressList,
    currentCategoryProgress,
    isCurrentCategoryComplete,
    isFirstCategory,
    isLastCategory,
    canGoPrev,
    canGoNext,
    goToCategory,
    nextCategory,
    prevCategory,
    totalAnswered,
    progressPercent,
    scores,
    grandTotal,
    minCat,
    recommendation: RECOMMENDATIONS[minCat],
    readinessBadge,
    setViewMode,
    setActiveCategoryIndex,
    handleSelectScore,
    handleNotesChange,
    handleReset,
    scrollToResults,
    triggerCelebrationConfetti,
  };
}
