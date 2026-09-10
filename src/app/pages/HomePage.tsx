import { useState, useEffect } from "react";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useRssFeed } from "../hooks/useRssFeed";
import { useMetaData } from "../hooks/useMetaData";
import { getAllBlogPosts, getAllExternalEvents } from "../utils/sanity";
import { IMG_AUDIO_EQ } from "../data";
import type { BlogPost, ExternalEvent } from "../types";
import { HomeHero } from "./home/HomeHero";
import { HomePillars } from "./home/HomePillars";
import { HomeSheLeadsTechBanner } from "./home/HomeSheLeadsTechBanner";
import { HomeInclusivitySection } from "./home/HomeInclusivitySection";
import { HomeFeaturedEvents } from "./home/HomeFeaturedEvents";
import { HomeFeaturedPosts } from "./home/HomeFeaturedPosts";

const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === "true";
const enableGetInvolved = import.meta.env.VITE_ENABLE_GET_INVOLVED === "true";

export function HomePage() {
  useMetaData(
    "Unlock Her Tech | Where Skills Grow And Voices Are Heard",
    "Join Unlock Her Tech: A vibrant community for women, non-binary people, and allies in tech. Featuring fortnightly She Leads Tech engineering workshops, mentorship, and inspiring podcast episodes.",
    undefined,
    {
      image: "/logo.png",
      type: "website",
    }
  );

  const { toggle, seek, isThisPlaying, isActive, currentTime, duration } = useAudioPlayer();
  const { episodes, loading } = useRssFeed();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<ExternalEvent[]>([]);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const posts = await getAllBlogPosts();
        setFeaturedPosts(posts.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured blog posts:", err);
      }
    }
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (!enableEvents) return;

    async function fetchEvents() {
      try {
        const events = await getAllExternalEvents();
        setFeaturedEvents(events.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured events:", err);
      }
    }

    fetchEvents();
  }, []);

  const latestEpisode = episodes[0];
  const playing = latestEpisode ? isThisPlaying(latestEpisode.id) : false;
  const latestIsActive = latestEpisode ? isActive(latestEpisode.id) : false;
  const progress = latestIsActive && duration > 0 ? (currentTime / duration) * 100 : 35;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <HomeHero
        latestEpisode={latestEpisode}
        loading={loading}
        playing={playing}
        latestIsActive={latestIsActive}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        enableGetInvolved={enableGetInvolved}
        onPlayToggle={toggle}
        onSeek={seek}
      />

      {/* ── 2. Core Pillars (What We Do) ────────────────────────────────── */}
      <HomePillars enableGetInvolved={enableGetInvolved} />

      {/* ── 3. Featured She Leads Tech Spotlight Banner ─────────────────── */}
      <HomeSheLeadsTechBanner />

      {/* ── 4. Inclusivity & Community Roles ────────────────────────────── */}
      <HomeInclusivitySection />

      {/* ── 5. Upcoming Events ──────────────────────────────────────────── */}
      {enableEvents && <HomeFeaturedEvents events={featuredEvents} />}

      {/* ── 6. Latest From The Blog ─────────────────────────────────────── */}
      <HomeFeaturedPosts posts={featuredPosts} />

      {/* ── 7. Subscribe Banner ─────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />

      <style>{`@keyframes waveBar { from { transform: scaleY(1); } to { transform: scaleY(0.25); } }`}</style>
    </div>
  );
}