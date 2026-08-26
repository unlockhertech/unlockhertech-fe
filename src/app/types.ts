import type { ElementType } from "react";

export interface Episode {
  id: number;
  title: string;
  description: string;
  audioUrl: string; // MP3 / audio file URL
  duration: string; // e.g. "45 min"
  date: string;
  episodeNumber: number;
  coverColor: string;
  imageUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  tagline?: string;
  linkedinUrl?: string;
  avatarColor: string;
  photoUrl: string;
}

export interface Platform {
  name: string;
  icon: ElementType;
  url: string;
}

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  tags: string[];
  canonicalUrl: string;
  slug: string;
  content?: string;
  body?: unknown[];
  readingTime?: string;
  imageUrl?: string;
}

export type EventPlatform = "Luma" | "Eventbrite";

export interface ExternalEvent {
  title: string;
  date: string;
  platform: EventPlatform;
  urlOrId: string;
  slug: string;
  image?: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  pdfUrl?: string;
  fileSize?: string;
  pageCount?: string;
  accentColor?: string;
  isPublished: boolean;
  publishedAt?: string;
  weekNumber?: number;
  requiresLogin?: boolean;
}

export type JobCategory =
  | "Engineering & Dev"
  | "Product & Design"
  | "Data & Research"
  | "Non-Technical Tech"
  | "Freelance & Contract";

export type JobRemoteStatus =
  | "Remote (Global)"
  | "Remote (US/Americas)"
  | "Remote (UK/Europe)"
  | "Hybrid"
  | "On-site";

export type JobExperienceLevel =
  | "Junior"
  | "Mid-Level"
  | "Senior"
  | "Lead / Staff"
  | "Executive";

export type JobEmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  companyLogoUrl?: string;
  category: JobCategory;
  location: string;
  remoteStatus: JobRemoteStatus;
  employmentType: JobEmploymentType;
  experienceLevel: JobExperienceLevel;
  salaryRange: string;
  minSalary?: number;
  currency?: string;
  techStack?: string[];
  whyApply: string;
  description: string;
  inclusiveHighlights?: string[];
  applyUrl: string;
  source?: string;
  status?: "active" | "closed" | "expired";
  isArchived?: boolean;
  featured?: boolean;
  verifiedInclusive?: boolean;
  publishedAt?: string;
  deadline?: string;
}


