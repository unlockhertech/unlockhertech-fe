import { PATTERNS } from "./practicesData";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function PracticePatternsGrid() {
  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Curated Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Essential Interview Patterns We Cover
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            We cycle through fundamental algorithmic patterns every two weeks so you gain broad, practical mastery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PATTERNS.map((pattern) => (
            <div
              key={pattern.name}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${pattern.dotColor}`} />
                  <span className="text-[0.7rem] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-stone-100 text-gray-700">
                    {pattern.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pattern.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pattern.desc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-brand-coral">
                <span>Practiced together live</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
