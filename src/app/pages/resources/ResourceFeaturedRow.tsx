import {
  HiSparkles,
  HiRocketLaunch,
  HiArrowRight,
  HiAcademicCap,
  HiCheckBadge,
} from "react-icons/hi2";
import type { ExtendedResource } from "./resourceData";

interface ResourceFeaturedRowProps {
  onOpenBundleModal: () => void;
  onSelectCollection: (collectionId: string) => void;
  onOpenAction: (item: ExtendedResource) => void;
}

export function ResourceFeaturedRow({
  onOpenBundleModal,
  onSelectCollection,
  onOpenAction,
}: Readonly<ResourceFeaturedRowProps>) {
  return (
    <section aria-labelledby="featured-spotlight-heading" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-coral mb-1">
            <HiSparkles className="w-4 h-4 text-brand-yellow" />
            <span>Featured Spotlights</span>
          </div>
          <h2
            id="featured-spotlight-heading"
            className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight"
          >
            Curated High-Impact Playbooks
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spotlight Card 1: 10-Guide Career Transition Suite Bundle */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-coral via-[#961c5a] to-[#701040] p-7 sm:p-9 text-white shadow-xl flex flex-col justify-between">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-brand-yellow text-xs font-bold uppercase tracking-wider mb-4">
              <HiCheckBadge className="w-4 h-4 text-brand-yellow" />
              <span>All-In-One Roadmap Suite</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
              Unlock the Complete 10-Guide Transition Suite
            </h3>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
              Get instant access to all 10 transition guides—from non-tech mindset shifts and terminology cheat sheets to ATS resume templates and interview scripts.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenBundleModal}
                className="px-5 py-3 rounded-xl bg-brand-yellow text-gray-950 font-bold text-sm hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span>Unlock 10-Pack (PDF)</span>
                <HiArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectCollection("career-toolkit")}
                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-xs transition-colors cursor-pointer"
              >
                Explore Roadmap Stages
              </button>
            </div>
          </div>
        </div>

        {/* Spotlight Card 2: Interactive Career Readiness Assessment */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 hover:border-brand-coral/40 p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral border border-pink-200 text-xs font-bold uppercase tracking-wider mb-4">
              <HiAcademicCap className="w-4 h-4" />
              <span>Interactive Assessment</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-brand-coral transition-colors mb-3 leading-snug">
              Career Readiness Scorecard & Custom PDF Plan
            </h3>

            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Evaluate your readiness across Mindset, Transferable Skills, Technical Foundations, and Networking to receive an instant personalized 2-page PDF Action Plan.
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                onOpenAction({
                  id: "tool-assessment-1",
                  title: "Interactive Career Readiness Assessment",
                  slug: "career-readiness-assessment-tool",
                  description: "Career readiness scorecard",
                  category: "Action Plan",
                  type: "tool",
                  actionUrl: "/assessment",
                  isPublished: true,
                });
              }}
              className="w-full py-3 px-4 rounded-xl bg-brand-coral text-white hover:bg-[#961c5a] shadow-md shadow-brand-coral/20 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HiRocketLaunch className="w-4 h-4 text-brand-yellow" />
              <span>Start Free Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
