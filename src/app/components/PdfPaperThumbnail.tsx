import { HiDocumentText, HiLockClosed, HiCheckCircle, HiCalendar } from "react-icons/hi2";
import { BERRY, PINK, ORANGE, GREEN, BLUE } from "../data";

// eslint-disable-next-line react-refresh/only-export-components
export const RESOURCE_HEX_ROTATION = [
  PINK,   // #f4a0b4
  BLUE,   // #5f9de3
  ORANGE, // #e8563a
  GREEN,  // #72c472
  BERRY,  // #b42970
];

interface PdfPaperThumbnailProps {
  colorIndex?: number;
  customColor?: string;
  title?: string;
  category?: string;
  isPlaceholder?: boolean;
  pageCount?: string;
  weekNumber?: number;
  releaseDate?: string;
  requiresLogin?: boolean;
  isUnlocked?: boolean;
  isReleased?: boolean;
}

function getThumbnailStatusIcon(
  isReleased: boolean,
  requiresLogin: boolean,
  isUnlocked: boolean
) {
  if (!isReleased) {
    return <HiCalendar className="w-3 h-3 shrink-0" />;
  }
  if (requiresLogin && !isUnlocked) {
    return <HiLockClosed className="w-3 h-3 shrink-0" />;
  }
  if (isUnlocked) {
    return <HiCheckCircle className="w-3 h-3 shrink-0" />;
  }
  return <HiDocumentText className="w-3 h-3 shrink-0" />;
}

export function PdfPaperThumbnail({
  colorIndex = 0,
  customColor,
  title,
  category,
  isPlaceholder = false,
  weekNumber = 1,
  releaseDate = "Sep 7, 2026",
  requiresLogin = false,
  isUnlocked = false,
  isReleased = false,
}: Readonly<PdfPaperThumbnailProps>) {
  const accentColor =
    customColor ||
    (RESOURCE_HEX_ROTATION[Math.abs(colorIndex) % RESOURCE_HEX_ROTATION.length] ??
      RESOURCE_HEX_ROTATION[0]);

  if (isPlaceholder) {
    return (
      <div className="relative w-full aspect-4/3 rounded-2xl bgbg-linear-to-brrom-stone-100 to-stone-200/80 p-5 flex flex-col items-center justify-center border-2 border-dashed border-stone-300 group-hover:border-brand-coral/50 transition-all overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-linear-to-tr from-brand-coral/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative w-32 h-40 bg-white/70 backdrop-blur-xs rounded-xl shadow-md border border-stone-300/60 flex flex-col justify-between p-3.5 transform group-hover:scale-105 transition-transform duration-300">
          <div className="border-b border-stone-200 pb-2">
            <div className="w-10 h-2 bg-stone-300 rounded mb-1.5" />
            <div className="text-[10px] font-bold text-stone-400 leading-tight">Next Weekly Drop...</div>
          </div>

          <div className="flex flex-col items-center justify-center my-2 py-1">
            <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 shadow-inner">
              <HiLockClosed className="w-4 h-4 text-stone-500" />
            </div>
          </div>

          <div className="bg-stone-200 text-stone-600 text-[9px] font-bold py-1 px-1.5 rounded text-center truncate">
            {`PDF ${weekNumber} • Coming Soon`}
          </div>
        </div>

        <span className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.7rem] font-extrabold bg-stone-900/10 text-stone-700 uppercase tracking-wider">
          In Production
        </span>
      </div>
    );
  }

  // Determine bottom thumbnail badge text & colour
  let statusBadgeText = `PDF ${weekNumber} • Drops ${releaseDate}`;
  let badgeBgColor = accentColor;

  if (isReleased) {
    if (requiresLogin) {
      if (isUnlocked) {
        statusBadgeText = `PDF ${weekNumber} • Unlocked`;
        badgeBgColor = "#10B981"; // Emerald green
      } else {
        statusBadgeText = `PDF ${weekNumber} • Community Access`;
        badgeBgColor = "#b42970"; // Berry
      }
    } else {
      statusBadgeText = `PDF ${weekNumber} • Free Guide`;
      badgeBgColor = "#10B981"; // Emerald
    }
  }

  return (
    <div
      className="relative w-full aspect-4/3 rounded-2xl p-5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}38 100%)`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 opacity-90"
        style={{ backgroundColor: accentColor }}
      />

      {/* Miniature Printable Paper Graphic */}
      <div className="relative w-36 h-44 bg-white rounded-xl shadow-md border border-stone-200/90 p-3.5 flex flex-col justify-between transform group-hover:scale-105 transition-transform duration-300">
        
        {/* Top Fold Corner */}
        <div
          className="absolute top-0 right-0 w-5 h-5 bg-stone-100 rounded-bl-md shadow-xs border-b border-l border-stone-300/60 pointer-events-none"
          style={{
            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
          }}
        />

        {/* Paper Header */}
        <div>
          <div className="border-b-2 pb-2 mb-2" style={{ borderColor: accentColor }}>
            <div
              className="h-2 w-10 rounded mb-1"
              style={{ backgroundColor: accentColor }}
            />
            <div className="text-[10px] font-extrabold text-stone-900 leading-tight line-clamp-2">
              {title || category || "Career Guide"}
            </div>
          </div>

          {/* Skeleton Lines */}
          <div className="space-y-1.5 my-2">
            <div className="h-1 bg-stone-100 rounded w-full" />
            <div className="h-1 bg-stone-100 rounded w-4/5" />
            <div className="h-1 bg-stone-100 rounded w-5/6" />
          </div>
        </div>

        {/* Paper Footer Badge */}
        <div
          className="text-white text-[8.5px] font-extrabold py-1 px-1 rounded text-center truncate shadow-xs flex items-center justify-center gap-1"
          style={{ backgroundColor: badgeBgColor }}
        >
          {getThumbnailStatusIcon(isReleased, requiresLogin, isUnlocked)}
          <span className="truncate">{statusBadgeText}</span>
        </div>
      </div>

      {/* Subtle ambient blur circle */}
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl opacity-25 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}


