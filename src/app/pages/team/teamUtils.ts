import { BERRY, BLUE, GREEN, ORANGE, PINK, teamMembers } from "../../data";

export const PALETTE = [BERRY, BLUE, GREEN, ORANGE, PINK];

export const cycleColor = (i: number) => PALETTE[Math.abs(i) % PALETTE.length] ?? PALETTE[0];

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
