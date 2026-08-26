import { GUIDELINE_PILLARS } from "./guidelinesData";

export function GuidelinesPillarsGrid() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDELINE_PILLARS.map(({ icon: Icon, title, desc, accent, bg }) => (
          <div
            key={title}
            className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: bg, color: accent }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
