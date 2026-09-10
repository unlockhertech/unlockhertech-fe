import { type ChangeEvent } from "react";
import { Link } from "react-router";
import { FaPlay, FaPause, FaMicrophone } from "react-icons/fa6";
import { HiCodeBracket } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { formatTime } from "../../utils/format";
import { IMG_HERO, platforms } from "../../data";
import type { Episode } from "../../types";

const WAVE_BARS = [
  { id: "wave-bar-1", height: 20, isAccent: true, delay: 0 },
  { id: "wave-bar-2", height: 40, isAccent: true, delay: 0.05 },
  { id: "wave-bar-3", height: 60, isAccent: true, delay: 0.1 },
  { id: "wave-bar-4", height: 80, isAccent: true, delay: 0.15 },
  { id: "wave-bar-5", height: 55, isAccent: true, delay: 0.2 },
  { id: "wave-bar-6", height: 70, isAccent: true, delay: 0.25 },
  { id: "wave-bar-7", height: 35, isAccent: false, delay: 0.3 },
  { id: "wave-bar-8", height: 90, isAccent: false, delay: 0.35 },
  { id: "wave-bar-9", height: 50, isAccent: false, delay: 0.4 },
  { id: "wave-bar-10", height: 65, isAccent: false, delay: 0.45 },
  { id: "wave-bar-11", height: 45, isAccent: false, delay: 0.5 },
  { id: "wave-bar-12", height: 75, isAccent: false, delay: 0.55 },
  { id: "wave-bar-13", height: 30, isAccent: false, delay: 0.6 },
  { id: "wave-bar-14", height: 85, isAccent: false, delay: 0.65 },
  { id: "wave-bar-15", height: 55, isAccent: false, delay: 0.7 },
  { id: "wave-bar-16", height: 40, isAccent: false, delay: 0.75 },
];

