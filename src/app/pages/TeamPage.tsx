import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import { TEAM_PAGE_JSON_LD } from "./team/teamUtils";
import { TeamHeroHeader } from "./team/TeamHeroHeader";
import { TeamGridSection } from "./team/TeamGridSection";
import { TeamMissionCTA } from "./team/TeamMissionCTA";

export function TeamPage() {
  useMetaData(
    "Meet the Team | Unlock Her Tech",
    "Meet the passionate team behind Unlock Her Tech — software engineers, tech professionals, and community builders dedicated to empowering women and allies in tech.",
    "https://unlockhertech.com/team",
    {
      image: "/logo.png",
      type: "website",
      jsonLd: TEAM_PAGE_JSON_LD,
    }
  );

  return (
    <div>
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <TeamHeroHeader />

      {/* ── 2. Team Grid (Co-founders + Team) ─────────────────────────────── */}
      <TeamGridSection />

      {/* ── 3. Join the Mission CTA ───────────────────────────────────────── */}
      <TeamMissionCTA />

      {/* ── 4. Subscribe ──────────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Subscribe & Join the Community"
        subtitle="Follow along on your favourite platform — a new episode drops every single month."
      />
    </div>
  );
}
