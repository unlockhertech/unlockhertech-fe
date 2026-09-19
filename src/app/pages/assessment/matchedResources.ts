import {
  type CategoryKey,
  type AssessmentScores,
  CATEGORIES,
} from "./assessmentData";

export interface MatchedResourceItem {
  id: string;
  type: "guide" | "podcast" | "practice";
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  url: string;
  isExternal: boolean;
  ctaText: string;
}

export interface CategoryResourceMatch {
  categoryKey: CategoryKey;
  categoryTitle: string;
  categoryNumber: string;
  currentScore: number;
  maxScore: number;
  percentage: number;
  isUnderThreshold: boolean;
  growthFocusReason: string;
  resources: MatchedResourceItem[];
}

export const CATEGORY_RESOURCE_MAP: Record<
  CategoryKey,
  {
    growthFocusReason: string;
    resources: MatchedResourceItem[];
  }
> = {
  m1: {
    growthFocusReason:
      "Score < 60% indicates self-doubt or routine inconsistency. These mindset playbooks and founder episodes will build your psychological safety and steady habit loop.",
    resources: [
      {
        id: "m1-guide-1",
        type: "guide",
        title: "Guide 1: 10 Things to Know When Transitioning into Tech",
        badge: "PDF Guide 1",
        badgeColor: "bg-pink-100 text-brand-coral border-pink-200",
        description:
          "Essential foundational advice on reframing imposter syndrome, problem-solving, and establishing a daily 45-minute study habit.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
      {
        id: "m1-podcast-12",
        type: "podcast",
        title: "Podcast Ep 1: Why She Started",
        badge: "Podcast Episode",
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        description:
          "The origin story of Unlock Her Tech and the mindset shifts required to navigate early career transition fears.",
        url: "https://pod.link/1800087284",
        isExternal: true,
        ctaText: "Listen to Episode",
      },
      {
        id: "m1-practice",
        type: "practice",
        title: "She Leads Tech Engineering Workshops",
        badge: "Live Workshops",
        badgeColor: "bg-emerald-100 text-brand-green border-emerald-200",
        description:
          "Technical sessions (Theory, Practice, Review) in a psychologically safe environment where no question is too basic.",
        url: "/practices",
        isExternal: false,
        ctaText: "Join She Leads Tech",
      },
    ],
  },
  m2: {
    growthFocusReason:
      "Score < 60% indicates difficulty translating non-tech experience. These guides demonstrate how to reframe past professional achievements into tech vocabulary.",
    resources: [
      {
        id: "m2-guide-5",
        type: "guide",
        title: "Guide 5: 10 Ways to Translate Your Transferable Skills",
        badge: "PDF Guide 5",
        badgeColor: "bg-amber-100 text-brand-coral border-amber-200",
        description:
          "Turn teaching, healthcare, sales, or operations experience into quantified tech impact metrics hiring managers value.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
      {
        id: "m2-guide-4",
        type: "guide",
        title: "Guide 4: 10 Non-Coding Roles in Tech to Explore",
        badge: "PDF Guide 4",
        badgeColor: "bg-blue-100 text-brand-blue border-blue-200",
        description:
          "Explore high-impact careers in Product Management, UX Design, DevRel, and Data where communication skills shine.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
      {
        id: "m2-podcast-4",
        type: "podcast",
        title: "Podcast Ep 9: Creative Collaboration",
        badge: "Podcast Episode",
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        description:
          "Stories of non-traditional pivoters using unique domain backgrounds to solve critical software challenges.",
        url: "https://pod.link/1800087284",
        isExternal: true,
        ctaText: "Listen to Episode",
      },
    ],
  },
  m3: {
    growthFocusReason:
      "Score < 60% suggests a gap between tutorial consumption and hands-on coding fluency. These resources provide structured algorithmic practice and system mental models.",
    resources: [
      {
        id: "m3-practice",
        type: "practice",
        title: "She Leads Tech Workshops",
        badge: "Theory, Practice & Review",
        badgeColor: "bg-blue-100 text-brand-blue border-blue-200",
        description:
          "Live interactive workshops covering Theory, Practice, and Review across DSA, system design, and software engineering.",
        url: "/practices",
        isExternal: false,
        ctaText: "Explore She Leads Tech",
      },
      {
        id: "m3-guide-2",
        type: "guide",
        title: "Guide 2: 10 Myths About the Tech Industry (Debunked)",
        badge: "PDF Guide 2",
        badgeColor: "bg-pink-100 text-brand-coral border-pink-200",
        description:
          "Demystify technical gatekeeping, CS degree requirements, and learn how to build verifiable proof of work.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
      {
        id: "m3-podcast-7",
        type: "podcast",
        title: "Podcast Ep 6: Women Who Code the World",
        badge: "Podcast Episode",
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        description:
          "Real-world architecture walkthroughs, debugging mindsets, and advice from senior female software engineers.",
        url: "https://pod.link/1800087284",
        isExternal: true,
        ctaText: "Listen to Episode",
      },
    ],
  },
  m4: {
    growthFocusReason:
      "Score < 60% on Networking Strategy. Avoid the black hole of cold job boards by using these networking frameworks and community tactics.",
    resources: [
      {
        id: "m4-guide-5",
        type: "guide",
        title: "Guide 5: Transferable Skills & Networking Strategy",
        badge: "PDF Guide 5",
        badgeColor: "bg-emerald-100 text-brand-green border-emerald-200",
        description:
          "Step-by-step blueprints for 15-minute informational chats, LinkedIn headline optimization, and finding champions.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
      {
        id: "m4-podcast-2",
        type: "podcast",
        title: "Podcast Ep 11: Building Sustainable Communities",
        badge: "Podcast Episode",
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        description:
          "How collective action, networking, and mutual support open closed doors across the technology ecosystem.",
        url: "https://pod.link/1800087284",
        isExternal: true,
        ctaText: "Listen to Episode",
      },
      {
        id: "m4-guide-3",
        type: "guide",
        title: "Guide 3: 10 Pet Peeves & Unspoken Realities of Tech",
        badge: "PDF Guide 3",
        badgeColor: "bg-amber-100 text-brand-coral border-amber-200",
        description:
          "Navigate company culture, stakeholder management, and cross-functional team dynamics like an industry insider.",
        url: "/resources",
        isExternal: false,
        ctaText: "Download PDF Guide",
      },
    ],
  },
};

export const LOW_SCORE_THRESHOLD_PERCENT = 60; // 60% (12/20)
export const LOW_SCORE_THRESHOLD_POINTS = 12;

/**
 * Returns auto-matched resources for categories where the score is under 60% (< 12/20).
 * If no category is under 60%, returns the lowest-scoring category to ensure the user always has tailored next steps.
 */
export function getAutoMatchedResources(
  scores: AssessmentScores,
  totalAnswered: number
): CategoryResourceMatch[] {
  const matches: CategoryResourceMatch[] = [];

  CATEGORIES.forEach((cat) => {
    const currentScore = scores[cat.key];
    const percentage = Math.round((currentScore / 20) * 100);
    const isUnderThreshold = currentScore < LOW_SCORE_THRESHOLD_POINTS;

    const data = CATEGORY_RESOURCE_MAP[cat.key];
    if (isUnderThreshold && totalAnswered > 0) {
      matches.push({
        categoryKey: cat.key,
        categoryTitle: cat.title,
        categoryNumber: cat.number,
        currentScore,
        maxScore: 20,
        percentage,
        isUnderThreshold: true,
        growthFocusReason: data.growthFocusReason,
        resources: data.resources,
      });
    }
  });

  // Fallback: If candidate answered questions and scored >= 60% on all, recommend for their lowest dimension
  if (matches.length === 0 && totalAnswered > 0) {
    let minCat: CategoryKey = "m1";
    let minVal = scores.m1;
    (Object.keys(scores) as CategoryKey[]).forEach((k) => {
      if (scores[k] < minVal) {
        minVal = scores[k];
        minCat = k;
      }
    });

    const catObj = CATEGORIES.find((c) => c.key === minCat) || CATEGORIES[0];
    const currentScore = scores[minCat];
    const percentage = Math.round((currentScore / 20) * 100);
    const data = CATEGORY_RESOURCE_MAP[minCat];

    matches.push({
      categoryKey: minCat,
      categoryTitle: catObj.title,
      categoryNumber: catObj.number,
      currentScore,
      maxScore: 20,
      percentage,
      isUnderThreshold: false,
      growthFocusReason: `Your highest priority refinement area based on your relative scores (${percentage}%). These tailored resources will help take this area from good to exceptional.`,
      resources: data.resources,
    });
  }

  return matches;
}
