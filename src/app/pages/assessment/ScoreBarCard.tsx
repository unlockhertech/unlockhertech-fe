import { MAX_CATEGORY_SCORE } from "./assessmentData";

interface ScoreBarCardProps {
  title: string;
  score: number;
  color: string;
}

export function ScoreBarCard({ title, score, color }: ScoreBarCardProps) {
  const pct = Math.round((score / MAX_CATEGORY_SCORE) * 100);
  return (
    <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/70">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-stone-800">{title}</span>
        <span className="text-sm font-extrabold" style={{ color }}>
          {score} / {MAX_CATEGORY_SCORE}
        </span>
      </div>
      <div className="w-full bg-stone-200/70 rounded-full h-3 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
