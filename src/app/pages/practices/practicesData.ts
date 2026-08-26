import type { ComponentType } from "react";
import {
  HiCodeBracket,
  HiUsers,
  HiAcademicCap,
  HiChatBubbleLeftRight,
  HiRocketLaunch,
} from "react-icons/hi2";

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

export const SAMPLE_CODE = `// Problem: Two Sum / Two Pointers Approach
// Time Complexity: O(n) | Space Complexity: O(1)

function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1]; // Found match!
    } else if (sum < target) {
      left++; // Need a larger value
    } else {
      right--; // Need a smaller value
    }
  }

  return [];
}`;

export const SESSION_PILLARS: SessionPillar[] = [
  {
    icon: HiCodeBracket,
    title: "Solve LeetCode-Style Problems",
    description: "Hands-on practice tackling curated algorithmic challenges in real time.",
    color: "bg-pink-50 text-brand-coral border-pink-100",
  },
  {
    icon: HiUsers,
    title: "Collaborate & Discuss Approaches",
    description: "Work together as a whole group to share ideas, clean code, and edge cases in real time.",
    color: "bg-blue-50 text-brand-blue border-blue-100",
  },
  {
    icon: HiAcademicCap,
    title: "Master Interview Patterns",
    description: "Recognize patterns like Two Pointers, Sliding Window, Trees & Graphs quickly.",
    color: "bg-amber-50 text-brand-coral border-amber-100",
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "Ask Questions Freely",
    description: "Safe, supportive space where no question is too basic and curiosity is celebrated.",
    color: "bg-emerald-50 text-brand-green border-emerald-100",
  },
  {
    icon: HiRocketLaunch,
    title: "Build Interview Confidence",
    description: "Overcome interview anxiety with regular, structured practice among peers.",
    color: "bg-pink-50 text-[#b42970] border-pink-100",
  },
];

export const REQUIREMENTS: Requirement[] = [
  { text: "A free LeetCode account", detail: "For attempting problems during live sessions." },
  { text: "Basic JavaScript or TypeScript", detail: "Familiarity with loops, functions, and arrays." },
  { text: "Curiosity & Collaboration", detail: "Willingness to learn together and support peers." },
];
