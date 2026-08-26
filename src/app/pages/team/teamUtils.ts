import { BERRY, BLUE, GREEN, ORANGE, PINK, teamMembers } from "../../data";

export const PALETTE = [BERRY, BLUE, GREEN, ORANGE, PINK];

export const cycleColor = (i: number) => PALETTE[i % PALETTE.length];

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
      "image": m.photoUrl.startsWith("http")
        ? m.photoUrl
        : `https://unlockhertech.com${m.photoUrl.startsWith("/") ? "" : "/"}${m.photoUrl}`,
      "sameAs": m.linkedinUrl ? [m.linkedinUrl] : [],
      "worksFor": {
        "@type": "Organization",
        "name": "Unlock Her Tech",
        "url": "https://unlockhertech.com",
      },
    },
  })),
};
