import React, { useState } from "react";
import { FaPlay, FaPause, FaChevronDown, FaArrowRight, FaMicrophone } from "react-icons/fa6";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/ImageWithFallback.tsx";
import { Lady1Welcome, Lady2Welcome, WomanSitting, WheelChair, WomanStanding } from "../components/Illustrations";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useRssFeed } from "../hooks/useRssFeed";
import { useMetaData } from "../hooks/useMetaData";
import {
  IMG_HERO, IMG_DESK_SETUP,
  platforms,
} from "../data";

const WAVE_HEIGHTS = [20, 40, 60, 80, 55, 70, 35, 90, 50, 65, 45, 75, 30, 85, 55, 40, 70, 50, 60, 35];

const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

export function HomePage() {
  useMetaData("Empowering Women in Technology", "Join us as we explore big ideas with brilliant minds in the tech industry. Honest conversations that inspire change.");
  const [showPlatforms, setShowPlatforms] = useState(false);
  const { toggle, seek, isThisPlaying, isActive, currentTime, duration } = useAudioPlayer();
  const { episodes, loading } = useRssFeed();

  const LATEST = episodes[0];

  const playing        = LATEST ? isThisPlaying(LATEST.id) : false;
  const latestIsActive = LATEST ? isActive(LATEST.id)      : false;
  const progress       = latestIsActive && duration > 0 ? (currentTime / duration) * 100 : 35;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!latestIsActive || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }

  return (
    <div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left – text + CTAs */}
            <div className="order-2 lg:order-1">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-brand-pink text-neutral-900"
              >
                <span className="w-2 h-2 rounded-full animate-pulse bg-brand-coral" />
                <span className="text-sm font-semibold">New episode every month</span>
              </div>

              <h1
                className="mb-6 text-neutral-900 font-extrabold leading-[1.1]"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
              >
                Conversations<br />That{" "}
                <span className="text-brand-coral">Inspire</span>{" "}
                <span className="text-brand-blue">Change</span>
              </h1>

              <p className="text-gray-500 mb-10 text-[1.1rem] leading-[1.75] max-w-120">
                Join us as we explore big ideas with brilliant minds — one honest conversation at a time.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/episodes"
                  className="px-8 py-4 rounded-full text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-brand-coral"
                >
                  <FaPlay className="w-5 h-5" />
                  Listen to the Latest Episode
                </Link>

                <div className="relative">
                  <button
                    className="w-full px-8 py-4 rounded-full flex items-center justify-center gap-2 border-2 transition-all hover:bg-blue-50 border-brand-blue text-brand-blue"
                    onClick={() => setShowPlatforms(!showPlatforms)}
                  >
                    Subscribe Now
                    <FaChevronDown className={`w-5 h-5 transition-transform ${showPlatforms ? "rotate-180" : ""}`} />
                  </button>
                  {showPlatforms && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPlatforms(false)} />
                      <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-20 border border-black/10">
                        {platforms.map(({ name, icon: Icon, url}) => (
                          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">{name}</span>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Secondary CTAs */}
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/episodes" className="text-gray-500 hover:text-gray-800 underline underline-offset-4 transition-colors">
                  Browse All Episodes
                </Link>
                <span className="text-gray-300">|</span>
                <Link to="/about" className="text-gray-500 hover:text-gray-800 underline underline-offset-4 transition-colors">
                  Learn More About Us
                </Link>
              </div>
            </div>

            {/* Right – hero photo + floating player */}
            <div className="order-1 lg:order-2 relative pb-10 lg:pb-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/5 max-h-135 bg-gray-200">
                {!loading && (
                  <ImageWithFallback
                    src={LATEST?.imageUrl || IMG_HERO}
                    alt="Podcast host at microphone"
                    className="w-full h-full object-cover"
                  />
                )}
                {loading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <div
                  className="absolute inset-0 bg-linear-to-t from-brand-coral/80 via-brand-coral/30 to-transparent"
                />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm opacity-80 mb-1 font-semibold">NOW PLAYING</div>
                  {loading ? (
                    <div className="h-5 w-48 rounded-full bg-white/20 animate-pulse" />
                  ) : LATEST ? (
                    <div className="text-[1.15rem] font-extrabold">Ep {LATEST.episodeNumber} · {LATEST.title}</div>
                  ) : null}
                </div>
              </div>

              {/* Floating player card */}
              <div
                className="absolute -bottom-2 right-0 lg:-right-6 rounded-2xl p-5 shadow-2xl w-60 bg-neutral-900"
              >
                {loading || !LATEST ? (
                  /* Skeleton while RSS is loading */
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-2.5 w-9 h-9 shrink-0 bg-brand-coral/30" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 rounded-full bg-white/10 w-full" />
                        <div className="h-2 rounded-full bg-white/10 w-2/3" />
                      </div>
                    </div>
                    <div className="flex items-end gap-0.5 h-8">
                      {WAVE_HEIGHTS.map((h, i) => (
                        <div key={i} className="flex-1 rounded-full bg-white/10" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        className="rounded-full p-2.5 shrink-0 bg-brand-coral"
                        onClick={() => toggle(LATEST)}
                      >
                        {playing
                          ? <FaPause className="w-4 h-4 text-white" />
                          : <FaPlay  className="w-4 h-4 text-white" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs truncate font-semibold">{LATEST.title}</div>
                        <div className="text-gray-400 text-xs">Ep {LATEST.episodeNumber} · {LATEST.duration}</div>
                      </div>
                    </div>
                    {/* Waveform bars — animate when playing */}
                    <div className="flex items-end gap-0.5 h-8">
                      {WAVE_HEIGHTS.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i < 7 ? "var(--podcast-coral)" : "rgba(255,255,255,0.15)",
                            animation: playing ? `waveBar 0.8s ease-in-out ${i * 0.04}s infinite alternate` : "none",
                            transformOrigin: "bottom",
                          }}
                        />
                      ))}
                    </div>
                    {/* Seekable progress bar */}
                    <div
                      className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                      onClick={handleProgressClick}
                      role="slider"
                      aria-label="Seek"
                      title={latestIsActive ? "Click to seek" : "Press play first"}
                    >
                      <div
                        className="h-full rounded-full transition-all bg-brand-coral"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs mt-1">
                      <span>{latestIsActive ? fmt(currentTime) : "0:00"}</span>
                      <span>{latestIsActive && duration ? fmt(duration) : LATEST.duration}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Episode badge */}
              <div
                className="absolute -top-4 -left-4 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 bg-brand-yellow"
              >
                <FaMicrophone className="w-4 h-4 text-white" />
                {loading || !LATEST ? (
                  <div className="h-3 w-20 rounded-full bg-white/30" />
                ) : (
                  <div className="text-white text-xs font-bold">Season 1 · Ep {LATEST.episodeNumber}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Welcome Strip ──────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-linear-to-br from-[#fdf0f7] to-[#f0f6fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div className="shrink-0 w-40 sm:w-52 -mb-2">
              <Lady1Welcome className="w-full h-auto" />
            </div>

            <div className="flex-1 text-center py-12 px-4">
              <p className="mb-2 text-brand-coral font-bold text-[0.8rem] tracking-[0.12em] uppercase">
                Welcome to the mic
              </p>
              <h2 className="mb-3 text-neutral-900 font-extrabold" style={{ fontSize: "clamp(1.35rem, 3vw, 1.9rem)" }}>
                Every Voice Belongs Here
              </h2>
              <p className="text-gray-500 text-sm mx-auto mb-5 max-w-95 leading-[1.75]">
                Unlock Her Tech is a space built for curious, ambitious women in tech — wherever you are in your journey.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80 text-brand-coral font-semibold"
              >
                Learn more about us <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="shrink-0 w-40 sm:w-52 -mb-2">
              <Lady2Welcome className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Latest Episode ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#fdf0f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs mb-1 uppercase tracking-widest text-brand-coral font-bold">Fresh Drop</p>
              <h2 className="text-neutral-900">Latest Episode</h2>
            </div>
            <Link
              to="/episodes"
              className="hidden sm:flex items-center gap-2 text-sm transition-colors hover:opacity-80 shrink-0 text-brand-coral font-semibold"
            >
              Browse all <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading || !LATEST ? (
            /* Skeleton card while RSS is fetching */
            <div className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col md:flex-row animate-pulse">
              <div className="md:w-72 shrink-0 min-h-55 bg-brand-coral/20" />
              <div className="flex-1 p-8 space-y-4">
                <div className="h-3 w-32 rounded-full bg-gray-200" />
                <div className="h-5 w-3/4 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-gray-100" />
                  <div className="h-3 rounded-full bg-gray-100" />
                  <div className="h-3 w-2/3 rounded-full bg-gray-100" />
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="h-10 w-32 rounded-full bg-gray-200" />
                  <div className="h-10 w-32 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col md:flex-row">
              {/* Cover */}
              <div className="md:w-72 relative shrink-0 overflow-hidden min-h-55">
                {LATEST.imageUrl && (
                  <ImageWithFallback
                    src={LATEST.imageUrl}
                    alt={LATEST.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-br from-brand-coral/85 to-brand-coral/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-xs opacity-70 mb-1 uppercase tracking-wider">Episode</div>
                  <div className="text-[3.5rem] font-black leading-none">{LATEST.episodeNumber}</div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8">
                <p className="text-gray-400 text-sm mb-1">Ep {LATEST.episodeNumber} · {LATEST.date} · {LATEST.duration}</p>
                <h3 className="mb-3 text-neutral-900">{LATEST.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-[1.75]">{LATEST.description}</p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => toggle(LATEST)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm hover:opacity-90 transition-all bg-brand-coral"
                  >
                    {playing
                      ? <><FaPause className="w-4 h-4" fill="white" /> Pause</>
                      : <><FaPlay  className="w-4 h-4" fill="white" /> Play Episode</>
                    }
                  </button>

                  <Link
                    to="/episodes"
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm border-2 hover:bg-pink-50 transition-all border-brand-coral text-brand-coral"
                  >
                    All Episodes <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── For Every Woman in Tech ─────────────────────────────────────────── */}
      <section className="overflow-hidden bg-white border-t-4 border-brand-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-14 pb-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-coral font-bold">Our community</p>
            <h2 className="text-neutral-900 font-extrabold" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              For Every Woman in Tech
            </h2>
            <p className="text-gray-500 text-sm mx-auto mt-2 max-w-110 leading-[1.75]">
              No matter your background, role, or journey — this podcast celebrates all of you.
            </p>
          </div>

          <div className="flex items-end justify-center gap-0 sm:gap-4">
            <div className="w-32 sm:w-44 shrink-0">
              <WomanSitting className="w-full h-auto" />
            </div>
            <div className="w-32 sm:w-44 shrink-0 translate-y-3">
              <WheelChair className="w-full h-auto" />
            </div>
            <div className="w-32 sm:w-44 shrink-0">
              <WomanStanding className="w-full h-auto" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pb-14 -mt-2">
            {[
              { label: "Engineers",        className: "bg-brand-coral" },
              { label: "Designers",        className: "bg-brand-blue"   },
              { label: "Founders",         className: "bg-brand-yellow" },
              { label: "Researchers",      className: "bg-brand-green"  },
              { label: "Product Managers", className: "bg-brand-pink"   },
            ].map(({ label, className }) => (
              <span
                key={label}
                className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTA below tags */}
          <div className="text-center pb-16">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80 text-brand-coral font-semibold"
            >
              Read about our mission <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

            {/* ── Subscribe CTA ──────────────────────────────────────────────────── */}
        <SubscribeCTA bgImage={IMG_DESK_SETUP} />

      <style>{`@keyframes waveBar { from { transform: scaleY(1); } to { transform: scaleY(0.25); } }`}</style>
    </div>
  );
}