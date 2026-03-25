import { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiPlay, HiPause, HiXMark, HiCalendar, HiClock } from "react-icons/hi2";
import { IoHeadset } from "react-icons/io5";
import { ImageWithFallback } from "./ImageWithFallback";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { platforms } from "../data";
import type { Episode } from "../data";

interface EpisodeModalProps {
  episode: Episode;
  onClose: () => void;
}

export function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  const { title, description, duration, date, episodeNumber, coverColor, imageUrl } = episode;
  const { toggle, isThisPlaying } = useAudioPlayer();
  const playing = isThisPlaying(episode.id);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on the Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="episode-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Hero cover */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <>
              <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(160deg, ${coverColor}ee 0%, ${coverColor}99 50%, transparent 100%)`,
                }}
              />
            </>
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: coverColor }} />
          )}

          {/* Episode badge */}
          <div className="absolute top-4 left-4">
            <span
              className="inline-block text-white text-xs px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              EP {episodeNumber}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            aria-label="Close"
          >
            <HiXMark className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => toggle(episode)}
            className="absolute bottom-4 right-4 rounded-full p-3.5 shadow-lg hover:scale-110 transition-transform bg-white"
            aria-label={playing ? "Pause episode" : "Play episode"}
          >
            {playing ? (
              <HiPause className="w-5 h-5" style={{ color: coverColor }} fill="currentColor" />
            ) : (
              <HiPlay className="w-5 h-5" style={{ color: coverColor }} fill="currentColor" />
            )}
          </button>

          {/* Playing indicator */}
          {playing && (
            <div className="absolute top-4 right-14 flex items-end gap-0.5 h-5">
              {[3, 5, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${h * 3}px`,
                    backgroundColor: "white",
                    animation: `epBounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          {/* Meta row */}
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1.5">
              <HiCalendar className="w-3.5 h-3.5" />
              {date}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <HiClock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>

          {/* Title */}
          <h2 id="episode-modal-title" className="text-gray-900" style={{ lineHeight: 1.3 }}>
            {title}
          </h2>

          {/* Accent line */}
          <div className="h-0.5 w-12 rounded-full" style={{ backgroundColor: coverColor }} />

          {/* Full description */}
          <p className="text-gray-600 text-sm" style={{ lineHeight: 1.75 }}>
            {description}
          </p>

          {/* Listen on platforms */}
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
              <IoHeadset className="w-3.5 h-3.5" /> Listen on
            </p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all hover:scale-105 hover:shadow-sm"
                    style={{
                      borderColor: `${coverColor}55`,
                      color: coverColor,
                      backgroundColor: `${coverColor}0d`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {p.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes epBounce { 
            from { transform: scaleY(1); } 
            to { transform: scaleY(0.3); } 
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
}
