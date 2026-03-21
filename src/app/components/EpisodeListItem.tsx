import { HiPlay, HiPause, HiOutlineClock } from "react-icons/hi2";
import { ImageWithFallback } from "./ImageWithFallback";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { Episode } from "../data";

interface EpisodeListItemProps {
  episode: Episode;
}

export function EpisodeListItem({ episode }: EpisodeListItemProps) {
  const { title, description, duration, date, episodeNumber, coverColor, imageUrl } = episode;
  const { toggle, isThisPlaying, isActive } = useAudioPlayer();
  const playing = isThisPlaying(episode.id);
  const active  = isActive(episode.id);

  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-md transition-all border ${
        active ? "border-2" : "border-black/7"
      }`}
      style={{
        borderColor: active ? coverColor : undefined,
      }}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 rounded-xl overflow-hidden w-18 h-18">
        {imageUrl ? (
          <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: coverColor }} />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          {playing ? (
            /* Animated bars when playing */
            <div className="flex items-end gap-0.5 h-4">
              {[3, 5, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-white"
                  style={{
                    height: `${h * 2}px`,
                    animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          ) : (
            <span className="text-white text-xs font-extrabold">{episodeNumber}</span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
            style={{ backgroundColor: coverColor }}
          >
            EP {episodeNumber}
          </span>
          <span className="text-gray-400 text-xs">{date}</span>
          <span className="text-gray-300 text-xs hidden sm:inline">·</span>
          <span className="text-gray-400 text-xs hidden sm:inline">
            <HiOutlineClock className="w-3 h-3 inline mr-0.5" />{duration}
          </span>
        </div>
        <p className="truncate font-semibold text-[0.95rem]" style={{ color: active ? coverColor : "var(--color-neutral-900)" }}>
          {title}
        </p>
        <p className="text-gray-400 text-sm truncate hidden sm:block">{description}</p>
      </div>

      {/* Mobile duration */}
      <span className="text-gray-400 text-xs shrink-0 sm:hidden">
        <HiOutlineClock className="w-3 h-3 inline mr-0.5" />{duration}
      </span>

      {/* Play / Pause button */}
      <button
        onClick={() => toggle(episode)}
        className="shrink-0 rounded-full p-2.5 transition-all hover:scale-110"
        style={{ backgroundColor: `${coverColor}18`, color: coverColor }}
        aria-label={playing ? `Pause episode ${episodeNumber}` : `Play episode ${episodeNumber}`}
      >
        {playing
          ? <HiPause className="w-4 h-4" fill="currentColor" />
          : <HiPlay  className="w-4 h-4" fill="currentColor" />
        }
      </button>

      <style>{`@keyframes bounce { from { transform: scaleY(1); } to { transform: scaleY(0.3); } }`}</style>
    </div>
  );
}
