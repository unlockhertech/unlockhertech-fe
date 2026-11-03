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

export type TeamDepartmentId =
  | "leadership"
  | "research"
  | "podcast"
  | "community"
  | "design";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  tagline?: string;
  linkedinUrl?: string;
  avatarColor: string;
  photoUrl: string;
  department?: TeamDepartmentId;
}

export interface Platform {
  name: string;
  icon: ElementType;
  url: string;
}

export type CalloutVariant = "didYouKnow" | "keyTakeaway" | "tip" | "highlight" | "quote";

export interface BlogPostCallout {
  _type?: "callout";
  variant: CalloutVariant;
  title?: string;
  content?: string;
  points?: string[];
  referenceText?: string;
  referenceUrl?: string;
}

export interface BlogPostPullQuote {
  _type?: "pullQuote";
  quote: string;
  attribution?: string;
  role?: string;
}

export interface BlogPostCaptionedImage {
  _type?: "captionedImage" | "image";
  asset?: { url?: string };
  imageUrl?: string;
  caption?: string;
  alt?: string;
}

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  authorBio?: string;
  authorLinkedin?: string;
  tags: string[];
  canonicalUrl: string;
  slug: string;
  content?: string;
  body?: unknown[];
  readingTime?: string;
  imageUrl?: string;
}

export type EventPlatform = "Luma" | "Eventbrite" | "Conference" | "Website" | "External";

export interface ExternalEvent {
  title: string;
  date: string;
  platform: EventPlatform;
  urlOrId: string;
  slug: string;
  image?: string;
  description?: string;
  discountCode?: string;
  discountPercentage?: string;
  ctaLabel?: string;
  isPartner?: boolean;
}

export type ResourceType = "guide" | "template" | "tool" | "video" | "article";
export type ResourceLevel = "All Levels" | "Beginner" | "Intermediate" | "Advanced";
export type ResourceTopicCluster =
  | "career-change"
  | "engineering"
  | "ai-data"
  | "job-search"
  | "leadership";

export type ResourceFormat = "guide" | "cheatsheet" | "workbook" | "worksheet" | "template";
export type ResourceTargetLevel = "All Levels" | "Beginner" | "Intermediate" | "Advanced";

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  type?: ResourceType;
  category: string;
  topicCluster?: ResourceTopicCluster;
  level?: ResourceLevel;
  durationOrPages?: string;
  actionLabel?: string;
  actionUrl?: string;
  stage?: string;
  collection?: string;
  format?: ResourceFormat | string;
  targetLevel?: ResourceTargetLevel | string;
  tags?: string[];
  isFeatured?: boolean;
  isComingSoon?: boolean;
  pdfUrl?: string;
  fileSize?: string;
  pageCount?: string;
  accentColor?: string;
  isPublished?: boolean;
  publishedAt?: string;
  releaseDate?: string;
  releaseTimestamp?: number;
  weekNumber?: number;
  requiresLogin?: boolean;
  downloadCount?: number;
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


