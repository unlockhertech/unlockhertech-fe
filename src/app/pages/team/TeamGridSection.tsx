import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiSquares2X2 } from "react-icons/hi2";
import { TeamMember } from "../../components/TeamMember";
import { teamMembers } from "../../data";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import {
  TEAM_DEPARTMENTS,
  getMembersByDepartment,
  type DepartmentInfo,
} from "./teamUtils";
import type { TeamDepartmentId } from "../../types";

type FilterTab = "all" | TeamDepartmentId;

function getTabButtonClasses(isActive: boolean): string {
  if (isActive) {
    return "bg-brand-coral text-white shadow-xs font-bold border-brand-coral";
  }
  return "bg-white text-gray-700 hover:text-gray-900 hover:bg-stone-100 border-gray-200 font-semibold";
}

function getBadgeBgStyle(color: string): React.CSSProperties {
  return {
    backgroundColor: `${color}18`,
    color: color,
    borderColor: `${color}35`,
  };
}

export function TeamGridSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});

  const toggleSection = (deptId: string) => {
    setCollapsedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const areAllCollapsed = TEAM_DEPARTMENTS.every((d) => collapsedDepts[d.id]);

  const toggleAll = () => {
    if (areAllCollapsed) {
      setCollapsedDepts({});
    } else {
      const allCollapsed: Record<string, boolean> = {};
      TEAM_DEPARTMENTS.forEach((d) => {
        allCollapsed[d.id] = true;
      });
      setCollapsedDepts(allCollapsed);
    }
  };

  const visibleDepartments: DepartmentInfo[] =
    activeTab === "all"
      ? TEAM_DEPARTMENTS
      : TEAM_DEPARTMENTS.filter((d) => d.id === activeTab);

  return (
    <section className="py-16 sm:py-20 bg-stone-50 relative overflow-hidden" id="team-directory">
      <BrandPatternOverlay variant="watermark" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Filter Tabs & Global Collapse Controls ────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-gray-200/80">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar" role="tablist" aria-label="Team departments">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm border transition-all shrink-0 cursor-pointer ${getTabButtonClasses(activeTab === "all")}`}
            >
              <HiSquares2X2 className="w-4 h-4" />
              <span>All Team</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/10">
                {teamMembers.length}
              </span>
            </button>

            {TEAM_DEPARTMENTS.map((dept) => {
              const count = getMembersByDepartment(dept.id).length;
              const isActive = activeTab === dept.id;
              return (
                <button
                  key={`tab-${dept.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(dept.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm border transition-all shrink-0 cursor-pointer ${getTabButtonClasses(isActive)}`}
                >
                  <span>{dept.shortTitle}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/10">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse All Toggle (only when viewing All) */}
          {activeTab === "all" && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={toggleAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-gray-200 text-xs font-bold text-gray-700 hover:text-gray-900 transition-all shadow-2xs cursor-pointer"
              >
                {areAllCollapsed ? (
                  <>
                    <HiChevronDown className="w-4 h-4 text-brand-coral" />
                    <span>Expand All Sections</span>
                  </>
                ) : (
                  <>
                    <HiChevronUp className="w-4 h-4 text-brand-coral" />
                    <span>Collapse All Sections</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Department Sections ───────────────────────────────────── */}
        <div className="space-y-16">
          {visibleDepartments.map((dept) => {
            const members = getMembersByDepartment(dept.id);
            const isCollapsed = Boolean(collapsedDepts[dept.id]);
            const sectionContentId = `dept-content-${dept.id}`;

            return (
              <div
                key={`dept-section-${dept.id}`}
                className="bg-white/80 rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs transition-all"
              >
                {/* Department Section Header / Collapse Trigger */}
                <div className="flex items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <span
                        className="text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border"
                        style={getBadgeBgStyle(dept.accentColor)}
                      >
                        {dept.tagline}
                      </span>
                      <span className="text-xs font-bold text-gray-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                        {members.length} {members.length === 1 ? "member" : "members"}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {dept.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                      {dept.description}
                    </p>
                  </div>

                  {/* Individual Collapse / Expand Button */}
                  <button
                    type="button"
                    onClick={() => toggleSection(dept.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={sectionContentId}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-all shrink-0 cursor-pointer shadow-2xs"
                    aria-label={isCollapsed ? `Expand ${dept.title}` : `Collapse ${dept.title}`}
                  >
                    {isCollapsed ? (
                      <HiChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <HiChevronUp className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Team Members Grid */}
                {!isCollapsed && (
                  <div
                    id={sectionContentId}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6"
                  >
                    {members.map((member) => (
                      <TeamMember
                        key={`member-${member.name}`}
                        {...member}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
