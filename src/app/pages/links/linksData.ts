import type { ComponentType } from "react";
import {
  FaInstagram,
  FaSpotify,
  FaApple,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import {
  HiCodeBracket,
  HiMicrophone,
  HiDocumentText,
  HiAcademicCap,
  HiUserGroup,
  HiCalendarDays,
  HiBriefcase,
} from "react-icons/hi2";

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  isExternal: boolean;
  isFeatured?: boolean;
  badge?: string;
  icon?: ComponentType<{ className?: string }>;
  accentColor?: string;
  category?: "community" | "learning" | "career" | "podcast";
  enabled: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  color?: string;
}

export function getLinkItems(): LinkItem[] {
  const enableBlog = import.meta.env.VITE_ENABLE_BLOG === "true";
  const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === "true";
  const enableResources = import.meta.env.VITE_ENABLE_RESOURCES === "true";
  const enableAssessment = import.meta.env.VITE_ENABLE_ASSESSMENT === "true";
  const enableGetInvolved = import.meta.env.VITE_ENABLE_GET_INVOLVED === "true";
  const enableJobs = import.meta.env.VITE_ENABLE_JOBS !== "false";

  return [
    {
      id: "practices",
      title: "She Leads Tech",
      subtitle: "Fortnightly technical workshops — Theory, Practice & Review",
      url: "/practices",
      isExternal: false,
      isFeatured: true,
      badge: "Live Workshops",
      icon: HiCodeBracket,
      enabled: true,
    },
    {
      id: "podcast",
      title: "Listen to the Podcast",
      subtitle: "Available on Spotify, Apple Podcasts & YouTube",
      url: "https://pod.link/1800087284",
      isExternal: true,
      badge: "New Episodes",
      icon: HiMicrophone,
      enabled: true,
    },
    {
      id: "jobs",
      title: "Inclusive Tech Job Board",
      subtitle: "Vetted roles with mandatory salary transparency & flexibility",
      url: "/jobs",
      isExternal: false,
      badge: "Vetted Roles",
      icon: HiBriefcase,
      enabled: enableJobs,
    },
    {
      id: "assessment",
      title: "Tech Career Readiness Assessment",
      subtitle: "Interactive 16-question transition worksheet",
      url: "/assessment",
      isExternal: false,
      badge: "Free Quiz",
      icon: HiAcademicCap,
      enabled: enableAssessment,
    },
    {
      id: "resources",
      title: "Download Free Career Guides",
      subtitle: "PDF playbooks for non-tech to tech switchers",
      url: "/resources",
      isExternal: false,
      badge: "Free PDF",
      icon: HiDocumentText,
      enabled: enableResources,
    },
    {
      id: "blog",
      title: "Read The Blog",
      subtitle: "Interviews, tech deep-dives & career journeys",
      url: "/blog",
      isExternal: false,
      icon: HiDocumentText,
      enabled: enableBlog,
    },
    {
      id: "linkedin",
      title: "Follow On LinkedIn",
      subtitle: "Join our professional community updates",
      url: "https://www.linkedin.com/company/unlockhertech/",
      isExternal: true,
      icon: FaLinkedinIn,
      enabled: true,
    },
    {
      id: "get-involved",
      title: "Become a Mentor or Podcast Guest",
      subtitle: "Share your expertise & help empower others",
      url: "/get-involved",
      isExternal: false,
      icon: HiUserGroup,
      enabled: enableGetInvolved,
    },
    {
      id: "events",
      title: "Upcoming Community Events",
      subtitle: "Live sessions, panels & networking",
      url: "/events",
      isExternal: false,
      icon: HiCalendarDays,
      enabled: enableEvents,
    },
  ];
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/unlockhertech/",
    icon: FaInstagram,
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/show/5I2RiIZwjv8YbuwhlHTAPc",
    icon: FaSpotify,
  },
  {
    name: "Apple Podcasts",
    url: "https://podcasts.apple.com/us/podcast/unlock-her-tech/id1800087284",
    icon: FaApple,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UChhVCKvYVmZovXQmpxdafpg",
    icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/unlockhertech/",
    icon: FaLinkedinIn,
  },
];
