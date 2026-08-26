import { imgSheLeadsTech } from "../data";
import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { PracticesHero } from "./practices/PracticesHero";
import { PracticeCountdownCard } from "./practices/PracticeCountdownCard";
import { PracticeCodePreview } from "./practices/PracticeCodePreview";
import { PracticePatternsGrid } from "./practices/PracticePatternsGrid";
import { PracticeSessionStructure } from "./practices/PracticeSessionStructure";
import { PracticePillarsGrid } from "./practices/PracticePillarsGrid";
import { PracticeRequirementsSection } from "./practices/PracticeRequirementsSection";

const PRACTICES_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "She Leads Tech Practices: LeetCode & Problem Solving Series",
  "description": "Fortnightly interactive workshops designed to help developers strengthen coding skills, master algorithmic patterns (Two Pointers, Sliding Window, Graphs, Dynamic Programming), and ace technical interviews in a supportive peer environment.",
  "provider": {
    "@type": "Organization",
    "name": "Unlock Her Tech",
    "sameAs": "https://unlockhertech.com",
  },
  "educationalLevel": "Beginner to Intermediate",
  "isAccessibleForFree": true,
  "inLanguage": "en",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT70M",
  },
};

export function PracticesPage() {
  useMetaData(
    "She Leads Tech Practices | LeetCode & Problem Solving Series",
    "Join live, interactive LeetCode and problem-solving sessions every two weeks. Build coding confidence, pair program, and master algorithmic interview techniques in an inclusive community.",
    undefined,
    {
      image: imgSheLeadsTech,
      type: "website",
      jsonLd: PRACTICES_META_JSON_LD,
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <PracticesHero />

      {/* ── 1b. Live Fortnightly Practice Countdown Clock ───────────────── */}
      <PracticeCountdownCard />

      {/* ── 2. Algorithmic Code Preview Spotlight ───────────────────────── */}
      <PracticeCodePreview />

      {/* ── 3. Key Patterns Grid ────────────────────────────────────────── */}
      <PracticePatternsGrid />

      {/* ── 4. Session Roadmap (1-2-3 Flow) ─────────────────────────────── */}
      <PracticeSessionStructure />

      {/* ── 5. Core Principles & Pillars ────────────────────────────────── */}
      <PracticePillarsGrid />

      {/* ── 6. Requirements & Schedule ──────────────────────────────────── */}
      <PracticeRequirementsSection />

      {/* ── 7. Subscribe CTA ─────────────────────────────────────────────── */}
      <SubscribeCTA />
    </div>
  );
}
