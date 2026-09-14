import type { TransitionStage, ExtendedResource } from "./resourceData";
import { ResourceCard } from "./ResourceCard";

interface ResourceStageSectionProps {
  stage: TransitionStage;
  items: ExtendedResource[];
  userEmail: string | null;
  onOpenDownload: (item: ExtendedResource, bundleMode?: boolean) => void;
}

export function ResourceStageSection({
  stage,
  items,
  userEmail,
  onOpenDownload,
}: Readonly<ResourceStageSectionProps>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div id={stage.id} className="mb-14 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{ backgroundColor: stage.accentColor }}
        >
          {stage.number}
        </span>
        <div>
          <h3 className="text-xl font-extrabold text-stone-900">
            Stage {stage.number}: {stage.label}
          </h3>
          <p className="text-stone-500 text-sm mt-0.5">{stage.description}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <ResourceCard
            key={item.id}
            item={item}
            index={index}
            userEmail={userEmail}
            onOpenDownload={onOpenDownload}
          />
        ))}
      </div>
    </div>
  );
}
