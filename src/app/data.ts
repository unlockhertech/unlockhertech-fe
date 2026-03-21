import { SiApplepodcasts, SiSpotify, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa6";
import type { ElementType } from "react";

// ── Images ─────────────────────────────────────────────────────────────────────
export const IMG_HERO        = "https://images.unsplash.com/photo-1617745546548-9324da9e2b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
export const IMG_STUDIO_MIC  = "https://images.unsplash.com/photo-1769509068789-f242b5a6fc47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const IMG_DESK_SETUP  = "https://images.unsplash.com/photo-1632454005805-7bee57f76ee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const IMG_AUDIO_EQ    = "https://images.unsplash.com/photo-1595598237436-bf64a3bf18cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const IMG_DIVERSE     = "https://images.unsplash.com/photo-1573497701175-00c200fd57f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
export const IMG_PODCAST_FUN = "https://images.unsplash.com/photo-1554200876-980213841c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

// ── Platforms ──────────────────────────────────────────────────────────────────
export const platforms: { name: string; icon: ElementType; url: string }[] = [
  { name: "Apple Podcasts", icon: SiApplepodcasts, url: 'https://podcasts.apple.com/us/podcast/unlock-her-tech/id1800087284'},
  { name: "Spotify",        icon: SiSpotify,        url: 'https://open.spotify.com/show/5I2RiIZwjv8YbuwhlHTAPc'},
  { name: "YouTube",        icon: SiYoutube,        url: 'https://www.youtube.com/channel/UChhVCKvYVmZovXQmpxdafpg'},
  { name: "Amazon Music",   icon: FaAmazon,         url: 'https://music.amazon.com/podcasts/69812754-839d-4b8b-a878-058014c1946d/unlock-her-tech-podcast'},
];

// ── Episode type ───────────────────────────────────────────────────────────────
export interface Episode {
  id:            number;
  title:         string;
  description:   string;
  audioUrl:      string;   // MP3 / audio file URL
  duration:      string;   // e.g. "45 min"
  date:          string;
  episodeNumber: number;
  coverColor:    string;
  imageUrl?:     string;
}

// ── Demo audio URLs (SoundHelix royalty-free samples) ─────────────────────────
// Replace these with your real episode MP3 URLs from your podcast host, or let
// the RSS feed (see useRssFeed.ts) populate them automatically.
const DEMO_AUDIO = (n: number) =>
  `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

// ── Episodes ───────────────────────────────────────────────────────────────────
export const episodes: Episode[] = [
  { id: 1,  title: "The Future of Innovation",         description: "Exploring groundbreaking ideas and the minds behind them. Join us as we dive deep into what's next.",               audioUrl: DEMO_AUDIO(1),  duration: "45 min", date: "Mar 8, 2026",  episodeNumber: 12, coverColor: "#B42970",  imageUrl: IMG_PODCAST_FUN },
  { id: 2,  title: "Building Sustainable Communities", description: "Creating lasting impact in local and global communities through innovative approaches and collective action.",        audioUrl: DEMO_AUDIO(2),  duration: "38 min", date: "Mar 1, 2026",  episodeNumber: 11, coverColor: "#72c472",  imageUrl: IMG_DIVERSE    },
  { id: 3,  title: "Technology Meets Humanity",        description: "The intersection of technology and human experience, and how we can build better futures together.",                  audioUrl: DEMO_AUDIO(3),  duration: "52 min", date: "Feb 22, 2026", episodeNumber: 10, coverColor: "#5f9de3",   imageUrl: IMG_STUDIO_MIC },
  { id: 4,  title: "Creative Collaboration",           description: "How diverse teams create extraordinary outcomes. Stories from the frontlines of innovation.",                         audioUrl: DEMO_AUDIO(4),  duration: "41 min", date: "Feb 15, 2026", episodeNumber: 9,  coverColor: "#e8563a", imageUrl: IMG_AUDIO_EQ   },
  { id: 5,  title: "Reimagining Education",            description: "The future of learning and how we're preparing the next generation for challenges we can't yet imagine.",             audioUrl: DEMO_AUDIO(5),  duration: "47 min", date: "Feb 8, 2026",  episodeNumber: 8,  coverColor: "#f4a0b4",   imageUrl: IMG_DESK_SETUP },
  { id: 6,  title: "Climate Action Stories",           description: "Real people making real change in the fight against climate change — and the tech tools driving it.",                audioUrl: DEMO_AUDIO(6),  duration: "44 min", date: "Feb 1, 2026",  episodeNumber: 7,  coverColor: "#72c472",  imageUrl: IMG_STUDIO_MIC },
  { id: 7,  title: "Women Who Code the World",         description: "Celebrating the engineers, developers, and architects shaping the software that runs our everyday lives.",           audioUrl: DEMO_AUDIO(7),  duration: "50 min", date: "Jan 25, 2026", episodeNumber: 6,  coverColor: "#B42970",  imageUrl: IMG_DIVERSE    },
  { id: 8,  title: "Designing for Inclusion",          description: "Why accessible design is good design — and how building for everyone unlocks better products for all.",               audioUrl: DEMO_AUDIO(8),  duration: "36 min", date: "Jan 18, 2026", episodeNumber: 5,  coverColor: "#5f9de3",   imageUrl: IMG_AUDIO_EQ   },
  { id: 9,  title: "The Startup Journey",              description: "From idea to launch: the raw, unfiltered stories of women who took the leap and built something from nothing.",      audioUrl: DEMO_AUDIO(9),  duration: "55 min", date: "Jan 11, 2026", episodeNumber: 4,  coverColor: "#e8563a", imageUrl: IMG_PODCAST_FUN },
  { id: 10, title: "AI & the Human Touch",             description: "Navigating artificial intelligence with empathy, ethics, and a distinctly human perspective.",                       audioUrl: DEMO_AUDIO(10), duration: "48 min", date: "Jan 4, 2026",  episodeNumber: 3,  coverColor: "#f4a0b4",   imageUrl: IMG_DESK_SETUP },
  { id: 11, title: "Leading Without a Playbook",       description: "Women in leadership share what it really takes to lead teams, set culture, and make hard calls in uncertain times.", audioUrl: DEMO_AUDIO(11), duration: "43 min", date: "Dec 28, 2025", episodeNumber: 2,  coverColor: "#72c472",  imageUrl: IMG_STUDIO_MIC },
  { id: 12, title: "Why She Started",                  description: "Our very first episode — the origin story of Unlock Her Tech and the 'why' behind every conversation we have.",     audioUrl: DEMO_AUDIO(12), duration: "32 min", date: "Dec 21, 2025", episodeNumber: 1,  coverColor: "#B42970",  imageUrl: IMG_DIVERSE    },
];

// ── Team ───────────────────────────────────────────────────────────────────────
export const teamMembers = [
  { name: "Pritanya Fritz",       role: "Co-Founder & Co-Host",                    bio: "Pritanya/Pritty is a passionate storyteller who co-created Unlock Her Tech to shine a light on the brilliant women shaping the future of tech. She brings and infectious energy, drawing out the authentic voices of founders, engineers, and innovators from all walks of life.",    avatarColor: "#B42970",  photoUrl: "https://ui-avatars.com/api/?name=Pritanya+Fritz&background=B42970&color=fff&size=400&bold=true&rounded=true" },
  { name: "Elaheh Tahmasebi",     role: "Co-Founder & Co-Host",                    bio: "Elaheh/Ellie is a visionary co-founder who channels her deep passion for inclusion and equity into every conversation. She asks the questions that matter most — helping guests unpack the real experiences of women navigating the tech landscape.",          avatarColor: "#5f9de3",   photoUrl: "https://ui-avatars.com/api/?name=Elaheh+Tahmasebi&background=5f9de3&color=fff&size=400&bold=true&rounded=true" },
  { name: "Jen Carswell",         role: "Co-Host",                                  bio: "Jen is a curious, empathetic co-host who brings warmth and wit to the mic. She has a gift for making guests feel at ease and drawing out the stories behind the stories — the pivots, the failures, the small wins that add up to something extraordinary.",   avatarColor: "#72c472",  photoUrl: "https://ui-avatars.com/api/?name=Jen+Carswell&background=72c472&color=fff&size=400&bold=true&rounded=true" },
  { name: "Rupi Sagoo",           role: "Researcher",                               bio: "Rupi is the intellectual backbone of Unlock Her Tech. She dives deep into industry trends, and timely themes to ensure every episode is rich, informed, and relevant. Her thorough prep means no conversation ever scratches the surface.",                   avatarColor: "#e8563a", photoUrl: "https://ui-avatars.com/api/?name=Rupi+Sagoo&background=e8563a&color=fff&size=400&bold=true&rounded=true" },
  { name: "Sabrina Scollan",      role: "Researcher",                               bio: "Sabrina fuels the show's substance with sharp, detail-oriented research. She uncovers the data, the nuance, and the untold angles that give each episode its depth — making sure Unlock Her Tech always has something meaningful to say and a solid foundation to say it from.",  avatarColor: "#f4a0b4",   photoUrl: "https://ui-avatars.com/api/?name=Sabrina+Scollan&background=f4a0b4&color=fff&size=400&bold=true&rounded=true" },
  { name: "Tim Price",            role: "Podcast Editor",                           bio: "Tim is the audio craftsman who transforms raw recordings into polished, professional episodes. With a keen ear for pacing, clarity, and storytelling flow, he ensures every listen feels seamless — from the first word to the final sign-off.",             avatarColor: "#B42970",  photoUrl: "https://ui-avatars.com/api/?name=Tim+Price&background=B42970&color=fff&size=400&bold=true&rounded=true" },
  { name: "Shelly Chambers",      role: "Podcast Product & Audience Growth Manager", bio: "Shelly sits at the intersection of strategy and growth, steering Unlock Her Tech toward the listeners who need it most. She leads product decisions, platform strategy, and audience development — turning a passionate community into a thriving movement, one episode at a time.", avatarColor: "#5f9de3",   photoUrl: "https://ui-avatars.com/api/?name=Shelly+Chambers&background=5f9de3&color=fff&size=400&bold=true&rounded=true" },
  { name: "Imran Qureshi",        role: "Podcast Editor",                           bio: "Imran brings technical precision and a creative sensibility to the editing suite. He shapes the sonic identity of Unlock Her Tech — balancing music, voice, and silence to craft episodes that feel both professional and deeply human, making every recording a pleasure to listen to.", avatarColor: "#72c472",  photoUrl: "https://ui-avatars.com/api/?name=Imran+Qureshi&background=72c472&color=fff&size=400&bold=true&rounded=true" },
];