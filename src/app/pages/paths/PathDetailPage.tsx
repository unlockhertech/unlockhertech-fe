import { Link, useParams } from "react-router";
import { LEARNING_PATHS } from "../practices/learningPathsData";
import { isPathEnabled } from "../../featureFlags";

export function PathDetailPage() {
  const { slug } = useParams();
  const path = LEARNING_PATHS.find((p) => p.slug === slug);
  const enabled = slug ? isPathEnabled(slug) : false;

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/practices" className="text-sm text-brand-coral font-bold hover:underline">
            ← Back to Practices
          </Link>
        </div>

        {path && enabled ? (
          <>
            <header className="mb-8">
              <p className="text-xs font-black text-brand-green tracking-[0.2em] mb-2 uppercase">
                Learning Path
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                {path.title}
              </h1>
              <p className="text-gray-700 text-lg">{path.description}</p>
            </header>

            <section className="mb-10">
              <h2 className="text-xl font-black text-gray-900 mb-4">What you’ll focus on</h2>
              <div className="flex flex-wrap gap-2">
                {path.topics.map((t) => (
                  <span
                    key={`topic-pill-${path.slug}-${t}`}
                    className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <div className="rounded-2xl bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-black mb-2">How it works</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Live Theory → collaborative Practice → reinforcement Review.</li>
                  <li>Rotate topics within the path — no separate prep for each skill.</li>
                  <li>Join the community, ask questions, and track progress.</li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl bg-white p-8 border border-gray-200 text-center">
            <h1 className="text-2xl font-black mb-2">Path coming soon</h1>
            <p className="text-gray-600 mb-6">
              We’re preparing this learning path. In the meantime, explore other paths.
            </p>
            <Link
              to="/practices"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-coral rounded-full hover:opacity-90 transition"
              aria-label="Back to practices"
            >
              <span>Explore other paths</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
