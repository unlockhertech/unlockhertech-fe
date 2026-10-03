import { HiSparkles } from "react-icons/hi2";
import { ResourceCard } from "./ResourceCard";
import type { ExtendedResource } from "./resourceData";

interface ResourceUpcomingSpotlightProps {
  items: ExtendedResource[];
  userEmail: string | null;
  onOpenDownload: (item: ExtendedResource, bundleMode?: boolean) => void;
}

export function ResourceUpcomingSpotlight({
  items,
  userEmail,
  onOpenDownload,
}: Readonly<ResourceUpcomingSpotlightProps>) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="upcoming-resources-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-stone-800 relative overflow-hidden">
        {/* Glow Flourish */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-3">
              <HiSparkles className="w-4 h-4" />
              <span>In The Production Pipeline</span>
            </div>
            <h2 id="upcoming-resources-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Next PDF Drops & New Collections
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              We are expanding beyond the Career Transition Toolkit with new technical playbooks, salary negotiation scriptbooks, and engineering leadership frameworks.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <ResourceCard
              key={item.id}
              item={item}
              index={idx}
              userEmail={userEmail}
              onOpenDownload={onOpenDownload}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
