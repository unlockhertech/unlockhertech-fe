import { Link } from "react-router";
import { HiDocumentCheck, HiChevronRight } from "react-icons/hi2";

export function ResourceAssessmentCallout() {
  if (import.meta.env.VITE_ENABLE_ASSESSMENT !== "true") return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative rounded-3xl bg-linear-to-r from-pink-50/80 via-white to-blue-50/80 p-8 sm:p-10 text-stone-900 border border-brand-coral/20 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-coral/15 text-brand-coral text-xs font-extrabold uppercase tracking-wider">
            <HiDocumentCheck className="w-3.5 h-3.5" />
            <span>Interactive Self-Assessment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Tech Readiness & Career Fit Worksheet
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Evaluate your mindset, transferable skills, tech literacy, and networking strategy in 5 minutes. Get real-time scoring and customized action recommendations tailored for non-tech career changers.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            to="/assessment"
            className="px-8 py-4 rounded-full bg-brand-coral text-white font-extrabold text-sm hover:opacity-90 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Take Free Assessment</span>
            <HiChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
