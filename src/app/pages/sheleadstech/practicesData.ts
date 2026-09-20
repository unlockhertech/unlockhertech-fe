import type { ComponentType } from "react";
import {
  HiCodeBracket,
  HiUsers,
  HiAcademicCap,
  HiChatBubbleLeftRight,
  HiRocketLaunch,
  HiBookOpen,
  HiWrenchScrewdriver,
  HiArrowPath,
} from "react-icons/hi2";

export interface LearningFormat {
  id: "theory" | "practice" | "review";
  title: string;
  shortName: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  mantra: string;
  purpose: string;
  keyDifference: string;
  icon: ComponentType<{ className?: string }>;
  instructorRole: string[];
  topicsOrActivities: string[];
  currentLive?: boolean;
}

export interface KeyDifferenceItem {
  format: string;
  whoLeads: string;
  participantsRole: string;
  coreFocus: string;
  mantra: string;
  color: string;
  badgeColor: string;
}

export interface EngineeringTopic {
  name: string;
  badge: string;
  desc: string;
  color: string;
  dotColor: string;
  status: "active" | "pipeline";
  pipelineYear?: string;
  focusHighlights?: string[];
}

export interface AlgorithmicPattern {
  name: string;
  badge: string;
  desc: string;
  color: string;
  dotColor: string;
}

