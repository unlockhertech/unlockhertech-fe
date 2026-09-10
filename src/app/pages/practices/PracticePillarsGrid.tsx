import { HiHeart } from "react-icons/hi2";
import { SESSION_PILLARS } from "./practicesData";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function PracticePillarsGrid() {
  return (
    <section id="overview" className="py-20 bg-stone-50 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
            Why Engineers Love Learning With She Leads Tech
          </h2>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SESSION_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-3xl p-8 border border-gray-200/80 hover:border-brand-coral/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${pillar.color} border flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-brand-coral">
                  <span>In Every Session</span>
                </div>
              </div>
            );
          })}

          {/* Special Highlight Card */}
          <div className="bg-linear-to-br from-brand-coral to-[#b42970] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white">
                <HiHeart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Inclusive & Supportive</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                We encourage a friendly, inclusive environment where learning together matters far more than finding the perfect solution on the first try.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/20 text-xs font-semibold text-white/90">
              Everyone is welcome 🌱
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
