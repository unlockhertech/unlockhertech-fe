import type { ComponentType } from "react";
import {
  HiOutlineCodeBracket,
  HiOutlineMicrophone,
  HiOutlineHeart,
  HiOutlineLightBulb,
} from "react-icons/hi2";

export interface AboutValue {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  badge: string;
  color: string;
  iconBg: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    icon: HiOutlineCodeBracket,
    title: "Technical Depth & Growth",
    desc: "We are a hands-on community built by engineers. We run live LeetCode practices, technical workshops, and real-world algorithm deconstructions.",
    badge: "Engineering Focus",
    color: "bg-blue-50 text-brand-blue border-blue-200",
    iconBg: "bg-brand-blue text-white",
  },
  {
    icon: HiOutlineMicrophone,
    title: "Authentic Storytelling",
    desc: "Every episode is an unfiltered conversation — no scripts or corporate jargon, just honest journeys from women, non-binary people, and allies.",
    badge: "Raw Conversations",
    color: "bg-pink-50 text-brand-coral border-pink-200",
    iconBg: "bg-brand-coral text-white",
  },
  {
    icon: HiOutlineHeart,
    title: "Radical Inclusion & Safety",
    desc: "A psychologically safe space where curious questions are celebrated, live coding is collaborative, and every background belongs.",
    badge: "Inclusive by Design",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    iconBg: "bg-brand-yellow text-neutral-900",
  },
  {
    icon: HiOutlineLightBulb,
    title: "Actionable Insights",
    desc: "We deliver practical value you can use immediately — from algorithmic pattern frameworks to interview strategies and career growth.",
    badge: "Tangible Value",
    color: "bg-emerald-50 text-brand-green border-emerald-200",
    iconBg: "bg-brand-green text-white",
  },
];
