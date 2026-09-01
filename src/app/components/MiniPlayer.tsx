import type { ChangeEvent } from "react";
import { HiPlay, HiPause, HiXMark, HiOutlineArrowTopRightOnSquare, HiOutlineExclamationCircle } from "react-icons/hi2";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { platforms } from "../data";
import { formatTime } from "../utils/format";

interface MiniPlayerErrorStateProps {
  currentEpisode: {
    coverColor: string;
    episodeNumber: number;
    title: string;
  };
  onDismiss: () => void;
}

function MiniPlayerErrorState({ currentEpisode, onDismiss }: Readonly<MiniPlayerErrorStateProps>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
        style={{ backgroundColor: currentEpisode.coverColor }}
      >
        {currentEpisode.episodeNumber}
      </div>

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

      {platforms[0]?.url && (
        <a
          href={platforms[0].url}
          target="_blank"
          rel="noreferrer"
          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs shrink-0 font-semibold bg-brand-yellow text-white"
        >
          Listen <HiOutlineArrowTopRightOnSquare className="w-3 h-3" />
        </a>
      )}

      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        aria-label="Close player"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  );
}

interface MiniPlayerActiveStateProps {
  currentEpisode: {
    coverColor: string;
    episodeNumber: number;
    title: string;
    duration: string;
  };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onProgressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
  onDismiss: () => void;
}

function MiniPlayerActiveState({
  currentEpisode,
  isPlaying,
  currentTime,
  duration,
  progress,
  onProgressChange,
  onToggle,
  onDismiss,
}: Readonly<MiniPlayerActiveStateProps>) {
  const formattedDuration = formatTime(duration);
  const displayDuration = formattedDuration === "0:00" ? currentEpisode.duration : formattedDuration;

  return (
    <>
      <div className="w-full relative h-1 bg-white/10 group cursor-pointer">
        <div
          className="absolute top-0 left-0 h-full transition-all group-hover:opacity-90 bg-brand-coral pointer-events-none"
          style={{ width: `${progress}%` }}
        />
        <input
          id="mini-player-seek-slider"
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={onProgressChange}
          disabled={!duration}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Seek track"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 py-3">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
          style={{ backgroundColor: currentEpisode.coverColor }}
        >
          {currentEpisode.episodeNumber}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate font-semibold">
            {currentEpisode.title}
          </p>
          <p className="text-gray-500 text-xs">
            Ep {currentEpisode.episodeNumber} · {formatTime(currentTime)} / {displayDuration}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-brand-coral cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <HiPause className="w-4 h-4 text-white" fill="white" />
          ) : (
            <HiPlay className="w-4 h-4 text-white" fill="white" />
          )}
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          aria-label="Close player"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

export function MiniPlayer() {
  const { currentEpisode, isPlaying, currentTime, duration, hasError, toggle, seek, dismiss } = useAudioPlayer();

  if (!currentEpisode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleProgressChange(e: ChangeEvent<HTMLInputElement>) {
    if (!duration) return;
    seek(Number.parseFloat(e.target.value));
  }

  const borderClass = hasError ? "border-brand-yellow" : "border-brand-coral";

  if (hasError) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 shadow-2xl bg-neutral-900 border-t-3 ${borderClass}`}>
        <MiniPlayerErrorState currentEpisode={currentEpisode} onDismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 shadow-2xl bg-neutral-900 border-t-3 ${borderClass}`}>
      <MiniPlayerActiveState
        currentEpisode={currentEpisode}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        onProgressChange={handleProgressChange}
        onToggle={() => toggle(currentEpisode)}
        onDismiss={dismiss}
      />
    </div>
  );
}
