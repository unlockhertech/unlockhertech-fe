import { LearningPathCard } from "./LearningPathCard";
import { LEARNING_PATHS } from "./learningPathsData";
import { isPathEnabled } from "../../featureFlags";

export function LearningPathsSection() {
  return (
    <section aria-labelledby="learning-paths-title" className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-xs font-black text-brand-green tracking-[0.2em] mb-2 uppercase">
          Learning Paths
        </p>
        <h2
          id="learning-paths-title"
          className="text-3xl sm:text-4xl font-black mb-3"
        >
          Choose your path. Build your future.
        </h2>
        <p className="text-gray-600 mb-8">
          Each path is designed to help you build in-demand skills through a mix
          of theory, practice and review sessions — with a community that’s
          cheering you on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEARNING_PATHS.filter((p) => isPathEnabled(p.slug)).map((p) => (
            <LearningPathCard key={p.slug} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
