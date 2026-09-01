import { TeamMember } from "../../components/TeamMember";
import { teamMembers } from "../../data";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { cycleColor } from "./teamUtils";

export function TeamGridSection() {
  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Co-founders label */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1 text-brand-coral font-bold">Co-Founders</p>
          <div className="h-0.5 w-12 rounded-full bg-brand-coral" />
        </div>

        {/* Founders row (first 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl gap-6 mb-14">
          {teamMembers.slice(0, 2).map((m, i) => (
            <TeamMember key={`founder-${m.name}`} {...m} avatarColor={cycleColor(i)} />
          ))}
        </div>

        {/* Team label */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1 text-brand-blue font-bold">The Team</p>
          <div className="h-0.5 w-12 rounded-full bg-brand-blue" />
        </div>

        {/* Remaining team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.slice(2).map((m, i) => (
            <TeamMember key={`team-${m.name}`} {...m} avatarColor={cycleColor(i + 2)} />
          ))}
        </div>
      </div>
    </section>
  );
}
