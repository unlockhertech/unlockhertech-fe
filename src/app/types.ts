import type { ElementType } from "react";

export interface Episode {
  id: number;
  title: string;
  description: string;
  audioUrl: string; // MP3 / audio file URL
  duration: string; // e.g. "45 min"
  date: string;
  episodeNumber: number;
  coverColor: string;
  imageUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  photoUrl: string;
}

export interface Platform {
  name: string;
  icon: ElementType;
  url: string;
}

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  tags: string[];
  canonicalUrl: string;
  slug: string;
  content?: string;
  readingTime?: string;
  imageUrl?: string;
}
