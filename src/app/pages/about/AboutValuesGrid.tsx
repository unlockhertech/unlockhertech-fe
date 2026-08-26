import { ABOUT_VALUES } from "./aboutData";

export function AboutValuesGrid() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            What Drives Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Our Community Values
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            These four principles guide every episode we record and every practice session we host.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-stone-50 rounded-3xl p-7 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${v.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-white text-gray-700 border border-gray-200">
                    {v.badge}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-3 mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
