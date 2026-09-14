import { useState } from "react";
import {
  HiCheckCircle,
  HiLockClosed,
  HiArrowDownTray,
  HiDocumentCheck,
} from "react-icons/hi2";
import { PdfPaperThumbnail } from "../../components/PdfPaperThumbnail";
import type { ExtendedResource } from "./resourceData";

interface ResourceCardProps {
  item: ExtendedResource;
  index: number;
  userEmail: string | null;
  onOpenDownload: (item: ExtendedResource, bundleMode?: boolean) => void;
}

const DOWNLOADED_IDS_KEY = "uht_downloaded_resource_ids";

function readDownloadedIds(): string[] {
  try {
    const raw = localStorage.getItem(DOWNLOADED_IDS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch (err) {
    console.warn("Failed to read downloaded resource ids from localStorage:", err);
    return [];
  }
}

function markResourceAsDownloaded(id: string) {
  try {
    const existing = readDownloadedIds();
    if (!existing.includes(id)) {
      localStorage.setItem(DOWNLOADED_IDS_KEY, JSON.stringify([...existing, id]));
    }
  } catch (err) {
    console.warn("Failed to persist downloaded resource id to localStorage:", err);
  }
}

function getActionButtonClasses(requiresCredentials: boolean, isUnlockedForUser: boolean): string {
  if (!requiresCredentials || isUnlockedForUser) {
    return "bg-emerald-600 text-white motion-safe:hover:scale-105 hover:bg-emerald-700";
  }
  return "bg-stone-900 text-white motion-safe:hover:scale-105 hover:bg-brand-coral";
}

export function ResourceCard({
  item,
  index,
  userEmail,
  onOpenDownload,
}: Readonly<ResourceCardProps>) {
  const weekNum = item.weekNumber || index + 1;
  const requiresCredentials = item.requiresLogin || weekNum > 3;
  const isUnlockedForUser = Boolean(userEmail) || !requiresCredentials;
  const [isDownloaded, setIsDownloaded] = useState(() => readDownloadedIds().includes(item.id));

  const handleCardAction = () => {
    if (!requiresCredentials || isUnlockedForUser) {
      markResourceAsDownloaded(item.id);
      setIsDownloaded(true);
    }
    onOpenDownload(item, false);
  };

  const renderStatusPill = () => {
    if (!requiresCredentials) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
          Free (No Login)
        </span>
      );
    }
    if (isUnlockedForUser) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
          <HiCheckCircle className="w-3 h-3" /> Unlocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-brand-coral bg-brand-coral/10 px-2 py-0.5 rounded-md">
        <HiLockClosed className="w-3 h-3" /> Community Exclusive
      </span>
    );
  };

  const renderButtonContent = () => {
    if (isDownloaded && (!requiresCredentials || isUnlockedForUser)) {
      return (
        <>
          <HiCheckCircle className="w-4 h-4 text-emerald-300" />
          <span>Downloaded</span>
        </>
      );
    }
    if (!requiresCredentials) {
      return (
        <>
          <HiArrowDownTray className="w-4 h-4" />
          <span>Download PDF</span>
        </>
      );
    }
    if (isUnlockedForUser) {
      return (
        <>
          <HiDocumentCheck className="w-4 h-4 text-emerald-300" />
          <span>Download PDF</span>
        </>
      );
    }
    return (
      <>
        <HiLockClosed className="w-4 h-4" />
        <span>Unlock Free</span>
      </>
    );
  };

  const actionLabel = requiresCredentials && !isUnlockedForUser
    ? `Unlock ${item.title}`
    : `Download PDF: ${item.title}`;

  return (
    <div className="group bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between hover:shadow-xl">
      <div>
        {/* Document Visual Header */}
        <PdfPaperThumbnail
          title={item.title}
          category={item.category}
          pageCount={item.pageCount || "3 Pages"}
          weekNumber={weekNum}
          releaseDate={item.releaseDate || "Sep 14, 2026"}
          colorIndex={index}
          customColor={item.accentColor}
          requiresLogin={requiresCredentials}
          isUnlocked={isUnlockedForUser}
          isReleased={true}
        />

        {/* Copy */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.7rem] font-extrabold text-brand-coral uppercase tracking-wider">
              {item.category}
            </span>

            {/* Access Status Pill */}
            {renderStatusPill()}
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
          PDF {weekNum} • {item.pageCount || "Printable PDF"}
        </span>

        <button
          type="button"
          onClick={handleCardAction}
          aria-label={actionLabel}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${getActionButtonClasses(
            requiresCredentials,
            isUnlockedForUser
          )}`}
        >
          {renderButtonContent()}
        </button>
      </div>
    </div>
  );
}
