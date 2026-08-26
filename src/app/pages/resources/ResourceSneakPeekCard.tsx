import { HiCalendar, HiEnvelope } from "react-icons/hi2";
import { PdfPaperThumbnail } from "../../components/PdfPaperThumbnail";

interface ResourceSneakPeekCardProps {
  onNotifyClick: () => void;
}

export function ResourceSneakPeekCard({ onNotifyClick }: ResourceSneakPeekCardProps) {
  return (
    <div className="group bg-white/70 rounded-3xl p-6 border-2 border-dashed border-stone-300 hover:border-brand-coral transition-all duration-300 flex flex-col justify-between shadow-xs">
      <div>
        <PdfPaperThumbnail isPlaceholder={true} weekNumber={6} />

        <div className="mt-5 space-y-2">
          <div className="inline-flex items-center gap-1 text-[0.7rem] font-extrabold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
            <HiCalendar className="w-3.5 h-3.5" />
            <span>Week 6 Drop • Oct 12</span>
          </div>
          <h3 className="text-lg font-bold text-stone-800">
            10 Tech Jargon Terms Every Beginner Must Know
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Demystify APIs, Tech Debt, Agile, CI/CD, and Sprint Retrospectives into simple, everyday conversational English.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
        <span className="text-xs text-stone-400 font-medium">Releasing Oct 12</span>
        <button
          type="button"
          onClick={onNotifyClick}
          className="px-5 py-2.5 rounded-full bg-brand-coral/10 hover:bg-brand-coral text-brand-coral hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <HiEnvelope className="w-4 h-4" />
          <span>Notify Me</span>
        </button>
      </div>
    </div>
  );
}
