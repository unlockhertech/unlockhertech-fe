import { BERRY, ORANGE, PINK, GREEN, BLUE } from "../../data";
import type { Resource } from "../../types";

export interface ExtendedResource extends Resource {
  releaseDate?: string;
  releaseTimestamp?: number;
  stage?: string;
  isComingSoon?: boolean;
}

export interface TransitionStage {
  id: string;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  accentColor: string;
}

export interface ResourceCollection {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  badge?: string;
  iconName?: string;
}

export const RESOURCE_COLLECTIONS: ResourceCollection[] = [
  {
    id: "all",
    label: "All Resources",
    shortLabel: "All Resources",
    description: "Browse our entire library of career guides, technical cheat sheets, and downloadable workbooks.",
  },
  {
    id: "career-toolkit",
    label: "Career Transition Toolkit",
    shortLabel: "Career Toolkit",
    description: "The complete 10-part roadmap taking you from non-tech background to hired engineer or tech professional.",
    badge: "10-Guide Series",
  },
  {
    id: "tech-guides",
    label: "Technical & Engineering",
    shortLabel: "Tech Guides",
    description: "Deep dives into system design, frontend architectures, Git workflows, and engineering fundamentals.",
    badge: "New Drops",
  },
  {
    id: "job-search",
    label: "Job Search & Negotiation",
    shortLabel: "Job Search",
    description: "Practical workbooks for salary negotiation, portfolio building, and behavioral interview dominance.",
  },
  {
    id: "leadership",
    label: "Leadership & Workplace",
    shortLabel: "Leadership",
    description: "Frameworks for mentorship, managing tech debt discussions, and leading cross-functional tech teams.",
  },
  {
    id: "templates",
    label: "Templates & Cheatsheets",
    shortLabel: "Templates",
    description: "Quick-reference syntax cheat sheets, ATS-optimized resume templates, and project planners.",
  },
];

export const TRANSITION_STAGES: TransitionStage[] = [
  {
    id: "stage1",
    number: 1,
    label: "Exploration & Orientation",
    shortLabel: "Exploration",
    description: "Is tech right for me? Get grounded in realistic expectations, myth-busting, and the roles available to you.",
    accentColor: PINK,
  },
  {
    id: "stage2",
    number: 2,
    label: "Asset Building & Language",
    shortLabel: "Asset Building",
    description: "Translate your background into tech-ready language, jargon, and a compelling personal story.",
    accentColor: BERRY,
  },
  {
    id: "stage3",
    number: 3,
    label: "Job Hunting & Outreach",
    shortLabel: "Job Hunting",
    description: "Get visible, network with intention, and land (and win) interviews.",
    accentColor: BLUE,
  },
  {
    id: "stage4",
    number: 4,
    label: "Resilience & Reality",
    shortLabel: "Resilience",
    description: "Stay mentally strong on the job and navigate the unspoken realities of tech culture.",
    accentColor: GREEN,
  },
];

export const RESOURCE_CATEGORIES = [
  "All",
  "Mindset & Fundamentals",
  "Myth Busting",
  "Career Paths",
  "Action Plan",
  "Terminology",
  "Resume & Strategy",
  "Networking",
  "Interviewing",
  "Insider Realities",
];

export const LAUNCH_DATE = "2026-09-14";
const LAUNCH_TIMESTAMP = new Date(`${LAUNCH_DATE}T00:00:00Z`).getTime();
const LAUNCH_DATE_LABEL = "Sep 14, 2026";

