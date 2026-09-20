import { imgSheLeadsTech } from "../data";
import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { PracticesHero } from "@/app/pages/sheleadstech/PracticesHero";
import { PracticeCountdownCard } from "@/app/pages/sheleadstech/PracticeCountdownCard";
import { SheLeadsTechStagesNavigator } from "@/app/pages/sheleadstech/SheLeadsTechStagesNavigator";
// import { PracticePatternsGrid } from "./sheleadstech/PracticePatternsGrid";
import { LearningPathsSection } from "@/app/pages/sheleadstech/LearningPathsSection";
import { PracticeRequirementsSection } from "@/app/pages/sheleadstech/PracticeRequirementsSection";

const PRACTICES_META_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "She Leads Tech: Theory, Practice & Review Workshop Series",
  "description": "Interactive engineering workshops designed to help developers master technical concepts through instructor-led Theory, hands-on Practice, and reinforcement Review. Covering DSA, system design, cloud, architecture, and full-stack engineering.",
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
    "She Leads Tech | Theory, Practice & Review Workshop Series",
    "Join live, interactive She Leads Tech engineering workshops. Master concepts through instructor-led Theory, hands-on collaborative Practice, and reinforcement Review sessions.",
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

      {/* ── 2. Live Practice Countdown Clock ─────────────────────── */}
      <PracticeCountdownCard />

      {/* ── 3. Three Stages Navigator (Theory, Practice, Review) ─────────── */}
      <SheLeadsTechStagesNavigator />

      {/* ── 4. Learning Paths Grid ───────────────────────────────────────── */}
      <LearningPathsSection />

      {/* ── 5. Prerequisites & Guidelines ─────────────────────────────────── */}
      <PracticeRequirementsSection />

      {/* ── 6. Subscribe CTA ─────────────────────────────────────────────── */}
      <SubscribeCTA />
    </div>
  );
}
