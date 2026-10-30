export type PathIconType = "academic" | "code" | "server" | "mobile";

export interface LearningPath {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  topics: readonly string[];
  href: string; // internal route
  iconType: PathIconType;
  accentGradient: string;
  badge: string;
  badgeClass: string;
  pillBadgeClass: string;
  isLive: boolean;
}

export const LEARNING_PATHS: readonly LearningPath[] = [
  {
    slug: "interview",
    title: "Interview Preparation Path",
    subtitle: "Algorithms, System Design & Interview Mastery",
    description:
      "Build deep problem-solving intuition and confidence for technical interviews with live coding practice, system design blueprints, and behavioral frameworks.",
    topics: [
      "Data Structures & Algorithms",
      "System Design & Scalability",
      "Live Coding Challenges",
      "Behavioural & Leadership Prep",
      "Mock Technical Interviews",
    ],
    href: "/paths/interview",
    iconType: "academic",
    accentGradient: "from-[#b52970] via-[#ff6051] to-[#f4a0b4]",
    badge: "Live Workshop Track",
    badgeClass: "bg-pink-100 text-[#b52970] border-pink-200",
    pillBadgeClass: "bg-pink-50 text-[#911f59] border-pink-200/80 hover:bg-pink-100 hover:border-pink-300",
    isLive: true,
  },
] as const;
