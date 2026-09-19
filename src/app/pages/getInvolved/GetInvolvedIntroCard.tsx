import {
  HiBriefcase,
  HiUserGroup,
  HiMicrophone,
  HiBuildingOffice2,
  HiCurrencyDollar,
  HiShieldCheck,
  HiChatBubbleLeftRight,
  HiMegaphone,
  HiCodeBracket,
} from "react-icons/hi2";
import type { InvolvementType } from "./getInvolvedTypes";

interface GetInvolvedIntroCardProps {
  activeTab: InvolvementType;
}

export function GetInvolvedIntroCard({ activeTab }: Readonly<GetInvolvedIntroCardProps>) {
  if (activeTab === "job") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-coral flex items-center justify-center">
            <HiBriefcase className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Submit a Transparent Tech Role</h2>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Feature your open technical or product role to thousands of qualified female engineers, designers, and supportive allies. Every role featured on Unlock Her Tech must meet our non-negotiable standards: explicit compensation transparency, remote/workplace model clarity, and an inclusive culture.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <HiCurrencyDollar className="w-3.5 h-3.5 text-emerald-600" />
            100% Salary Transparent
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100">Remote & Flexible Friendly</span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 flex items-center gap-1">
            <HiShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
            Vetted Inclusivity Standards
          </span>
        </div>
      </div>
    );
  }

  if (activeTab === "mentor") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <HiUserGroup className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Mentor & Practice Leaders</h2>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Share your engineering expertise with women and non-binary developers. We welcome mentors who want to co-host LeetCode problem-solving sessions, provide resume feedback, or conduct mock technical discussions.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-stone-100">LeetCode Sessions</span>
          <span className="px-3 py-1 rounded-full bg-stone-100">1-on-1 Mentorship</span>
          <span className="px-3 py-1 rounded-full bg-stone-100">Technical Workshops</span>
        </div>
      </div>
    );
  }

  if (activeTab === "guest") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-coral flex items-center justify-center">
            <HiMicrophone className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Request to Be a Podcast Guest or Speaker</h2>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Have a compelling tech journey, leadership insight, or lessons from navigating the industry? We love platforming authentic voices and honest stories that inspire action and change.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
            <HiMicrophone className="w-3.5 h-3.5 text-brand-coral" />
            <span>Featured Podcast Episode</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
            <HiChatBubbleLeftRight className="w-3.5 h-3.5 text-brand-blue" />
            <span>Virtual Coffee Chat Guest</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
            <HiMegaphone className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Live Panel Speaker</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green flex items-center justify-center">
          <HiBuildingOffice2 className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Partner & Sponsor Opportunities</h2>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        Collaborate with Unlock Her Tech to champion diversity in technology, sponsor workshops and practice series, or connect your team with our growing talent network.
      </p>
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
        <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
          <HiUserGroup className="w-3.5 h-3.5 text-brand-coral" />
          <span>Practice Series Sponsorship</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
          <HiMegaphone className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Episode Sponsorship</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-stone-100 flex items-center gap-1.5">
          <HiCodeBracket className="w-3.5 h-3.5 text-brand-blue" />
          <span>Co-hosted Technical Events</span>
        </span>
      </div>
    </div>
  );
}
