import { HiTag, HiChevronDown } from "react-icons/hi2";
import { RESOURCE_TOPIC_GROUPS } from "./resourceData";

interface ResourceTopicDropdownProps {
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export function ResourceTopicDropdown({
  selectedTopic,
  onTopicChange,
}: Readonly<ResourceTopicDropdownProps>) {
  return (
    <div className="relative w-full lg:w-auto flex items-center">
      <label htmlFor="resource-topic-select" className="sr-only">
        Filter resources by topic domain
      </label>
      <div className="relative flex items-center w-full min-w-full sm:min-w-[320px] md:min-w-[360px] lg:min-w-[380px] xl:min-w-[420px]">
        <div className="absolute left-3.5 pointer-events-none text-brand-coral flex items-center">
          <HiTag className="w-4 h-4" />
        </div>
        <select
          id="resource-topic-select"
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full appearance-none pl-9.5 pr-10 py-2.5 bg-white text-gray-900 text-xs sm:text-sm font-semibold rounded-full border border-stone-200/90 shadow-2xs hover:border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 focus:border-brand-coral transition-colors cursor-pointer"
        >
          <option value="All">All Topics & Domains</option>
          {RESOURCE_TOPIC_GROUPS.map((group) => (
            <optgroup key={group.clusterId} label={group.clusterLabel}>
              <option value={group.clusterLabel}>
                ⭐ All {group.clusterLabel}
              </option>
              {group.topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-gray-400 flex items-center">
          <HiChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