export const DEFAULT_RESOURCES: ExtendedResource[] = [
  {
    id: "guide-1",
    title: "10 Things to Know When Transitioning into Tech",
    slug: "10-things-to-know-transitioning-into-tech",
    description: "Essential foundational advice for absolute beginners. Learn why problem-solving beats memorizing code, how to leverage non-tech skills, and how to stay consistent.",
    category: "Mindset & Fundamentals",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage1",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: PINK,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 1,
    requiresLogin: false,
  },
  {
    id: "guide-2",
    title: "10 Myths About the Tech Industry (Debunked)",
    slug: "10-myths-about-tech-industry-debunked",
    description: "Separating fact from fiction for career changers. Bust common rumors regarding CS degrees, math requirements, age limits, and bootcamp promises.",
    category: "Myth Busting",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage1",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: BLUE,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 2,
    requiresLogin: false,
  },
  {
    id: "guide-3",
    title: "10 Non-Coding Roles in Tech to Explore",
    slug: "10-non-coding-roles-in-tech",
    description: "Discover high-impact software careers that don't require writing code. Breakdown of PM, UX/UI Design, Technical Writing, DevRel, Data, and Scrum.",
    category: "Career Paths",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage1",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: GREEN,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 3,
    requiresLogin: false,
  },
  {
    id: "guide-4",
    title: "10-Step Action Roadmap: From Beginner to Hired",
    slug: "10-step-action-roadmap-beginner-to-hired",
    description: "A step-by-step master sequence covering learning, projects, networking, applications, and offers, mapped across the full transition journey.",
    category: "Action Plan",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage1",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: ORANGE,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 4,
    requiresLogin: true,
  },
  {
    id: "guide-5",
    title: "10 Essential Tech Jargon Terms Decoded",
    slug: "10-essential-tech-jargon-terms-decoded",
    description: "Demystify APIs, Tech Debt, Agile, CI/CD, Standups, MVP, and Refactoring in plain English so you can speak the language on day one.",
    category: "Terminology",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage2",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: BERRY,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 5,
    requiresLogin: true,
  },
  {
    id: "guide-6",
    title: "10 Ways to Translate Your Transferable Skills",
    slug: "10-ways-to-translate-transferable-skills",
    description: "Reframe non-tech experience from teaching, sales, retail, or healthcare into tech accomplishments that hiring managers love.",
    category: "Resume & Strategy",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage2",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: ORANGE,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 6,
    requiresLogin: true,
  },
  {
    id: "guide-7",
    title: "10 Networking & LinkedIn Strategies for Tech Job Seekers",
    slug: "10-networking-linkedin-strategies-tech-job-seekers",
    description: "Optimize your headline, pin a Loom video walkthrough, request informational chats, and land referrals from real tech professionals.",
    category: "Networking",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage3",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: PINK,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 7,
    requiresLogin: true,
  },
  {
    id: "guide-8",
    title: "10 Technical & Behavioral Interview Hacks for Beginners",
    slug: "10-technical-behavioral-interview-hacks-beginners",
    description: "Master the STAR method, think out loud during live coding, and ask high-leverage questions that make you memorable.",
    category: "Interviewing",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage3",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: BLUE,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 8,
    requiresLogin: true,
  },
  {
    id: "guide-9",
    title: "10 Mental Health & Mindset Strategies for Tech",
    slug: "10-mental-health-mindset-strategies-tech",
    description: "Beat imposter syndrome, avoid comparison traps, build a 'wins' document, and protect your boundaries against burnout.",
    category: "Mindset & Fundamentals",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage4",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: GREEN,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 9,
    requiresLogin: true,
  },
  {
    id: "guide-10",
    title: "10 Pet Peeves & Unspoken Realities of Tech",
    slug: "10-pet-peeves-unspoken-realities-tech",
    description: "Unfiltered, honest insights into everyday workplace culture. Navigate legacy code, meeting fatigue, shifting product scopes, and time estimation.",
    category: "Insider Realities",
    collection: "career-toolkit",
    format: "guide",
    stage: "stage4",
    pdfUrl: "/unlock-her-tech-career-plan-september-19-2026.pdf",
    fileSize: "3 Pages • Printable PDF",
    pageCount: "3 Pages",
    accentColor: ORANGE,
    isPublished: true,
    publishedAt: LAUNCH_DATE,
    releaseDate: LAUNCH_DATE_LABEL,
    releaseTimestamp: LAUNCH_TIMESTAMP,
    weekNumber: 10,
    requiresLogin: true,
  },
];

export const UPCOMING_COLLECTION_PREVIEWS: ExtendedResource[] = [
  {
    id: "upcoming-tech-1",
    title: "Modern Frontend Architecture & System Design Primer",
    slug: "frontend-architecture-system-design-primer",
    description: "Deep dive into component hierarchy, state machines, micro-frontends, and performance optimization for React applications.",
    category: "Engineering & Architecture",
    collection: "tech-guides",
    format: "guide",
    accentColor: BLUE,
    isPublished: false,
    isComingSoon: true,
    releaseDate: "Q4 2026",
    pageCount: "6-Page Playbook",
    fileSize: "Coming Soon",
  },
  {
    id: "upcoming-job-1",
    title: "Tech Salary & Total Comp Negotiation Scriptbook",
    slug: "tech-salary-negotiation-scriptbook",
    description: "Exact word-for-word email and phone scripts to counter lowball offers, negotiate equity grants, and secure signing bonuses.",
    category: "Job Search & Negotiation",
    collection: "job-search",
    format: "worksheet",
    accentColor: GREEN,
    isPublished: false,
    isComingSoon: true,
    releaseDate: "Q4 2026",
    pageCount: "Interactive Workbook",
    fileSize: "Coming Soon",
  },
  {
    id: "upcoming-lead-1",
    title: "First 90 Days: Engineering Leadership & Mentorship Playbook",
    slug: "first-90-days-engineering-leadership",
    description: "A pragmatic framework for new tech leads, senior engineers, and mentors to build team trust, manage 1:1s, and deliver roadmap impact.",
    category: "Leadership & Mentorship",
    collection: "leadership",
    format: "guide",
    accentColor: BERRY,
    isPublished: false,
    isComingSoon: true,
    releaseDate: "Q4 2026",
    pageCount: "5-Page Playbook",
    fileSize: "Coming Soon",
  },
  {
    id: "upcoming-temp-1",
    title: "ATS-Optimized Tech Resume & Portfolio Checklist",
    slug: "ats-optimized-resume-portfolio-checklist",
    description: "Tested typography, Markdown structure, and ATS keyword matrix to get past automated screeners and land recruiter callbacks.",
    category: "Templates & Worksheets",
    collection: "templates",
    format: "cheatsheet",
    accentColor: ORANGE,
    isPublished: false,
    isComingSoon: true,
    releaseDate: "Q4 2026",
    pageCount: "2-Page Cheatsheet",
    fileSize: "Coming Soon",
  },
];

export interface ResourceFormatOption {
  id: string;
  label: string;
  shortLabel: string;
}

export const RESOURCE_FORMATS: ResourceFormatOption[] = [
  { id: "all", label: "All Formats", shortLabel: "All Formats" },
  { id: "guide", label: "Guides & Playbooks", shortLabel: "Playbooks" },
  { id: "worksheet", label: "Worksheets & Workbooks", shortLabel: "Workbooks" },
  { id: "cheatsheet", label: "Cheatsheets & Checklists", shortLabel: "Cheatsheets" },
  { id: "template", label: "Templates", shortLabel: "Templates" },
];

export function getFormatBadgeLabel(format?: string): string {
  switch (format) {
    case "worksheet":
      return "Workbook";
    case "cheatsheet":
      return "Cheatsheet";
    case "template":
      return "Template";
    case "guide":
    default:
      return "Playbook";
  }
}
