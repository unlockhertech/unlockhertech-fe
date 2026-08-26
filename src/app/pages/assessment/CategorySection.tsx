import { type Question, SCORE_LABELS } from "./assessmentData";

export interface CategorySectionProps {
  number: string;
  title: string;
  description: string;
  badgeColor: string;
  questions: Question[];
  answers: Record<string, number>;
  onSelectScore: (questionId: string, value: number) => void;
}

export function CategorySection({
  number,
  title,
  description,
  badgeColor,
  questions,
  answers,
  onSelectScore,
}: CategorySectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
      <div className="flex items-center gap-3.5 border-b border-stone-100 pb-4 mb-5">
        <div className={`w-9 h-9 rounded-2xl font-extrabold flex items-center justify-center text-sm shadow-xs ${badgeColor}`}>
          {number}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-stone-900">{title}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Rating Scale Legend */}
      <div className="mb-6 px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-[0.72rem] sm:text-xs text-stone-600 flex flex-wrap items-center justify-between gap-y-1 gap-x-3" aria-label="Rating Scale Legend">
        <span className="font-extrabold text-stone-700 uppercase tracking-wider text-[0.68rem] sm:text-xs">
          Rating Scale:
        </span>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          <span className="inline-flex items-center gap-1 font-semibold">
            <span className="w-4 h-4 rounded-full bg-pink-100 text-brand-coral font-bold text-[0.65rem] flex items-center justify-center">1</span>
            <span>Rarely / Never</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-[0.65rem] flex items-center justify-center">3</span>
            <span>Sometimes / Moderately</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[0.65rem] flex items-center justify-center">5</span>
            <span>Consistently / Confidently</span>
          </span>
        </div>
      </div>

      <div className="space-y-7">
        {questions.map((q) => {
          const selectedVal = answers[q.id];
          return (
            <div key={q.id} className="space-y-3">
              <p className="text-sm font-semibold text-stone-800 leading-snug">{q.text}</p>
              <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center" role="radiogroup" aria-label={q.text}>
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = selectedVal === val;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${val} - ${SCORE_LABELS[val]}`}
                      key={val}
                      onClick={() => onSelectScore(q.id, val)}
                      className={`py-2 px-1 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-brand-coral bg-pink-50/80 text-brand-coral ring-2 ring-brand-coral/20 shadow-xs"
                          : "border-stone-200/80 bg-white text-stone-700 hover:border-brand-coral/50 hover:bg-stone-50"
                      }`}
                    >
                      <span>{val}</span>
                      {val === 1 && (
                        <span className="text-[0.6rem] sm:text-[0.65rem] text-stone-400 font-normal mt-0.5 leading-tight">
                          <span className="inline sm:hidden">Rare</span>
                          <span className="hidden sm:inline">Rarely</span>
                        </span>
                      )}
                      {val === 3 && (
                        <span className="text-[0.6rem] sm:text-[0.65rem] text-stone-400 font-normal mt-0.5 leading-tight">
                          <span className="inline sm:hidden">Some</span>
                          <span className="hidden sm:inline">Sometimes</span>
                        </span>
                      )}
                      {val === 5 && (
                        <span className="text-[0.6rem] sm:text-[0.65rem] text-stone-400 font-normal mt-0.5 leading-tight">
                          <span className="inline sm:hidden">Always</span>
                          <span className="hidden sm:inline">Always</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
