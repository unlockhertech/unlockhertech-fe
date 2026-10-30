import type { ChangeEvent } from "react";
import {
  HiPlay,
  HiPause,
  HiXMark,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineExclamationCircle,
  HiSpeakerWave,
  HiSpeakerXMark,
  HiArrowUturnLeft,
  HiArrowUturnRight,
} from "react-icons/hi2";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { platforms } from "../data";
import { formatTime } from "../utils/format";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

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
  playbackRate: number;
  volume: number;
  onProgressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
  onSkip: (seconds: number) => void;
  onRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
  onDismiss: () => void;
}

function MiniPlayerActiveState({
  currentEpisode,
  isPlaying,
  currentTime,
  duration,
  progress,
  playbackRate,
  volume,
  onProgressChange,
  onToggle,
  onSkip,
  onRateChange,
  onVolumeChange,
  onDismiss,
}: Readonly<MiniPlayerActiveStateProps>) {
  const formattedDuration = formatTime(duration);
  const displayDuration = formattedDuration === "0:00" ? currentEpisode.duration : formattedDuration;

  function toggleMute() {
    if (volume > 0) {
      onVolumeChange(0);
    } else {
      onVolumeChange(1);
    }
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3">
        {/* Episode Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-xs"
            style={{ backgroundColor: currentEpisode.coverColor }}
          >
            {currentEpisode.episodeNumber}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-white text-xs sm:text-sm truncate font-semibold">
              {currentEpisode.title}
            </p>
            <p className="text-gray-400 text-[11px] sm:text-xs">
              Ep {currentEpisode.episodeNumber} · {formatTime(currentTime)} / {displayDuration}
            </p>
          </div>
        </div>

        {/* Center Controls: Skip -15s, Play/Pause, Skip +15s */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSkip(-15)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
            aria-label="Skip backward 15 seconds"
            title="Back 15s"
          >
            <HiArrowUturnLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xs:inline">15s</span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-brand-coral cursor-pointer shadow-md"
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
            onClick={() => onSkip(15)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
            aria-label="Skip forward 15 seconds"
            title="Forward 15s"
          >
            <span className="text-[10px] hidden xs:inline">15s</span>
            <HiArrowUturnRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Controls: Speed Selector, Volume Slider, Dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Playback Speed Selector */}
          <div className="relative">
            <label htmlFor="mini-player-speed" className="sr-only">
              Playback speed
            </label>
            <select
              id="mini-player-speed"
              value={playbackRate}
              onChange={(e) => onRateChange(Number.parseFloat(e.target.value))}
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold py-1 px-1.5 sm:px-2 rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-brand-coral cursor-pointer transition-colors"
              aria-label="Select playback speed"
            >
              {PLAYBACK_RATES.map((rate) => (
                <option key={rate} value={rate} className="bg-neutral-800 text-white font-medium">
                  {rate}x
                </option>
              ))}
            </select>
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
            >
              {volume === 0 ? (
                <HiSpeakerXMark className="w-4 h-4" />
              ) : (
                <HiSpeakerWave className="w-4 h-4" />
              )}
            </button>
            <label htmlFor="mini-player-volume" className="sr-only">
              Volume
            </label>
            <input
              id="mini-player-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(Number.parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-coral"
              aria-label="Volume slider"
            />
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close player"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function MiniPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    hasError,
    toggle,
    seek,
    skip,
    setPlaybackRate,
    setVolume,
    dismiss,
  } = useAudioPlayer();

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
        playbackRate={playbackRate}
        volume={volume}
        onProgressChange={handleProgressChange}
        onToggle={() => toggle(currentEpisode)}
        onSkip={skip}
        onRateChange={setPlaybackRate}
        onVolumeChange={setVolume}
        onDismiss={dismiss}
      />
    </div>
  );
}
