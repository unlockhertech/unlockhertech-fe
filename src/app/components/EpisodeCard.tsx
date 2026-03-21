import { HiPlay, HiPause, HiOutlineClock } from "react-icons/hi2";
import { ImageWithFallback } from "./ImageWithFallback";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { Episode } from "../data";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { title, description, duration, date, episodeNumber, coverColor, imageUrl } = episode;
  const { toggle, isThisPlaying } = useAudioPlayer();
  const playing = isThisPlaying(episode.id);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-white border border-black/7"
    >
      {/* Cover */}
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: coverColor }} />
        )}

        {/* Episode badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 font-bold tracking-wider">
            <div className="text-white text-xs uppercase">EP {episodeNumber}</div>
          </div>
        </div>

        {/* Play / Pause button */}
        <button
          onClick={() => toggle(episode)}
          className="absolute bottom-4 right-4 rounded-full p-3 shadow-lg hover:scale-110 transition-transform bg-white"
          aria-label={playing ? `Pause episode ${episodeNumber}` : `Play episode ${episodeNumber}`}
        >
          {playing
            ? <HiPause className="w-5 h-5" style={{ color: coverColor }} fill="currentColor" />
            : <HiPlay  className="w-5 h-5" style={{ color: coverColor }} fill="currentColor" />
          }
        </button>

        {/* Animated playing indicator */}
        {playing && (
          <div className="absolute top-4 right-4 flex items-end gap-0.5 h-5">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${h * 3}px`,
                  backgroundColor: "white",
                  animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3" />{duration}</span>
        </div>
        <h3 className="mb-2 text-neutral-900">{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{description}</p>
        <div className="mt-4 h-0.5 w-10 rounded-full" style={{ backgroundColor: coverColor }} />
      </div>

      <style>{`@keyframes bounce { from { transform: scaleY(1); } to { transform: scaleY(0.3); } }`}</style>
    </div>
  );
}
