import { RESOURCE_COLLECTIONS } from "./resourceData";

interface ResourceTrackSwitcherProps {
  activeCollection: string;
  onSelectCollection: (collectionId: string) => void;
  resourceCounts?: Record<string, number>;
}

export function ResourceTrackSwitcher({
  activeCollection,
  onSelectCollection,
  resourceCounts,
}: Readonly<ResourceTrackSwitcherProps>) {
  return (
    <section aria-label="Resource Tracks & Collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {RESOURCE_COLLECTIONS.map((track) => {
          const isActive = activeCollection === track.id;
          const count = resourceCounts?.[track.id];

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectCollection(track.id)}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 snap-start inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
                isActive
                  ? "bg-brand-coral text-white border-brand-coral shadow-sm shadow-brand-coral/20"
                  : "bg-white text-stone-700 border-stone-200/90 hover:bg-stone-50 hover:border-stone-300"
              }`}
            >
              <span>{track.label}</span>
              {track.badge && (
                <span
                  className={`text-[0.65rem] font-black uppercase px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-brand-coral/10 text-brand-coral"
                  }`}
                >
                  {track.badge}
                </span>
              )}
              {typeof count === "number" && (
                <span
                  className={`text-[0.65rem] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/30 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
