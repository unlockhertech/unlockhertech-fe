import type { ComponentType } from "react";
import {
  HiHeart,
  HiCodeBracket,
  HiHandRaised,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { BERRY, BLUE, GREEN, ORANGE } from "../../data";

export interface GuidelinePillar {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  accent: string;
  bg: string;
}

export const GUIDELINE_PILLARS: GuidelinePillar[] = [
  {
    icon: HiHeart,
    title: "Radical Inclusion & Empathy",
    desc: "We welcome everyone regardless of background, identity, career stage, or technical depth. We meet each person where they are.",
    accent: BERRY,
    bg: "#fdf0f7",
  },
  {
    icon: HiCodeBracket,
    title: "Collaborative & Constructive",
    desc: "In our LeetCode practices and workshops, there is no such thing as a basic question. We solve together, learn from mistakes, and cheer each other on.",
    accent: BLUE,
    bg: "#f0f6fd",
  },
  {
    icon: HiHandRaised,
    title: "Active & Humble Allyship",
    desc: "Allies actively support, uplift underrepresented voices, step up to support community goals, and step back to let others lead.",
    accent: GREEN,
    bg: "#f2fbf3",
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "Psychological Safety",
    desc: "We respect boundaries, pronouns, and varied communication styles. We foster spaces where people feel safe to take risks and speak up.",
    accent: ORANGE,
    bg: "#fff3f0",
  },
];
