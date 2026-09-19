export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  topics: readonly string[];
  href: string; // internal route
  icon?: string; // reserved for future use
}

export const LEARNING_PATHS: readonly LearningPath[] = [
  {
    slug: "frontend",
    title: "Front-End Path",
    description:
      "Build beautiful, accessible and high-performance web experiences.",
    topics: [
      "JavaScript & TypeScript",
      "React",
      "Accessibility",
      "Testing",
      "Performance",
    ],
    href: "/paths/frontend",
  },
  {
    slug: "backend",
    title: "Backend Path",
    description: "Learn to build scalable, secure and reliable systems.",
    topics: [
      "APIs & Microservices",
      "Databases",
      "DevOps",
      "AWS & Cloud",
      "Architecture",
    ],
    href: "/paths/backend",
  },
  {
    slug: "mobile",
    title: "Mobile Path",
    description: "Create impactful mobile applications for iOS and Android.",
    topics: [
      "iOS / Swift",
      "Android / Kotlin",
      "Mobile Architecture",
      "APIs",
      "Testing",
    ],
    href: "/paths/mobile",
  },
  {
    slug: "interview",
    title: "Interview Preparation Path",
    description:
      "Build confidence and get ready for your next opportunity.",
    topics: [
      "Data Structures & Algorithms",
      "System Design",
      "Coding Interviews",
      "Behavioural Interviews",
    ],
    href: "/paths/interview",
  },
] as const;
