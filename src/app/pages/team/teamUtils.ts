import type { TeamDepartmentId, TeamMember } from "../../types";
import { BERRY, BLUE, GREEN, ORANGE, PINK, teamMembers } from "../../data";

export const PALETTE = [BERRY, BLUE, GREEN, ORANGE, PINK];

export const cycleColor = (i: number) => PALETTE[Math.abs(i) % PALETTE.length] ?? PALETTE[0];

export interface DepartmentInfo {
  id: TeamDepartmentId;
  title: string;
  shortTitle: string;
  description: string;
  accentColor: string;
  tagline: string;
}

export const TEAM_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "leadership",
    title: "Co-Founders & Leadership",
    shortTitle: "Leadership",
    description: "Setting vision, technical direction, and ecosystem strategy across Unlock Her Tech.",
    accentColor: BERRY,
    tagline: "Vision & Leadership",
  },
  {
    id: "research",
    title: "Research & Editorial",
    shortTitle: "Research",
    description: "Investigating industry developments, tech trends, and guest stories powering our content.",
    accentColor: GREEN,
    tagline: "Insight & Investigation",
  },
  {
    id: "podcast",
    title: "Podcast & Media Production",
    shortTitle: "Production",
    description: "Hosting, coordinating, and editing studio-grade audio and video conversations.",
    accentColor: BLUE,
    tagline: "Storytelling & Audio/Video",
  },
  {
    id: "community",
    title: "Partnerships & Community",
    shortTitle: "Community",
    description: "Building partner collaborations, social reach, and impactful community experiences.",
    accentColor: ORANGE,
    tagline: "Ecosystem & Growth",
  },
  {
    id: "design",
    title: "Product & UX Design",
    shortTitle: "Design",
    description: "Crafting human-centred, accessible, and welcoming digital experiences.",
    accentColor: PINK,
    tagline: "Digital Experience",
  },
];

export function getMembersByDepartment(deptId: TeamDepartmentId): TeamMember[] {
  return teamMembers.filter((m) => m.department === deptId);
}

function resolveMemberPhotoUrl(photoUrl: string): string {
  if (photoUrl.startsWith("http")) return photoUrl;
  const prefix = photoUrl.startsWith("/") ? "" : "/";
  return `https://unlockhertech.com${prefix}${photoUrl}`;
}

export const TEAM_PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": teamMembers.map((m, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": {
      "@type": "Person",
      "name": m.name,
      "jobTitle": m.role,
      "description": m.bio,
      "image": resolveMemberPhotoUrl(m.photoUrl),
      "sameAs": m.linkedinUrl ? [m.linkedinUrl] : [],
      "worksFor": {
        "@type": "Organization",
        "name": "Unlock Her Tech",
        "url": "https://unlockhertech.com",
      },
    },
  })),
};
