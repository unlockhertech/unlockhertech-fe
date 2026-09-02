import { HiShieldCheck } from "react-icons/hi2";

export function JobVettingStandards() {
  return (
    <section className="bg-white py-16 sm:py-20 border-t border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 text-brand-coral text-xs font-bold uppercase tracking-wider mb-4 border border-pink-100">
            <HiShieldCheck className="w-4 h-4" />
            <span>Our Vetting Standards</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
            How We Protect Job Seekers & Foster Inclusion
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Unlock Her Tech operates on a curated aggregator model. We filter out the noise and only publish public
            roles that meet four non-negotiable transparency and cultural standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-stone-50 rounded-3xl p-6 border border-gray-200/70">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-brand-coral flex items-center justify-center font-extrabold text-base mb-4">
              1
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">Mandatory Salary Transparency</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Postings must state explicit minimum and maximum compensation bands. We reject vague listings to combat
              gender and racial wage disparities.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-6 border border-gray-200/70">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-brand-yellow flex items-center justify-center font-extrabold text-base mb-4">
              2
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">Remote & Flexibility Clarity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Workplace models must be clearly identified (Global, Regional, Hybrid, On-site) to respect caregivers,
              parents, and flexible schedules.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-6 border border-gray-200/70">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center font-extrabold text-base mb-4">
              3
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">Gender-Neutral & Open Language</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Descriptions must avoid aggressive, exclusionary jargon (&quot;rockstar&quot;, &quot;ninja&quot;, unrealistic credential inflation) and emphasize collaborative,
              growth-minded team environments.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-6 border border-gray-200/70">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-brand-green flex items-center justify-center font-extrabold text-base mb-4">
              4
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">Centered on Women & Open to Allies</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              While centered on uplifting women and underrepresented technologists, all supportive genders and allies are welcome. Inclusion
              strengthens teams across the entire ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
