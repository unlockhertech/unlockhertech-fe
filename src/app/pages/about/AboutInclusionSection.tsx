import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

const ROLES = [
  { label: "Software Engineers", className: "bg-white text-brand-coral border-pink-200" },
  { label: "Engineering Managers", className: "bg-white text-brand-blue border-blue-200" },
  { label: "Product Designers", className: "bg-white text-amber-800 border-amber-200" },
  { label: "Data & AI Scientists", className: "bg-white text-purple-800 border-purple-200" },
  { label: "Founders & Tech Leads", className: "bg-white text-brand-green border-emerald-200" },
  { label: "Career Switchers & Students", className: "bg-white text-gray-800 border-stone-200" },
];

export function AboutInclusionSection() {
  return (
    <section className="py-16 bg-stone-50 border-b border-gray-200/80 text-center relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
          Inclusion by Design
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
          Every Voice & Every Role Belongs Here
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          We are intentional about who we platform and whose technical skills we champion. Our community welcomes technologists across all disciplines and career stages.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-8">
          {ROLES.map(({ label, className }) => (
            <span
              key={label}
              className={`px-4 py-2 rounded-full text-xs font-bold border shadow-xs ${className}`}
            >
              {label}
            </span>
          ))}
        </div>

        <Link
          to="/community-guidelines"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-coral transition-colors"
        >
          <span>Read our Community Guidelines & Code of Conduct</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
