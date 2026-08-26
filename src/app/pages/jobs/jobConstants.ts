export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export const CATEGORIES: FilterOption[] = [
  { label: "All Roles", value: "all" },
  { label: "Engineering & Dev", value: "Engineering & Dev" },
  { label: "Product & Design", value: "Product & Design" },
  { label: "Data & Research", value: "Data & Research" },
  { label: "Non-Technical Tech", value: "Non-Technical Tech" },
  { label: "Freelance & Contract", value: "Freelance & Contract" },
];

export const WORKPLACE_OPTIONS: FilterOption[] = [
  { label: "All Workplaces", value: "all" },
  { label: "Remote (Global)", value: "Remote (Global)" },
  { label: "Remote (US/Americas)", value: "Remote (US/Americas)" },
  { label: "Remote (UK/Europe)", value: "Remote (UK/Europe)" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "On-site", value: "On-site" },
];

export const EXPERIENCE_OPTIONS: FilterOption[] = [
  { label: "All Experience Levels", value: "all" },
  { label: "Junior / Entry-Level", value: "Junior" },
  { label: "Mid-Level", value: "Mid-Level" },
  { label: "Senior", value: "Senior" },
  { label: "Lead / Staff / Principal", value: "Lead / Staff" },
  { label: "Executive / Director", value: "Executive" },
];

export const SALARY_THRESHOLDS: FilterOption<number>[] = [
  { label: "Any Compensation", value: 0 },
  { label: "$80k+ USD (or £65k+)", value: 80000 },
  { label: "$100k+ USD (or £80k+)", value: 100000 },
  { label: "$120k+ USD (or £95k+)", value: 120000 },
  { label: "$140k+ USD (or £110k+)", value: 140000 },
  { label: "$160k+ USD (or £125k+)", value: 160000 },
];

export const INCLUSIVE_HIGHLIGHTS: FilterOption[] = [
  { label: "All Signals", value: "all" },
  { label: "Verified Inclusive", value: "Verified Inclusive" },
  { label: "Flexible / Async Hours", value: "Flexible Hours" },
  { label: "Equal Parental Leave", value: "Parental Leave" },
  { label: "Learning Stipend", value: "Learning Stipend" },
  { label: "Diverse Panel", value: "Diverse Panel" },
  { label: "Neurodiversity Friendly", value: "Neurodiversity Friendly" },
  { label: "LGBTQ+ Safe", value: "LGBTQ+ Safe" },
];

export const DEFAULT_POSTING_DATE = "2026-08-20T00:00:00.000Z";
export const DEFAULT_VALID_THROUGH = "2026-10-31T23:59:59.000Z";
