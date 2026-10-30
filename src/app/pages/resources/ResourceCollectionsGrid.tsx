import {
  HiFolder,
  HiArrowRight,
  HiSparkles,
} from "react-icons/hi2";
import { RESOURCE_COLLECTIONS, type ResourceCollection } from "./resourceData";

interface ResourceCollectionsGridProps {
  onSelectCollection: (collectionId: string) => void;
}

export function ResourceCollectionsGrid({
  onSelectCollection,
}: Readonly<ResourceCollectionsGridProps>) {
  // Exclude "all" from the curated grid
  const collections = RESOURCE_COLLECTIONS.filter((col) => col.id !== "all");

  return (
    <section aria-labelledby="curated-collections-heading" className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-coral mb-1">
            <HiFolder className="w-4 h-4 text-brand-coral" />
            <span>Curated Pathways</span>
          </div>
          <h2
            id="curated-collections-heading"
            className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight"
          >
            Explore Resource Collections
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection: ResourceCollection) => {
          const accent = collection.accentColor || "#b42970";
          return (
            <div
              key={collection.id}
              className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 hover:border-brand-coral/40 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                style={{ backgroundColor: accent }}
              />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  {collection.badge ? (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: `${accent}15`,
                        color: accent === "#ffa1b5" ? "#b42970" : accent,
                        borderColor: `${accent}35`,
                      }}
                    >
                      <HiSparkles className="w-3 h-3 text-brand-yellow" />
                      <span>{collection.badge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-50 border border-stone-200 text-stone-700">
                      Curated Collection
                    </span>
                  )}

                  {collection.itemCount && (
                    <span className="text-xs font-bold text-stone-500">
                      {collection.itemCount} items
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-brand-coral transition-colors mb-2 leading-snug">
                  {collection.label}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {collection.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onSelectCollection(collection.id)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-brand-coral bg-brand-coral/10 hover:bg-brand-coral hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 group/btn"
                >
                  <span>View Collection</span>
                  <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
