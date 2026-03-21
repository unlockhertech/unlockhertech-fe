import { HiPlay, HiPause, HiXMark, HiOutlineArrowTopRightOnSquare, HiOutlineExclamationCircle } from "react-icons/hi2";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { platforms } from "../data";
import React from "react";

const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

export function MiniPlayer() {
  const { currentEpisode, isPlaying, currentTime, duration, hasError, toggle, seek, dismiss } = useAudioPlayer();

  if (!currentEpisode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 shadow-2xl bg-neutral-900 border-t-3 ${hasError ? "border-brand-yellow" : "border-brand-coral"}`}
    >
      {/* ── Error state ─────────────────────────────────────────────────── */}
      {hasError ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Episode swatch */}
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
            style={{ backgroundColor: currentEpisode.coverColor }}
          >
            {currentEpisode.episodeNumber}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <HiOutlineExclamationCircle className="w-3.5 h-3.5 shrink-0 text-brand-yellow" />
              <p className="text-xs font-semibold text-brand-yellow">
                Can't play in browser — listen on your podcast app instead
              </p>
            </div>
            <p className="text-gray-500 text-xs truncate">
              Ep {currentEpisode.episodeNumber} · {currentEpisode.title}
            </p>
          </div>

          {/* Platform quick-links */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {platforms.map(({ name, icon: Icon, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                title={`Listen on ${name}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-90 bg-white/10 text-white/80"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{name}</span>
                <HiOutlineArrowTopRightOnSquare className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>

          {/* Mobile: single "Listen now" link */}
          <a
            href={platforms[0]?.url}
            target="_blank"
            rel="noreferrer"
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs shrink-0 font-semibold bg-brand-yellow text-white"
          >
            Listen <HiOutlineArrowTopRightOnSquare className="w-3 h-3" />
          </a>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close player"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* ── Progress bar — full width, clickable ──────────────────────── */}
          <div
            className="w-full h-1 cursor-pointer group bg-white/10"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full transition-all group-hover:opacity-90 bg-brand-coral"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ── Player row ────────────────────────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 py-3">

            {/* Episode colour swatch + number */}
            <div
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ backgroundColor: currentEpisode.coverColor }}
            >
              {currentEpisode.episodeNumber}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate font-semibold">
                {currentEpisode.title}
              </p>
              <p className="text-gray-500 text-xs">
                Ep {currentEpisode.episodeNumber} · {fmt(currentTime)} / {fmt(duration) === "0:00" ? currentEpisode.duration : fmt(duration)}
              </p>
            </div>

            {/* Play / Pause */}
            <button
              onClick={() => toggle(currentEpisode)}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-brand-coral"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying
                ? <HiPause className="w-4 h-4 text-white" fill="white" />
                : <HiPlay  className="w-4 h-4 text-white" fill="white" />
              }
            </button>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close player"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
