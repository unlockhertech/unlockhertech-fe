import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import { IMG_AUDIO_EQ } from "../data";
import coFoundersPhoto from "../../assets/432250e0d9dc1c4cd94a60209ef0327c90f41452.png";
import { AboutHeroHeader } from "./about/AboutHeroHeader";
import { AboutStorySection } from "./about/AboutStorySection";
import { AboutPillarsSection } from "./about/AboutPillarsSection";
import { AboutValuesGrid } from "./about/AboutValuesGrid";
import { AboutInclusionSection } from "./about/AboutInclusionSection";
import { AboutTeamSpotlight } from "./about/AboutTeamSpotlight";

const ABOUT_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Unlock Her Tech",
  "description": "An inclusive tech community and storytelling platform empowering women and underrepresented technologists.",
  "url": "https://unlockhertech.com/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "Unlock Her Tech",
    "url": "https://unlockhertech.com",
    "logo": "https://unlockhertech.com/logo.png",
  },
};

export function AboutPage() {
  useMetaData(
    "About Us | Unlock Her Tech",
    "Learn about our mission to amplify women, non-binary people, and allies in tech through She Leads Tech workshops, career mentorship, and authentic podcast conversations.",
    "https://unlockhertech.com/about",
    {
      image: coFoundersPhoto,
      type: "website",
      jsonLd: ABOUT_META_JSON_LD,
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Page Header ────────────────────────────────────────────────── */}
      <AboutHeroHeader />

      {/* ── 2. Our Story & Evolution ───────────────────────────────────────── */}
      <AboutStorySection />

      {/* ── 3. What We Are Today: Dual Pillars ─────────────────────────────── */}
      <AboutPillarsSection />

      {/* ── 4. Core Values ────────────────────────────────────────────────── */}
      <AboutValuesGrid />

      {/* ── 5. Inclusion in Action ────────────────────────────────────────── */}
      <AboutInclusionSection />

      {/* ── 6. Team Spotlight ──────────────────────────────────────────────── */}
      <AboutTeamSpotlight />

      {/* ── 7. Subscribe CTA ───────────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />
    </div>
  );
}