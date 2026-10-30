import { LearningPathCard } from "./LearningPathCard";
import { LEARNING_PATHS } from "./learningPathsData";
import { HiSparkles } from "react-icons/hi2";

export function LearningPathsSection() {
  const isSingle = LEARNING_PATHS.length === 1;

  return (
    <section aria-labelledby="learning-paths-title" className="py-14 sm:py-16 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/70 text-[#b52970] text-xs font-black uppercase tracking-wider mb-3">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>Curriculum Pathways</span>
          </div>
          <h2
            id="learning-paths-title"
            className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3"
          >
            Choose your path. Build your future.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Each pathway is structured across our 4-stage learning loop —{" "}
            <strong className="text-[#ff6051]">Theory</strong>,{" "}
            <strong className="text-[#b52970]">Practice</strong>,{" "}
            <strong className="text-[#72c472]">Review</strong>, and{" "}
            <strong className="text-brand-blue">Build</strong> — to give you practical depth and interview-ready mastery.
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className={isSingle ? "max-w-5xl" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
          {LEARNING_PATHS.map((p) => (
            <LearningPathCard key={p.slug} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
