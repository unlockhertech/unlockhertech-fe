export type SortOrder = "newest" | "oldest";
export type ViewMode = "grid" | "list";

export const PAGE_SIZE = 6;

export const TAG_FILTERS = [
  { label: "All", value: "" },
  { label: "Engineering & Tech", value: "engineering" },
  { label: "Career & Leadership", value: "leadership" },
  { label: "Startups & Pivots", value: "startups" },
  { label: "Design & Inclusion", value: "inclusion" },
  { label: "AI & Innovation", value: "ai-innovation" },
];

export const EPISODE_TAGS: Record<number, string[]> = {
  1: ["ai-innovation", "engineering"],
  2: ["leadership", "inclusion"],
  3: ["ai-innovation", "inclusion"],
  4: ["leadership", "engineering"],
  5: ["engineering", "leadership"],
  6: ["ai-innovation", "engineering"],
  7: ["engineering", "leadership"],
  8: ["inclusion", "engineering"],
  9: ["startups", "leadership"],
  10: ["ai-innovation", "engineering"],
  11: ["leadership", "startups"],
  12: ["startups", "leadership"],
};
