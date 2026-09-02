import { HiChartPie } from "react-icons/hi2";
import { MAX_CATEGORY_SCORE, type AssessmentScores, type CategoryKey } from "./assessmentData";

interface RadarDimension {
  key: CategoryKey;
  title: string;
  score: number;
  maxScore: number;
  color: string;
}

export interface ReadinessRadarChartProps {
  scores: AssessmentScores;
}

export function ReadinessRadarChart({ scores }: Readonly<ReadinessRadarChartProps>) {
  const cx = 240;
  const cy = 200;
  const radius = 115;
  const maxScore = MAX_CATEGORY_SCORE;

  const dimensions: RadarDimension[] = [
    { key: "m1", title: "Mindset & Resilience", score: scores.m1, maxScore, color: "#b42970" },
    { key: "m2", title: "Transferable Skills", score: scores.m2, maxScore, color: "#e8563a" },
    { key: "m3", title: "Tech Literacy & Portfolio", score: scores.m3, maxScore, color: "#5f9de3" },
    { key: "m4", title: "Networking & Strategy", score: scores.m4, maxScore, color: "#72c472" },
  ];

  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (r: number) => {
    return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
  };

  const r0 = Math.max(6, (scores.m1 / maxScore) * radius);
  const r1 = Math.max(6, (scores.m2 / maxScore) * radius);
  const r2 = Math.max(6, (scores.m3 / maxScore) * radius);
  const r3 = Math.max(6, (scores.m4 / maxScore) * radius);

  const dataPoints = `${cx},${cy - r0} ${cx + r1},${cy} ${cx},${cy + r2} ${cx - r3},${cy}`;

  const vertexCoords = [
    { x: cx, y: cy - r0, dim: dimensions[0] },
    { x: cx + r1, y: cy, dim: dimensions[1] },
    { x: cx, y: cy + r2, dim: dimensions[2] },
    { x: cx - r3, y: cy, dim: dimensions[3] },
  ];

  return (
    <div className="bg-stone-50/80 rounded-3xl p-6 sm:p-7 border border-stone-200/70 flex flex-col items-center justify-center h-full">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-brand-coral/10 text-brand-coral rounded-xl">
            <HiChartPie className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-stone-900">Visual Readiness Radar</h3>
            <p className="text-xs text-stone-500">4-dimensional readiness map</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-white border border-stone-200/80 rounded-full text-stone-600 shadow-2xs">
          Spider Chart
        </span>
      </div>

      <div className="w-full max-w-110 aspect-4/3 flex items-center justify-center my-1">
        <svg
          viewBox="0 0 480 400"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Visual Readiness Radar Chart"
        >
          <defs>
            <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b42970" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#e8563a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5f9de3" stopOpacity="0.3" />
            </linearGradient>
            <filter id="radarShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Concentric Grid Polygons */}
          {levels.map((lvl, idx) => {
            const r = radius * lvl;
            const scoreVal = lvl * maxScore;
            return (
              <g key={lvl}>
                <polygon
                  points={getPolygonPoints(r)}
                  fill={idx % 2 === 0 ? "rgba(255, 255, 255, 0.75)" : "rgba(245, 245, 244, 0.5)"}
                  stroke="#e7e5e4"
                  strokeWidth="1.2"
                  strokeDasharray={lvl < 1 ? "3 3" : undefined}
                />
                <text
                  x={cx + 6}
                  y={cy - r + 11}
                  fontSize="9"
                  fontWeight="700"
                  fill="#a8a29e"
                  textAnchor="start"
                >
                  {scoreVal}
                </text>
              </g>
            );
          })}

          {/* Axis lines */}
          <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke="#d6d3d1" strokeWidth="1.2" />
          <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="#d6d3d1" strokeWidth="1.2" />

          {/* User Score Filled Polygon */}
          <polygon
            points={dataPoints}
            fill="url(#radarFillGrad)"
            stroke="#e8563a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#radarShadow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Data points at vertices */}
          {vertexCoords.map((pt) => (
            <g key={pt.dim.key} className="transition-all duration-700">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5.5"
                fill={pt.dim.color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Axis Labels */}
          {/* Top: Mindset & Resilience */}
          <g>
            <text
              x={cx}
              y={cy - radius - 24}
              textAnchor="middle"
              className="text-xs font-extrabold fill-stone-800"
              fontSize="12"
              fontWeight="800"
            >
              Mindset & Resilience
            </text>
            <text
              x={cx}
              y={cy - radius - 9}
              textAnchor="middle"
              fill="#b42970"
              fontSize="11"
              fontWeight="800"
            >
              {scores.m1} / {maxScore} pts
            </text>
          </g>

          {/* Right: Transferable Skills */}
          <g>
            <text
              x={cx + radius + 14}
              y={cy - 6}
              textAnchor="start"
              className="text-xs font-extrabold fill-stone-800"
              fontSize="12"
              fontWeight="800"
            >
              Transferable Skills
            </text>
            <text
              x={cx + radius + 14}
              y={cy + 10}
              textAnchor="start"
              fill="#e8563a"
              fontSize="11"
              fontWeight="800"
            >
              {scores.m2} / {maxScore} pts
            </text>
          </g>

          {/* Bottom: Tech Literacy & Portfolio */}
          <g>
            <text
              x={cx}
              y={cy + radius + 22}
              textAnchor="middle"
              className="text-xs font-extrabold fill-stone-800"
              fontSize="12"
              fontWeight="800"
            >
              Tech Literacy & Portfolio
            </text>
            <text
              x={cx}
              y={cy + radius + 37}
              textAnchor="middle"
              fill="#5f9de3"
              fontSize="11"
              fontWeight="800"
            >
              {scores.m3} / {maxScore} pts
            </text>
          </g>

          {/* Left: Networking & Strategy */}
          <g>
            <text
              x={cx - radius - 14}
              y={cy - 6}
              textAnchor="end"
              className="text-xs font-extrabold fill-stone-800"
              fontSize="12"
              fontWeight="800"
            >
              Networking & Strategy
            </text>
            <text
              x={cx - radius - 14}
              y={cy + 10}
              textAnchor="end"
              fill="#72c472"
              fontSize="11"
              fontWeight="800"
            >
              {scores.m4} / {maxScore} pts
            </text>
          </g>
        </svg>
      </div>

      {/* Quick Legend / Dimensional Pills */}
      <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-stone-200/60">
        {dimensions.map((d) => (
          <div key={d.key} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200/60">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <div className="min-w-0">
              <div className="text-[0.65rem] font-semibold text-stone-500 truncate">{d.title}</div>
              <div className="text-xs font-extrabold text-stone-900">{d.score} / {maxScore}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
