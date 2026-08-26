import {
  HiCalendar,
  HiCheckCircle,
  HiLockClosed,
  HiBell,
  HiArrowDownTray,
  HiDocumentCheck,
} from "react-icons/hi2";
import { PdfPaperThumbnail } from "../../components/PdfPaperThumbnail";
import type { ExtendedResource } from "./resourceData";

interface ResourceCardProps {
  item: ExtendedResource;
  index: number;
  now: number;
  userEmail: string | null;
  onOpenDownload: (item: ExtendedResource, earlyAccess?: boolean) => void;
}

export function ResourceCard({
  item,
  index,
  now,
  userEmail,
  onOpenDownload,
}: ResourceCardProps) {
  const weekNum = item.weekNumber || index + 1;
  const requiresCredentials = item.requiresLogin || weekNum > 3;
  const releaseTime = item.releaseTimestamp || new Date("2026-08-24T00:00:00Z").getTime();
  const isReleased = releaseTime <= now;
  const isUnlockedForUser = isReleased && (!requiresCredentials || !!userEmail);

  return (
    <div className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 flex flex-col justify-between">
      <div>
        {/* Stylized Miniature Paper Graphic Thumbnail */}
        <PdfPaperThumbnail
          colorIndex={index}
          customColor={item.accentColor}
          title={item.title}
          category={item.category}
          pageCount={item.pageCount || "3 Pages"}
          weekNumber={weekNum}
          releaseDate={item.releaseDate || "Sep 7, 2026"}
          requiresLogin={requiresCredentials}
          isUnlocked={isUnlockedForUser}
          isReleased={isReleased}
        />

        {/* Copy */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.7rem] font-extrabold text-brand-coral uppercase tracking-wider">
              {item.category}
            </span>

            {/* Access / Launch Status Pill */}
            {!isReleased ? (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                <HiCalendar className="w-3 h-3" /> Drops {item.releaseDate || "Sep 7"}
              </span>
            ) : !requiresCredentials ? (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Free (No Login)
              </span>
            ) : isUnlockedForUser ? (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                <HiCheckCircle className="w-3 h-3" /> Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-brand-coral bg-brand-coral/10 px-2 py-0.5 rounded-md">
                <HiLockClosed className="w-3 h-3" /> Community Exclusive
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-coral transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-400 font-medium">
          Week {weekNum} • {item.pageCount || "Printable PDF"}
        </span>

        <button
          type="button"
          onClick={() => onOpenDownload(item, false)}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
            !isReleased
              ? "bg-brand-coral text-white hover:opacity-90 hover:scale-105"
              : !requiresCredentials || isUnlockedForUser
              ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105"
              : "bg-stone-900 text-white hover:bg-brand-coral hover:scale-105"
          }`}
        >
          {!isReleased ? (
            <>
              <HiBell className="w-4 h-4" />
              <span>Get Notified</span>
            </>
          ) : !requiresCredentials ? (
            <>
              <HiArrowDownTray className="w-4 h-4" />
              <span>Download PDF</span>
            </>
          ) : isUnlockedForUser ? (
            <>
              <HiDocumentCheck className="w-4 h-4 text-emerald-300" />
              <span>Download PDF</span>
            </>
          ) : (
            <>
              <HiLockClosed className="w-4 h-4" />
              <span>Join Community to Unlock</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
