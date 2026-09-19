import { HiBolt, HiCheckCircle, HiClock, HiSparkles } from "react-icons/hi2";
import { ENGINEERING_TOPICS } from "./practicesData";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function PracticePatternsGrid() {
  const activeTopics = ENGINEERING_TOPICS.filter((topic) => topic.status === "active");
  const pipelineTopics = ENGINEERING_TOPICS.filter((topic) => topic.status === "pipeline");

  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Main Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Curated Technical Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Engineering Topics & Domains We Cover
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            She Leads Tech is built to provide deep, practical understanding of modern software engineering. Our live workshops currently focus on our two core foundations, with specialized domain tracks in the pipeline for next year.
          </p>
        </div>

        {/* Tier 1: Active In-Rotation Tracks */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live in Rotation Now</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Active Workshop Tracks
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 sm:max-w-md">
              Currently running across <strong>Theory</strong> concept breakdowns and practical walkthroughs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeTopics.map((topic) => (
              <div
                key={topic.name}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#b52970]/20 shadow-sm hover:border-[#b52970]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${topic.dotColor}`} />
                      <span className="text-xs font-black uppercase tracking-wider text-[#b52970]">
                        {topic.name}
                      </span>
                    </div>
                    <span className="text-[0.68rem] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral border border-brand-coral/20">
                      {topic.badge}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {topic.desc}
                  </p>

                  {topic.focusHighlights && (
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase tracking-wider font-extrabold text-stone-500 block">
                        Key Focus Areas & Deconstructions:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.focusHighlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-semibold text-stone-800"
                          >
                            <HiCheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <HiSparkles className="w-4 h-4 text-[#ff6051]" />
                    <span>Explored across <span className="text-[#ff6051]">Theory</span>, <span className="text-[#b52970]">Practice</span> & <span className="text-[#72c472]">Review</span></span>
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <HiBolt className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>Active Series</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Upcoming Curriculum Expansion / Pipeline */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200 mb-1.5">
                <HiClock className="w-3.5 h-3.5 text-amber-700" />
                <span>In Pipeline · Coming Next Year</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Curriculum Expansion Roadmap
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 sm:max-w-md">
              Specialized domain tracks expanding the She Leads Tech curriculum in upcoming series.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pipelineTopics.map((topic) => (
              <div
                key={topic.name}
                className="bg-white/90 rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${topic.dotColor}`} />
                    <span className="text-[0.65rem] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {topic.pipelineYear ?? "In Pipeline"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{topic.name}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{topic.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span className="flex items-center gap-1">
                    <HiClock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Scheduled Next Year</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

