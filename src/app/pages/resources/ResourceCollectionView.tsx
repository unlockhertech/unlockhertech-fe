import {
  HiArrowLeft,
  HiSparkles,
  HiCheckCircle,
} from "react-icons/hi2";
import {
  RESOURCE_COLLECTIONS,
  TRANSITION_STAGES,
  type ExtendedResource,
  type TransitionStage,
} from "./resourceData";
import { UniversalResourceCard } from "./UniversalResourceCard";

interface ResourceCollectionViewProps {
  collectionId: string;
  activeStage: string;
  onStageChange: (stage: string) => void;
  onBackToHub: () => void;
  resources: ExtendedResource[];
  userEmail: string | null;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenAction: (item: ExtendedResource) => void;
  onOpenBundleModal: () => void;
}

export function ResourceCollectionView({
  collectionId,
  activeStage,
  onStageChange,
  onBackToHub,
  resources,
  userEmail,
  bookmarkedIds,
  onToggleBookmark,
  onOpenAction,
  onOpenBundleModal,
}: Readonly<ResourceCollectionViewProps>) {
  const collectionInfo =
    RESOURCE_COLLECTIONS.find((c) => c.id === collectionId) || {
      id: collectionId,
      label: "Resource Collection",
      shortLabel: "Collection",
      description: "Curated collection of technical and career resources.",
      badge: "Curated Series",
    };

  const isCareerToolkit = collectionId === "career-toolkit";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back button affordance */}
      <div>
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-coral hover:text-brand-coral/80 transition-colors cursor-pointer py-1"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to All Resources</span>
        </button>
      </div>

      {/* Collection Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white via-stone-50 to-pink-50/40 border border-stone-200/90 p-7 sm:p-9 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-coral/10 text-brand-coral border border-brand-coral/20 text-xs font-bold uppercase tracking-wider">
            <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>{collectionInfo.badge || "Featured Collection"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            {collectionInfo.label}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {collectionInfo.description}
          </p>

          {isCareerToolkit && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenBundleModal}
                className="px-5 py-2.5 rounded-xl bg-brand-coral text-white font-bold text-xs sm:text-sm hover:bg-brand-coral/90 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Unlock Complete 10-Guide Suite (PDF)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4-Stage Transition Roadmap Switcher (For Career Toolkit) */}
      {isCareerToolkit && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              4-Stage Transition Roadmap
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter guides by transition stage"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeStage === "all"}
              onClick={() => onStageChange("all")}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                activeStage === "all"
                  ? "bg-brand-coral text-white border-brand-coral shadow-md scale-[1.01]"
                  : "bg-white text-gray-900 border-stone-200 hover:border-brand-coral/40"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
                All Stages
              </div>
              <div className="font-bold text-sm">Complete 10-Part Series</div>
            </button>

            {TRANSITION_STAGES.map((stage: TransitionStage) => {
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onStageChange(stage.id)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-coral text-white border-brand-coral shadow-md scale-[1.01]"
                      : "bg-white text-gray-900 border-stone-200 hover:border-brand-coral/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Stage {stage.number}
                    </span>
                    {isActive && <HiCheckCircle className="w-4 h-4 text-brand-yellow" />}
                  </div>
                  <div className="font-bold text-sm mb-1">{stage.label}</div>
                  <div className="text-xs line-clamp-2 opacity-80">
                    {stage.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Collection Resource Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isCareerToolkit
              ? activeStage === "all"
                ? "All Guides in Series (10 Guides)"
                : `Guides in Stage ${
                    TRANSITION_STAGES.find((s) => s.id === activeStage)?.number ?? ""
                  }`
              : `Resources (${resources.length})`}
          </h2>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-600 mb-4">
              No resources found for this filter criteria in this collection.
            </p>
            <button
              type="button"
              onClick={() => onStageChange("all")}
              className="px-4 py-2 rounded-xl bg-brand-coral text-white font-bold text-sm cursor-pointer"
            >
              Reset Stage Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item, index) => (
              <UniversalResourceCard
                key={item.id}
                item={item}
                index={index}
                userEmail={userEmail}
                isBookmarked={bookmarkedIds.includes(item.id)}
                onToggleBookmark={onToggleBookmark}
                onOpenAction={onOpenAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