export interface SessionPillar {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export interface Requirement {
  text: string;
  detail: string;
}

export const STAGE_THEORY_HEX = "#ff6051";
export const STAGE_PRACTICE_HEX = "#b52970";
export const STAGE_REVIEW_HEX = "#72c472";

export const LEARNING_FORMATS: LearningFormat[] = [
  {
    id: "theory",
    title: "She Leads Tech Theory",
    shortName: "Theory",
    subtitle: "Instructor-Led Teaching & Practical Examples",
    badge: "Live on Luma",
    badgeColor: "bg-[#ff6051] text-white",
    mantra: "Learn it → Understand it → See it applied.",
    purpose:
      "Designed to help participants learn and understand a technical concept through instructor-led teaching and practical examples. The aim is not just to explain what something is, but to help participants understand why it is used, when to use it, how it works, and how it appears in real engineering problems.",
    keyDifference: "The instructor leads — participants are primarily learning.",
    icon: HiBookOpen,
    currentLive: true,
    instructorRole: [
      "Introduce and explain the concept clearly.",
      "Explain when and why engineers would use it.",
      "Break the topic down into understandable steps.",
      "Use diagrams, code, architecture examples, or visuals where helpful.",
      "Walk participants through at least one practical example.",
      "Demonstrate how they would think about and approach the problem.",
      "Solve or build the example together with the audience.",
      "Encourage questions and discussion throughout the session.",
      "Share useful resources participants can use afterwards.",
    ],
    topicsOrActivities: [
      "Data Structures & Algorithms (e.g. Sliding Window pattern deconstruction)",
      "System Design & Scalable Cloud Architectures",
      "Frontend & Backend Engineering Foundations",
      "APIs, Microservices, Databases & DevOps",
    ],
  },
  {
    id: "practice",
    title: "She Leads Tech Practice",
    shortName: "Practice",
    subtitle: "Hands-On Experience & Problem Solving",
    badge: "Interactive Doing",
    badgeColor: "bg-[#b52970] text-white",
    mantra: "Try it → Solve it → Discuss it → Improve it.",
    purpose:
      "Designed to give participants hands-on experience applying what they know. The focus is less on teaching a concept from the beginning and more on giving participants space to think, code, discuss, make mistakes, test ideas, and solve problems together.",
    keyDifference: "Participants lead the problem solving — they are primarily doing.",
    icon: HiWrenchScrewdriver,
    instructorRole: [
      "Act more as a facilitator and guide rather than a lecturer.",
      "Introduce the problem or challenge and give participants time to think before presenting solutions.",
      "Encourage people to explain their approaches.",
      "Use breakout rooms or group discussions where appropriate.",
      "Allow participants to write and share code.",
      "Ask questions that guide participants towards a solution rather than immediately giving the answer.",
      "Discuss different possible approaches and analyze trade-offs.",
      "Review solutions together at the end and explain improvements or alternative approaches.",
      "Create an environment where people feel comfortable trying, failing, and asking questions.",
    ],
    topicsOrActivities: [
      "Targeted coding challenges & LeetCode problems",
      "Real-world debugging exercises",
      "Architecture scenarios & system design exercises",
      "Frontend / backend engineering challenges",
    ],
  },
  {
    id: "review",
    title: "She Leads Tech Review",
    shortName: "Review",
    subtitle: "Repetition & Long-Term Mastery",
    badge: "Reinforce & Solidify",
    badgeColor: "bg-[#72c472] text-white",
    mantra: "Remember it → Practise it again → Understand it better → Make it stick.",
    purpose:
      "Designed to return to something that has already been covered and strengthen participants' understanding through repetition and further practice. Review sessions give the community another opportunity to revisit the subject, ask questions, practise again, and build confidence.",
    keyDifference: "Instructor and participants revisit previous learning together — they are primarily reinforcing and strengthening.",
    icon: HiArrowPath,
    instructorRole: [
      "Give a short recap of the original concept.",
      "Highlight the most important ideas participants should remember.",
      "Address common misunderstandings or questions.",
      "Avoid repeating the entire original Theory session unless necessary.",
      "Use a new example or problem to reinforce the concept.",
      "Give participants more opportunity to contribute and solve.",
      "Ask participants to explain what they remember.",
      "Compare different solutions or approaches.",
      "Clarify anything that remained confusing from the previous session.",
      "Help participants identify what they should practise next.",
    ],
    topicsOrActivities: [
      "Revisiting previous DSA patterns with fresh challenge variations",
      "System design and architecture reinforcement",
      "Frontend and backend concept check-ins",
      "Collaborative Q&A and trade-off comparisons",
    ],
  },
];

export const KEY_DIFFERENCES: KeyDifferenceItem[] = [
  {
    format: "Theory",
    whoLeads: "The instructor leads",
    participantsRole: "Participants are primarily learning",
    coreFocus: "Learn it → Understand it → See it applied",
    mantra: "Learn it → Understand it → See it applied.",
    color: "border-[#ff6051]/40 bg-[#ff6051]/10 text-stone-900",
    badgeColor: "bg-[#ff6051] text-white",
  },
  {
    format: "Practice",
    whoLeads: "Participants lead problem solving",
    participantsRole: "Participants are primarily doing",
    coreFocus: "Try it → Solve it → Discuss it → Improve it",
    mantra: "Try it → Solve it → Discuss it → Improve it.",
    color: "border-[#b52970]/40 bg-[#b52970]/10 text-stone-900",
    badgeColor: "bg-[#b52970] text-white",
  },
  {
    format: "Review",
    whoLeads: "Instructor & participants revisit together",
    participantsRole: "Participants are primarily reinforcing and strengthening",
    coreFocus: "Remember it → Practise it again → Make it stick",
    mantra: "Remember it → Practise it again → Understand it better → Make it stick.",
    color: "border-[#72c472]/40 bg-[#72c472]/15 text-stone-900",
    badgeColor: "bg-[#72c472] text-white",
  },
];

export const ENGINEERING_TOPICS: EngineeringTopic[] = [
  {
    name: "Data Structures & Algorithms",
    badge: "Active Track",
    desc: "Sliding window, two pointers, trees, graphs, recursion, and dynamic programming broken down step-by-step for technical mastery.",
    color: "bg-pink-50 border-brand-pink/60 text-brand-coral",
    dotColor: "bg-brand-coral",
    status: "active",
    focusHighlights: [
      "Two Pointers & Sliding Window",
      "Trees, DFS & BFS Traversals",
      "Hash Maps & Frequency Tables",
      "Dynamic Programming & Graphs",
    ],
  },
  {
    name: "System Design",
    badge: "Active Track",
    desc: "Scalable architectures, distributed caching, load balancers, rate limiting, and microservices for real-world engineering and senior loops.",
    color: "bg-blue-50 border-brand-blue/40 text-brand-blue",
    dotColor: "bg-brand-blue",
    status: "active",
    focusHighlights: [
      "High-Availability & Load Balancing",
      "Distributed Caching & CDN Strategies",
      "Microservices & Async Event Queues",
      "Database Sharding & Data Consistency",
    ],
  },
  {
    name: "Frontend Engineering",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "React paradigms, state management, web performance, accessibility (a11y), and resilient UX design.",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    dotColor: "bg-purple-600",
    status: "pipeline",
  },
  {
    name: "Backend Engineering",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "High-throughput APIs, asynchronous event processing, concurrency, data validation, and auth flows.",
    color: "bg-emerald-50 border-emerald-200 text-brand-green",
    dotColor: "bg-brand-green",
    status: "pipeline",
  },
  {
    name: "Cloud & AWS",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Serverless lambda functions, cloud storage, IAM policies, containerized services, and reliability.",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    dotColor: "bg-amber-500",
    status: "pipeline",
  },
  {
    name: "APIs & Microservices",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "RESTful contracts, GraphQL federation, gRPC streaming, message queues, and API gateways.",
    color: "bg-sky-50 border-sky-200 text-sky-800",
    dotColor: "bg-sky-600",
    status: "pipeline",
  },
  {
    name: "Databases",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "SQL vs NoSQL schema modeling, database indexing, query optimization, ACID transactions, and sharding.",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    dotColor: "bg-indigo-600",
    status: "pipeline",
  },
  {
    name: "Testing",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Unit testing, integration testing, end-to-end automation, and test-driven development (TDD).",
    color: "bg-teal-50 border-teal-200 text-teal-800",
    dotColor: "bg-teal-600",
    status: "pipeline",
  },
  {
    name: "DevOps & CI/CD",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Docker containerization, GitHub Actions pipelines, cloud deployments, logging, and observability.",
    color: "bg-rose-50 border-rose-200 text-rose-800",
    dotColor: "bg-rose-600",
    status: "pipeline",
  },
  {
    name: "Architecture",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Clean architecture, domain-driven design, design patterns, modular codebases, and managing technical debt.",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    dotColor: "bg-orange-600",
    status: "pipeline",
  },
  {
    name: "Mobile Development",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Cross-platform mobile frameworks, native performance, offline persistence, and mobile UX design.",
    color: "bg-cyan-50 border-cyan-200 text-cyan-800",
    dotColor: "bg-cyan-600",
    status: "pipeline",
  },
  {
    name: "Software Engineering Concepts",
    badge: "In Pipeline",
    pipelineYear: "Next Year",
    desc: "Git workflows, technical communication, code reviews, debugging techniques, and trade-off analysis.",
    color: "bg-stone-50 border-stone-200 text-stone-800",
    dotColor: "bg-stone-600",
    status: "pipeline",
  },
];

// Backwards compatibility alias for PATTERNS
export const PATTERNS: AlgorithmicPattern[] = [
  {
    name: "Two Pointers & Sliding Window",
    badge: "Frequent in Interviews",
    desc: "Optimising subarray lookups and in-place array transformations from O(n²) to O(n).",
    color: "bg-blue-50 border-blue-200 text-brand-blue",
    dotColor: "bg-brand-blue",
  },
  {
    name: "Trees & Binary Search Trees",
    badge: "Core Data Structures",
    desc: "Mastering recursion, DFS, BFS level-order traversal, and tree validations.",
    color: "bg-emerald-50 border-emerald-200 text-brand-green",
    dotColor: "bg-brand-green",
  },
  {
    name: "Hash Maps & Frequency Tables",
    badge: "Foundational Pattern",
    desc: "Instant O(1) lookups, anagram detection, prefix sums, and two-sum patterns.",
    color: "bg-pink-50 border-pink-200 text-brand-coral",
    dotColor: "bg-brand-coral",
  },
  {
    name: "Graphs & Matrix Traversal",
    badge: "Intermediate",
    desc: "Island counts, flood fill, shortest path algorithms, and topological sorting.",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    dotColor: "bg-amber-500",
  },
  {
    name: "Dynamic Programming & Memoization",
    badge: "Advanced Problem-Solving",
    desc: "Breaking complex optimization challenges down into reusable subproblems.",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    dotColor: "bg-purple-600",
  },
];

export const SAMPLE_CODE = `// She Leads Tech: Theory & Practical Walkthrough
// Topic: Sliding Window Pattern
// Problem: Longest Substring Without Repeating Characters
// Time Complexity: O(n) | Space Complexity: O(min(m, n))

function lengthOfLongestSubstring(s: string): number {
  const charMap = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    // If character was seen inside current window, shrink from left
    if (charMap.has(currentChar) && charMap.get(currentChar)! >= left) {
      left = charMap.get(currentChar)! + 1;
    }

    charMap.set(currentChar, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`;

export const SESSION_PILLARS: SessionPillar[] = [
  {
    icon: HiAcademicCap,
    title: "Instructor-Led Theory & Architecture",
    description: "Learn the why, when, and how behind complex engineering topics and see patterns applied in real problems.",
    color: "bg-pink-50 text-brand-coral border-pink-100",
  },
  {
    icon: HiCodeBracket,
    title: "Hands-On Practice & Live Problem Solving",
    description: "Get hands-on experience solving challenges, debugging code, and testing ideas together in a supportive space.",
    color: "bg-blue-50 text-brand-blue border-blue-100",
  },
  {
    icon: HiUsers,
    title: "Review & Reinforce Long-Term Mastery",
    description: "Revisit past concepts, clarify misunderstandings, and solidify your understanding through repetition.",
    color: "bg-emerald-50 text-brand-green border-emerald-100",
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "Ask Questions Freely",
    description: "A safe, supportive space where no question is too basic and curious problem-solving is celebrated.",
    color: "bg-amber-50 text-brand-coral border-amber-100",
  },
  {
    icon: HiRocketLaunch,
    title: "Build Interview & Engineering Confidence",
    description: "Overcome technical anxiety with structured sessions and supportive mentors alongside curious peers.",
    color: "bg-pink-50 text-[#b42970] border-pink-100",
  },
];

export const REQUIREMENTS: Requirement[] = [
  {
    text: "Curiosity & Openness to Learn",
    detail: "Willingness to ask questions, learn in public, and engage with mentors and peers.",
  },
  {
    text: "Working Programming Fundamentals",
    detail: "Familiarity with basic syntax, loops, and functions in any modern language (JavaScript, TypeScript, Python, etc.).",
  },
  {
    text: "Free Community Accounts",
    detail: "Access to free tools (such as LeetCode, GitHub, or online code sandboxes) used during interactive sessions.",
  },
];
