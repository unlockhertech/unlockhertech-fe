import { useState } from "react";
import {
  HiCheckCircle,
  HiLockClosed,
  HiArrowDownTray,
  HiBookmark,
  HiSparkles,
  HiDocumentText,
  HiClipboardDocumentList,
  HiWrenchScrewdriver,
  HiPlayCircle,
  HiBookOpen,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { BERRY, BLUE, ORANGE, GREEN, PINK } from "../../data";
import { getFormatBadgeLabel, YELLOW, type ExtendedResource } from "./resourceData";

interface UniversalResourceCardProps {
  item: ExtendedResource;
  index: number;
  userEmail: string | null;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenAction: (item: ExtendedResource) => void;
}

const BRAND_CYCLE = [
  { border: "hover:border-brand-coral/50", accent: BERRY },
  { border: "hover:border-[#5f9de3]/50", accent: BLUE },
  { border: "hover:border-[#e8563a]/50", accent: ORANGE },
  { border: "hover:border-[#72c472]/50", accent: GREEN },
  { border: "hover:border-brand-pink/60", accent: PINK },
  { border: "hover:border-[#ffcb00]/60", accent: YELLOW },
];

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

function renderTypeIcon(type?: string, className = "w-3.5 h-3.5") {
  switch (type) {
    case "template":
      return <HiClipboardDocumentList className={className} aria-hidden="true" />;
    case "tool":
      return <HiWrenchScrewdriver className={className} aria-hidden="true" />;
    case "video":
      return <HiPlayCircle className={className} aria-hidden="true" />;
    case "article":
      return <HiBookOpen className={className} aria-hidden="true" />;
    case "guide":
    default:
      return <HiDocumentText className={className} aria-hidden="true" />;
  }
}

function getTypeBadgeColor(type?: string): string {
  switch (type) {
    case "template":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "tool":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "video":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "article":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "guide":
    default:
      return "bg-pink-50 text-brand-coral border-pink-200";
  }
}

function getLevelBadgeColor(level?: string): string {
  switch (level) {
    case "Beginner":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Intermediate":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Advanced":
      return "bg-pink-50 text-brand-coral border-pink-200";
    case "All Levels":
    default:
      return "bg-amber-50 text-amber-800 border-amber-200";
  }
}

export function UniversalResourceCard({
  item,
  index,
  userEmail,
  isBookmarked,
  onToggleBookmark,
  onOpenAction,
}: Readonly<UniversalResourceCardProps>) {
  const isComingSoon = Boolean(item.isComingSoon);
  const resourceType = item.type || (item.format as string) || "guide";
  const weekNum = item.weekNumber || index + 1;
  const isPdfGuide = resourceType === "guide" || Boolean(item.pdfUrl);
  const requiresCredentials = isPdfGuide && (item.requiresLogin || weekNum > 3);
  const isUnlockedForUser = Boolean(userEmail) || !requiresCredentials;

  const [isDownloaded, setIsDownloaded] = useState(() => readDownloadedIds().includes(item.id));

  const formatLabel = getFormatBadgeLabel(resourceType);
  const durationOrPages = item.durationOrPages || item.pageCount || item.fileSize || "Resource";
  const actionLabel =
    item.actionLabel ||
    (resourceType === "tool"
      ? "Open Tool"
      : resourceType === "video"
      ? "Watch Video"
      : resourceType === "article"
      ? "Read Article"
      : resourceType === "template"
      ? "Get Template"
      : "Download PDF");

  const handleActionClick = () => {
    if (isComingSoon) {
      onOpenAction(item);
      return;
    }

    if (isPdfGuide && (!requiresCredentials || isUnlockedForUser)) {
      markResourceAsDownloaded(item.id);
      setIsDownloaded(true);
    }

    onOpenAction(item);
  };

  const renderStatusBadge = () => {
    if (isComingSoon) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
          <HiSparkles className="w-3 h-3 text-amber-600" />
          <span>Coming {item.releaseDate ?? "Soon"}</span>
        </span>
      );
    }

    if (!isPdfGuide) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <HiCheckCircle className="w-3 h-3 text-emerald-500" />
          <span>Free Access</span>
        </span>
      );
    }

    if (!requiresCredentials) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span>Free (No Login)</span>
        </span>
      );
    }

    if (isUnlockedForUser) {
      return (
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <HiCheckCircle className="w-3 h-3 text-emerald-500" />
          <span>Unlocked</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-brand-coral bg-brand-coral/10 px-2.5 py-0.5 rounded-full border border-brand-coral/20">
        <HiLockClosed className="w-3 h-3" />
        <span>Community Access</span>
      </span>
    );
  };

  const cardTheme = BRAND_CYCLE[Math.abs(index) % BRAND_CYCLE.length];

  return (
    <article
      className={`flex flex-col h-full bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 ${cardTheme.border} shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden`}
    >
      {/* Top brand accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        style={{ backgroundColor: cardTheme.accent }}
      />

      {/* Top Header: Type Pill & Bookmark Button */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeBadgeColor(
              resourceType
            )}`}
          >
            {renderTypeIcon(resourceType, "w-3.5 h-3.5")}
            <span>{formatLabel}</span>
          </span>

          {item.level && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium border ${getLevelBadgeColor(
                item.level
              )}`}
            >
              {item.level}
            </span>
          )}
        </div>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={() => onToggleBookmark(item.id)}
          aria-label={isBookmarked ? `Remove ${item.title} from bookmarks` : `Save ${item.title} to bookmarks`}
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isBookmarked
              ? "bg-brand-coral text-white border-brand-coral shadow-xs"
              : "bg-stone-50 text-stone-400 border-stone-200 hover:text-brand-coral hover:bg-white"
          }`}
        >
          <HiBookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-brand-coral transition-colors mb-2.5 line-clamp-2 leading-snug">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-stone-600 text-sm leading-relaxed mb-6 line-clamp-3 grow">
        {item.description}
      </p>

      {/* Metadata Pill Line */}
      <div className="flex flex-wrap items-center gap-2 mb-5 text-xs text-stone-600 font-medium">
        <span className="px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 font-medium">
          {item.category}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200/80 text-stone-700 font-medium">
          {durationOrPages}
        </span>
        {renderStatusBadge()}
      </div>

      {/* Action CTA Button */}
      <div className="pt-2 mt-auto border-t border-stone-100">
        <button
          type="button"
          onClick={handleActionClick}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            isComingSoon
              ? "bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-amber-500/20"
              : isDownloaded
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
              : "bg-brand-coral text-white hover:bg-brand-coral/90 shadow-brand-coral/20 hover:shadow-md"
          }`}
        >
          {isComingSoon ? (
            <>
              <HiSparkles className="w-4 h-4 text-brand-yellow" />
              <span>Get Notified on Release</span>
            </>
          ) : isDownloaded ? (
            <>
              <HiCheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{actionLabel} (Downloaded)</span>
            </>
          ) : isPdfGuide ? (
            <>
              <HiArrowDownTray className="w-4 h-4" />
              <span>{actionLabel}</span>
            </>
          ) : (
            <>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
              <span>{actionLabel}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
