import { useMetaData } from "../hooks/useMetaData";
import { GuidelinesHeroHeader } from "./guidelines/GuidelinesHeroHeader";
import { GuidelinesPillarsGrid } from "./guidelines/GuidelinesPillarsGrid";
import { GuidelinesPolicySections } from "./guidelines/GuidelinesPolicySections";

export function CommunityGuidelinesPage() {
  useMetaData(
    "Community Guidelines & Code of Conduct | Unlock Her Tech",
    "Our commitment to creating an inclusive, safe, and empowering environment for women, non-binary people, and allies across our podcast, She Leads Tech workshops, and events.",
    "https://unlockhertech.com/community-guidelines",
    {
      image: "/logo.png",
      type: "website",
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <GuidelinesHeroHeader />

      {/* ── 2. Core Values / Pillars Section ──────────────────────────────── */}
      <GuidelinesPillarsGrid />

      {/* ── 3. Policy Body Content ────────────────────────────────────────── */}
      <GuidelinesPolicySections />
    </div>
  );
}
