import { Link } from "react-router";
import type { LearningPath } from "./learningPathsData";

interface LearningPathCardProps {
  path: Readonly<LearningPath>;
}

export function LearningPathCard({ path }: Readonly<LearningPathCardProps>) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-2">{path.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{path.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {path.topics.map((t) => (
            <span
              key={`topic-${path.slug}-${t}`}
              className="bg-stone-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Link
          to={path.href}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-coral rounded-full hover:opacity-90 transition"
          aria-label={`Explore the ${path.title}`}
        >
          <span>Explore this path</span>
        </Link>
      </div>
    </article>
  );
}