import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Episode } from "../data";
import { Ctx } from "./AudioPlayerCtx";

const PLAYBACK_RATE_KEY = "uht_audio_playback_rate";
const VOLUME_KEY = "uht_audio_volume";

function getStoredPlaybackRate(): number {
  try {
    const stored = localStorage.getItem(PLAYBACK_RATE_KEY);
    if (stored) {
      const parsed = Number.parseFloat(stored);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 4) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read audio playback rate from localStorage:", err);
  }
  return 1;
}

function getStoredVolume(): number {
  try {
    const stored = localStorage.getItem(VOLUME_KEY);
    if (stored) {
      const parsed = Number.parseFloat(stored);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read audio volume from localStorage:", err);
  }
  return 1;
}

// ── Provider ───────────────────────────────────────────────────────────────────
export const AudioPlayerProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying,      setIsPlaying]      = useState(false);
  const [currentTime,    setCurrentTime]    = useState(0);
  const [duration,       setDuration]       = useState(0);
  const [playbackRate,   setPlaybackRateState] = useState<number>(getStoredPlaybackRate);
  const [volume,         setVolumeState]       = useState<number>(getStoredVolume);
  const [hasError,       setHasError]       = useState(false);

  // Create the single <audio> element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.playbackRate = getStoredPlaybackRate();
    audio.volume = getStoredVolume();
    audioRef.current = audio;

    const onTime  = () => setCurrentTime(audio.currentTime);
    const onMeta  = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };
    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("timeupdate",      onTime);
    audio.addEventListener("loadedmetadata",  onMeta);
    audio.addEventListener("ended",           onEnded);
    audio.addEventListener("error",           onError);

    return () => {
      audio.removeEventListener("timeupdate",     onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended",          onEnded);
      audio.removeEventListener("error",          onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // ── toggle ─────────────────────────────────────────────────────────────────
  // • Same episode → play / pause
  // • New episode → swap src, start playing
  const toggle = useCallback((episode: Episode) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => setHasError(true));
        setIsPlaying(true);
      }
    } else {
      audio.pause();
      audio.src = episode.audioUrl;
      audio.playbackRate = playbackRate;
      audio.volume = volume;
      audio.load();
      setCurrentEpisode(episode);
      setCurrentTime(0);
      setDuration(0);
      setHasError(false);
      // Wait for enough data before playing
      audio.addEventListener(
        "canplay",
        () => {
          audio.playbackRate = playbackRate;
          audio.volume = volume;
          audio.play().catch(() => setHasError(true));
          setIsPlaying(true);
        },
        { once: true }
      );
    }
  }, [currentEpisode, isPlaying, playbackRate, volume]);

  // ── seek ───────────────────────────────────────────────────────────────────
  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  // ── skip ───────────────────────────────────────────────────────────────────
  const skip = useCallback((seconds: number) => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime || 0;
      const dur = audioRef.current.duration || 0;
      const target = dur > 0 ? Math.max(0, Math.min(dur, current + seconds)) : Math.max(0, current + seconds);
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  }, []);

  // ── setPlaybackRate ────────────────────────────────────────────────────────
  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    try {
      localStorage.setItem(PLAYBACK_RATE_KEY, String(rate));
    } catch (err) {
      console.warn("Failed to persist audio playback rate to localStorage:", err);
    }
  }, []);

  // ── setVolume ──────────────────────────────────────────────────────────────
  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped));
    } catch (err) {
      console.warn("Failed to persist audio volume to localStorage:", err);
    }
  }, []);

  // ── dismiss ────────────────────────────────────────────────────────────────
  const dismiss = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentEpisode(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
  }, []);

  const isActive      = useCallback((id: number) => currentEpisode?.id === id, [currentEpisode]);
  const isThisPlaying = useCallback((id: number) => currentEpisode?.id === id && isPlaying, [currentEpisode, isPlaying]);

  const value = useMemo(() => ({
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
    isActive,
    isThisPlaying
  }), [
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
    isActive,
    isThisPlaying
  ]);

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
};