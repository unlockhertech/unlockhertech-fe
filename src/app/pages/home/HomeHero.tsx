import { type ChangeEvent } from "react";
import { Link } from "react-router";
import { FaPlay, FaPause, FaMicrophone } from "react-icons/fa6";
import { HiCodeBracket } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { formatTime } from "../../utils/format";
import { IMG_HERO, platforms } from "../../data";
import type { Episode } from "../../types";

const WAVE_HEIGHTS = [20, 40, 60, 80, 55, 70, 35, 90, 50, 65, 45, 75, 30, 85, 55, 40, 70, 50, 60, 35];

interface HomeHeroProps {
  latestEpisode?: Episode;
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
                Community · Podcast · Live Practices
              </span>
            </div>

            <h1 className="mb-6 text-neutral-900 font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] leading-[1.18] tracking-tight text-balance">
              Conversations That <span className="text-brand-coral">Inspire</span>.<br className="hidden sm:inline" />
              {" "}Skills That <span className="text-brand-blue">Empower</span>.
            </h1>

            <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              A hands-on tech community and storytelling podcast for women, non-binary people, and allies. We pair honest conversations with fortnightly LeetCode problem-solving practices and mentorship.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                to="/episodes"
                className="w-full sm:w-auto px-8 py-4 rounded-full flex items-center justify-center gap-2 border-2 border-gray-200 bg-white hover:bg-stone-50 text-gray-800 font-bold text-sm transition-all shadow-xs"
              >
                <FaPlay className="w-3.5 h-3.5 text-brand-coral" />
                Listen to Episodes
              </Link>

              <Link
                  to="/practices"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-white flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-brand-coral font-bold text-sm"
              >
                <HiCodeBracket className="w-5 h-5 text-brand-yellow" />
                Explore She Leads Tech Practices
              </Link>
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
                <div className="relative aspect-16/9 w-full overflow-hidden bg-[#2E0B20]">
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
                <div className="p-4 sm:p-5">
                  {loading || !latestEpisode ? (
                    <div className="space-y-2.5 animate-pulse">
                      <div className="h-3.5 w-3/4 rounded-full bg-white/20" />
                      <div className="h-3 w-1/2 rounded-full bg-white/10" />
                    </div>
                  ) : (
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
                          aria-label={playing ? `Pause episode ${latestEpisode.episodeNumber}` : `Play episode ${latestEpisode.episodeNumber}`}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-brand-coral hover:bg-brand-coral/90 text-white hover:scale-105 transition-transform shadow-md cursor-pointer shrink-0"
                        >
                          {playing ? <FaPause className="w-3.5 h-3.5" /> : <FaPlay className="w-3.5 h-3.5 ml-0.5" />}
                        </button>

                        {/* Waveform Visualization */}
                        <div className="flex-1 flex items-end gap-1 h-7 sm:h-8">
                          {WAVE_HEIGHTS.slice(0, 16).map((h, i) => (
                            <div
                              key={`wave-${i}`}
                              className="flex-1 rounded-full transition-all"
                              style={{
                                height: `${h}%`,
                                backgroundColor: i < 6 ? "var(--podcast-yellow)" : "rgba(255,255,255,0.25)",
                                animation: playing ? `waveBar 0.8s ease-in-out ${i * 0.05}s infinite alternate` : "none",
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
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={latestIsActive ? currentTime : 0}
                          onChange={handleProgressChange}
                          disabled={!latestIsActive || !duration}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Seek track"
                        />
                      </div>

                      <div className="flex justify-between text-[10px] sm:text-[11px] text-pink-200/80 font-mono">
                        <span>{latestIsActive ? formatTime(currentTime) : "0:00"}</span>
                        <span>{latestIsActive && duration ? formatTime(duration) : latestEpisode.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
