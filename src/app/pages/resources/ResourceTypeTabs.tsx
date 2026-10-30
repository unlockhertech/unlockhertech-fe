import {
  HiSparkles,
  HiDocumentText,
  HiClipboardDocumentList,
  HiWrenchScrewdriver,
  HiPlayCircle,
  HiBookOpen,
} from "react-icons/hi2";
import { RESOURCE_TYPE_TABS } from "./resourceData";

interface ResourceTypeTabsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
  typeCounts: Record<string, number>;
}

function renderTabIcon(typeId: string, className = "w-4 h-4") {
  switch (typeId) {
    case "guide":
      return <HiDocumentText className={className} aria-hidden="true" />;
    case "template":
      return <HiClipboardDocumentList className={className} aria-hidden="true" />;
    case "tool":
      return <HiWrenchScrewdriver className={className} aria-hidden="true" />;
    case "video":
      return <HiPlayCircle className={className} aria-hidden="true" />;
    case "article":
      return <HiBookOpen className={className} aria-hidden="true" />;
    case "all":
    default:
      return <HiSparkles className={className} aria-hidden="true" />;
  }
}

export function ResourceTypeTabs({
  activeType,
  onTypeChange,
  typeCounts,
}: Readonly<ResourceTypeTabsProps>) {
  return (
    <div
      role="tablist"
      aria-label="Filter resources by format"
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
    >
      {RESOURCE_TYPE_TABS.map((tab) => {
        const count = typeCounts[tab.id] ?? 0;
        const isActive = activeType === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onTypeChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs ${
              isActive
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/25 scale-[1.02]"
                : "bg-white text-gray-700 hover:bg-stone-100 border border-stone-200/80 hover:border-stone-300"
            }`}
          >
            {renderTabIcon(
              tab.id,
              `w-4 h-4 ${
                isActive ? "text-brand-yellow" : "text-gray-400 group-hover:text-brand-coral"
              }`
            )}
            <span>{tab.label}</span>
            <span
              className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-stone-100 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
