import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

const ROLES = [
  { label: "Software Engineers", className: "bg-pink-50 text-brand-coral border-pink-200" },
  { label: "Engineering Managers", className: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Product Designers", className: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "Data & AI Scientists", className: "bg-purple-50 text-purple-800 border-purple-200" },
  { label: "Founders & Tech Leads", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Career Switchers", className: "bg-stone-100 text-gray-800 border-stone-200" },
];

export function HomeInclusivitySection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="mb-2 text-xs uppercase tracking-widest text-brand-coral font-extrabold">
          Inclusion by Design
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
          A Safe, Inspiring Space for Everyone in Tech
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          Whether you are writing your first line of code, stepping into engineering management, or transitioning into tech — you belong here.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto mb-8">
          {ROLES.map(({ label, className }) => (
            <span
              key={label}
              className={`px-4 py-2 rounded-full text-xs font-bold border ${className}`}
            >
              {label}
            </span>
          ))}
        </div>

        <Link
          to="/community-guidelines"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-coral transition-colors"
        >
          <span>Read our Community Guidelines & Code of Conduct</span>
          <HiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
