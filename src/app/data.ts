import { SiApplepodcasts, SiSpotify, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa6";
import type { Episode, Platform } from "./types";
import imgElaheh  from "../assets/ca5810f8de6d98da96a45d1d887e1f1510f03101.webp";
import imgShelly  from "../assets/8175fa61c548bd171865cd1d786abaac3950952e.webp";
import imgPritty from '../assets/91e96dfd067ea6afbddec7a62daaf34f07638b4a.webp';
import imgJen from '../assets/cd6f99d060c133a423b34da6adc91fd0e3455bc8.webp';
import imgRupi from '../assets/5865071a697a5a7a468424e514c3437692713cc9.webp';
import imgTim from '../assets/0b5f71adb2d06053e52d7a5d98977673c1679de0.webp';
import imgAlbert from '../assets/cc744fd1-b50d-4441-ad1e-722214345c01.webp';
import imgOlha from '../assets/317e3cec-2b64-424f-bbda-6e01d712f8f3.webp';
import imgSheLeadsTech from '../assets/a6601dd5-4c26-44d0-9828-952122709520.webp';

export { imgSheLeadsTech };
// ── Brand palette ──────────────────────────────────────────────────────────────
export const BERRY  = "#b42970";
export const ORANGE = "#e8563a";
export const BLUE   = "#5f9de3";
export const PINK   = "#f4a0b4";
export const GREEN  = "#72c472";
// ── Images ─────────────────────────────────────────────────────────────────────
export const IMG_HERO        = "https://images.unsplash.com/photo-1617745546548-9324da9e2b7c?auto=format&fit=crop&q=80&w=800";
export const IMG_STUDIO_MIC  = "https://images.unsplash.com/photo-1769509068789-f242b5a6fc47?auto=format&fit=crop&q=80&w=600";
export const IMG_DESK_SETUP  = "https://images.unsplash.com/photo-1632454005805-7bee57f76ee8?auto=format&fit=crop&q=80&w=600";
export const IMG_AUDIO_EQ    = "https://images.unsplash.com/photo-1595598237436-bf64a3bf18cd?auto=format&fit=crop&q=80&w=600";
export const IMG_DIVERSE     = "https://images.unsplash.com/photo-1573497701175-00c200fd57f0?auto=format&fit=crop&q=80&w=600";
export const IMG_PODCAST_FUN = "https://images.unsplash.com/photo-1554200876-980213841c94?auto=format&fit=crop&q=80&w=600";

// ── Platforms ──────────────────────────────────────────────────────────────────
export const platforms: Platform[] = [
  { name: "Apple Podcasts", icon: SiApplepodcasts, url: 'https://podcasts.apple.com/us/podcast/unlock-her-tech/id1800087284'},
  { name: "Spotify",        icon: SiSpotify,        url: 'https://open.spotify.com/show/5I2RiIZwjv8YbuwhlHTAPc'},
  { name: "YouTube",        icon: SiYoutube,        url: 'https://www.youtube.com/channel/UChhVCKvYVmZovXQmpxdafpg'},
  { name: "Amazon Music",   icon: FaAmazon,         url: 'https://music.amazon.com/podcasts/69812754-839d-4b8b-a878-058014c1946d/unlock-her-tech-podcast'},
];

export type { Episode };

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
    { 
      name: "Pritanya Fritz", 
      role: "Co-Founder, Podcast Host & Product & Tech Lead", 
      tagline: "Tech professional, passionate storyteller & proud new mum",
      linkedinUrl: "https://www.linkedin.com/in/pritanyafritz/",
      bio: "Pritanya/Pritty is a passionate storyteller and product leader who co-created Unlock Her Tech to shine a light on the brilliant women shaping the future of tech. She brings an infectious energy to the mic, drawing out authentic voices from founders, engineers, and innovators worldwide.", 
      avatarColor: BERRY, 
      photoUrl: imgPritty 
    },
    { 
      name: "Ellie Tahmasebi",
      role: "Co-Founder, Podcast Host & Technical Programme Lead", 
      tagline: "Software engineer, ecosystem collaborator & cat mom to one who looks suspiciously like Mulberry",
      linkedinUrl: "https://www.linkedin.com/in/ellie-tahmasebi/",
      bio: "Elaheh/Ellie is a visionary co-founder and software engineer who channels her passion for technical equity, strategic partnerships, and hands-on growth into every podcast conversation and community initiative, empowering women across the tech landscape.", 
      avatarColor: BLUE, 
      photoUrl: imgElaheh 
    },
    { 
      name: "Jen Carswell", 
      role: "Podcast Host", 
      tagline: "Empathetic interviewer, tech enthusiast & champion of authentic stories",
      linkedinUrl: "https://www.linkedin.com/in/jen-carswell-aa096193/",
      bio: "Jen is a curious, empathetic co-host who brings warmth and wit to the mic. She has a gift for making guests feel at ease and drawing out the stories behind the stories — the pivots, the failures, and the small wins that add up to something extraordinary.", 
      avatarColor: GREEN, 
      photoUrl: imgJen 
    },
    { 
      name: "Albert Duker", 
      role: "Partnerships & Strategy Lead", 
      tagline: "Strategic relationship builder, ecosystem driver & inclusion advocate",
      linkedinUrl: "https://www.linkedin.com/in/albert-duker/",
      bio: "Albert leads strategic partnerships and ecosystem growth at Unlock Her Tech. He builds meaningful collaborations with tech companies, community networks, and industry leaders to expand our impact and create new opportunities for our community.", 
      avatarColor: ORANGE, 
      photoUrl: imgAlbert 
    },
    { 
      name: "Sabrina Scollan", 
      role: "Partnerships & Events Coordinator", 
      tagline: "Sharp, detail-oriented coordinator connecting communities through impactful events",
      linkedinUrl: "https://www.linkedin.com/in/sabrina-scollan-60064047/",
      bio: "Sabrina drives Unlock Her Tech's partnerships and community events with sharp organisation and creative execution. She brings people together through engaging experiences and builds strong relationships that elevate women and allies across the tech landscape.", 
      avatarColor: PINK, 
      photoUrl: "https://ui-avatars.com/api/?name=Sabrina+Scollan&background=f4a0b4&color=fff&size=400&bold=true&rounded=true" 
    },
    { 
      name: "Shelly Chambers", 
      role: "Social Media & Strategy Lead", 
      tagline: "Product strategist, platform explorer & community growth champion",
      linkedinUrl: "https://www.linkedin.com/in/s-j-chambers/",
      bio: "Shelly sits at the intersection of strategy and growth, steering Unlock Her Tech toward the listeners and community members who need it most. She leads social campaigns, platform strategy, and audience development — turning a passionate community into a thriving movement.", 
      avatarColor: BLUE, 
      photoUrl: imgShelly 
    },
    { 
      name: "Rupi Sagoo", 
      role: "Podcast & Content Researcher", 
      tagline: "Curious tech researcher, data investigator & community builder",
      linkedinUrl: "https://www.linkedin.com/in/rupi-sagoo-8285762/",
      bio: "Rupi is the intellectual backbone of Unlock Her Tech. She dives deep into industry trends, timely themes, and editorial research to ensure every episode and article is rich, informed, and deeply relevant.", 
      avatarColor: GREEN, 
      photoUrl: imgRupi 
    },
    { 
      name: "Olha Danylevska", 
      role: "UI/UX Designer", 
      tagline: "Human-centered designer crafting intuitive, accessible & engaging digital experiences",
      linkedinUrl: "https://www.linkedin.com/in/olha-danylevska-117810a5/",
      bio: "Olha shapes the visual and interactive experience of Unlock Her Tech. Passionate about user-centric and accessible design, she ensures our digital platforms are welcoming, engaging, and effortless to navigate.", 
      avatarColor: ORANGE, 
      photoUrl: imgOlha
    },
    { 
      name: "Tim Price", 
      role: "Podcast & Video Editor", 
      tagline: "Audio & video craftsman, sonic storyteller & pacing perfectionist",
      linkedinUrl: "https://www.linkedin.com/in/timpricemedia/",
      bio: "Tim is the audio and video craftsman who transforms raw recordings into polished, professional episodes. With a keen eye and ear for pacing, clarity, and storytelling flow, he ensures every listen and watch feels seamless.", 
      avatarColor: BERRY, 
      photoUrl: imgTim 
    },
];