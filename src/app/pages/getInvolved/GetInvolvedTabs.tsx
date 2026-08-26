import {
  HiBriefcase,
  HiUserGroup,
  HiMicrophone,
  HiBuildingOffice2,
} from "react-icons/hi2";
import type { InvolvementType } from "./getInvolvedTypes";

interface GetInvolvedTabsProps {
  activeTab: InvolvementType;
  onTabClick: (tab: InvolvementType) => void;
}

export function GetInvolvedTabs({ activeTab, onTabClick }: GetInvolvedTabsProps) {
  const tabs = [
    { id: "job" as const, label: "Submit a Role", icon: HiBriefcase },
    { id: "mentor" as const, label: "Become a Mentor", icon: HiUserGroup },
    { id: "guest" as const, label: "Podcast Speaker", icon: HiMicrophone },
    { id: "partner" as const, label: "Partner / Sponsor", icon: HiBuildingOffice2 },
  ];

  return (
    <div className="bg-white rounded-3xl p-2.5 shadow-md border border-gray-200/80 grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabClick(id)}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isActive
                ? "bg-brand-coral text-white shadow-sm"
                : "text-gray-600 hover:bg-stone-100"
            }`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