interface HeroEpisodePlayerBodyProps {
  latestEpisode: Episode;
  playing: boolean;
  latestIsActive: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onPlayToggle: (episode: Episode) => void;
  onProgressChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function HeroEpisodePlayerBody({
  latestEpisode,
  playing,
  latestIsActive,
  currentTime,
  duration,
  progress,
  onPlayToggle,
  onProgressChange,
}: Readonly<HeroEpisodePlayerBodyProps>) {
  const playPauseLabel = playing
    ? `Pause episode ${latestEpisode.episodeNumber}`
    : `Play episode ${latestEpisode.episodeNumber}`;

  const formattedCurrentTime = latestIsActive ? formatTime(currentTime) : "0:00";
  const formattedDuration = latestIsActive && duration > 0 ? formatTime(duration) : latestEpisode.duration;

  return (
    <>
      <p className="text-sm sm:text-base font-extrabold line-clamp-1 mb-0.5 text-white">
        {latestEpisode.title}
      </p>
      <p className="text-[11px] sm:text-xs text-pink-200/70 mb-3">
        {latestEpisode.date} · {latestEpisode.duration}
      </p>

      <div className="flex items-center gap-3.5 mb-3">
        <button
          type="button"
          onClick={() => onPlayToggle(latestEpisode)}
          aria-label={playPauseLabel}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-brand-coral hover:bg-brand-coral/90 text-white hover:scale-105 transition-transform shadow-md cursor-pointer shrink-0"
        >
          {playing ? <FaPause className="w-3.5 h-3.5" /> : <FaPlay className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Waveform Visualisation */}
        <div className="flex-1 flex items-end gap-1 h-7 sm:h-8">
          {WAVE_BARS.map((bar) => (
            <div
              key={bar.id}
              className="flex-1 rounded-full transition-all"
              style={{
                height: `${bar.height}%`,
                backgroundColor: bar.isAccent ? "var(--podcast-yellow)" : "rgba(255,255,255,0.25)",
                animation: playing ? `waveBar 0.8s ease-in-out ${bar.delay}s infinite alternate` : "none",
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      </div>

      {/* Seekable scrub bar */}
      <div className="relative h-1.5 w-full bg-white/15 rounded-full overflow-hidden mb-1.5">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-linear-to-r from-brand-yellow to-brand-coral pointer-events-none"
          style={{ width: `${progress}%` }}
        />
        <input
          id="hero-episode-seek-slider"
          type="range"
          min="0"
          max={duration || 100}
          value={latestIsActive ? currentTime : 0}
          onChange={onProgressChange}
          disabled={!latestIsActive || !duration}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Seek track"
        />
      </div>

      <div className="flex justify-between text-[10px] sm:text-[11px] text-pink-200/80 font-mono">
        <span>{formattedCurrentTime}</span>
        <span>{formattedDuration}</span>
      </div>
    </>
  );
}

function HeroEpisodeSkeleton() {
  return (
    <div className="space-y-2.5 animate-pulse">
      <div className="h-3.5 w-3/4 rounded-full bg-white/20" />
      <div className="h-3 w-1/2 rounded-full bg-white/10" />
    </div>
  );
}

export interface HomeHeroProps {
  latestEpisode: Episode | null;
  loading: boolean;
  playing: boolean;
  latestIsActive: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  enableGetInvolved: boolean;
  onPlayToggle: (episode: Episode) => void;
  onSeek: (time: number) => void;
}

export function HomeHero({
  latestEpisode,
  loading,
  playing,
  latestIsActive,
  currentTime,
  duration,
  progress,
  enableGetInvolved,
  onPlayToggle,
  onSeek,
}: Readonly<HomeHeroProps>) {
  function handleProgressChange(e: ChangeEvent<HTMLInputElement>) {
    if (!latestIsActive || !duration) return;
    onSeek(Number.parseFloat(e.target.value));
  }

  return (
    <section className="relative bg-white border-b border-gray-100 z-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BrandPatternOverlay variant="light" className="opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left – Copy & Primary CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-pink-50 text-brand-coral border border-pink-100">
              <span className="w-2 h-2 rounded-full animate-pulse bg-brand-coral" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Podcast · Live Practices · Community
              </span>
            </div>

            <h1 className="mb-6 text-neutral-900 font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] leading-[1.18] tracking-tight text-balance">
              Conversations That <span className="text-brand-coral">Inspire</span>.<br className="hidden sm:inline" />
              {" "}Skills That <span className="text-brand-blue">Empower</span>.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-stone-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              The community where authentic tech journeys meet live algorithmic problem-solving. We empower women, non-binary technologists, and allies through fortnightly LeetCode sessions, mentorship, and in-depth podcast dialogues.
            </p>

            {/* Primary Action Buttons & Quick Jump Affordances */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <Link
                to="/practices"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-white flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-brand-coral font-bold text-sm"
              >
                <HiCodeBracket className="w-5 h-5 text-brand-yellow" />
                <span>Explore Live Practice</span>
              </Link>

              <Link
                to="/episodes"
                className="w-full sm:w-auto px-8 py-4 rounded-full flex items-center justify-center gap-2 border-2 border-gray-200 bg-white hover:bg-stone-50 text-gray-800 font-bold text-sm transition-all shadow-xs"
              >
                <FaPlay className="w-3.5 h-3.5 text-brand-coral" />
                <span>Listen to Podcast</span>
              </Link>
            </div>

            {/* In-Hero Quick-Jump Anchors */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mr-1">
                Jump To:
              </span>
              <a
                href="#what-we-do"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                Core Pillars
              </a>
              <a
                href="#she-leads-tech"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-brand-coral transition-colors"
              >
                She Leads Tech
              </a>
              {enableGetInvolved && (
                <a
                  href="#community-roles"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  Community
                </a>
              )}
            </div>

            {/* Podcast Platform Badges & Trust Signals */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs font-semibold text-gray-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                Listen On:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {platforms.map(({ name, icon: Icon, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen on ${name}`}
                    title={`Listen on ${name}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 hover:text-brand-coral transition-all text-xs font-bold shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                  >
                    <Icon className="w-3.5 h-3.5 text-stone-600" />
                    <span>{name}</span>
                  </a>
                ))}
              </div>

              {enableGetInvolved && (
                <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-stone-200">
                  <Link to="/get-involved" className="text-stone-600 hover:text-brand-coral font-bold transition-colors">
                    Become a Mentor / Lead →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right – Interactive Episode Card with Live Waveform */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-md opacity-60" />

              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-linear-to-b from-[#2E0B20] via-[#1C0714] to-[#12040D] border border-brand-pink/20 text-white">
                {/* Image cover header */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#2E0B20]">
                  {!loading && (
                    <ImageWithFallback
                      src={latestEpisode?.imageUrl || IMG_HERO}
                      alt={latestEpisode?.title ? `${latestEpisode.title} cover art` : "Unlock Her Tech podcast"}
                      width={400}
                      height={225}
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                  )}
                  {/* Seamless Top & Bottom Brand Overlays */}
                  <div className="absolute top-0 inset-x-0 h-10 bg-linear-to-b from-[#2E0B20]/90 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1C0714] via-[#2E0B20]/50 to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-3.5 left-3.5 rounded-full px-2.5 py-0.5 bg-brand-coral text-white text-[0.65rem] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md z-20">
                    <FaMicrophone className="w-2.5 h-2.5 text-brand-yellow" />
                    <span>{latestEpisode ? `Ep ${latestEpisode.episodeNumber} · Latest Release` : "Latest Episode"}</span>
                  </div>
                </div>

                {/* Player Controls Body */}
                {loading || !latestEpisode ? (
                  <div className="p-4 sm:p-5">
                    <HeroEpisodeSkeleton />
                  </div>
                ) : (
                  <div className="p-4 sm:p-5">
                    <HeroEpisodePlayerBody
                      latestEpisode={latestEpisode}
                      playing={playing}
                      latestIsActive={latestIsActive}
                      currentTime={currentTime}
                      duration={duration}
                      progress={progress}
                      onPlayToggle={onPlayToggle}
                      onProgressChange={handleProgressChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
