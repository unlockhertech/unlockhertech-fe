import { Link } from "react-router";
import {
  HiClipboardDocumentCheck,
  HiPrinter,
  HiArrowPath,
} from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

interface AssessmentHeaderProps {
  totalAnswered: number;
  onReset: () => void;
}

export function AssessmentHeader({ totalAnswered, onReset }: AssessmentHeaderProps) {
  return (
    <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white print:hidden">
      <BrandPatternOverlay />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-white">Assessment</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <HiClipboardDocumentCheck className="w-4 h-4 text-brand-yellow" />
              <span>Interactive Career Toolkit</span>
            </div>

            <h1 className="text-white font-black" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Tech Readiness & Career Fit Self-Assessment
            </h1>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Evaluate your mindset, transferable skills, tech literacy, and networking strategy in 5 minutes. Gain real-time personalized recommendations to accelerate your transition into tech.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-brand-coral font-extrabold text-xs sm:text-sm hover:bg-white/90 transition-all shadow-md cursor-pointer"
            >
              <HiPrinter className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            {totalAnswered > 0 && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20 cursor-pointer"
                title="Reset quiz"
              >
                <HiArrowPath className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
