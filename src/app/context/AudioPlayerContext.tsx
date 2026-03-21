import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Episode } from "../data";
import { Ctx } from "./AudioPlayerCtx";

// ── Provider ───────────────────────────────────────────────────────────────────
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying,      setIsPlaying]      = useState(false);
  const [currentTime,    setCurrentTime]    = useState(0);
  const [duration,       setDuration]       = useState(0);
  const [hasError,       setHasError]       = useState(false);

  // Create the single <audio> element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
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
  // • Same episode  → play / pause
  // • New episode   → swap src, start playing
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
      audio.load();
      setCurrentEpisode(episode);
      setCurrentTime(0);
      setDuration(0);
      setHasError(false);
      // Wait for enough data before playing
      audio.addEventListener(
        "canplay",
        () => { audio.play().catch(() => setHasError(true)); setIsPlaying(true); },
        { once: true }
      );
    }
  }, [currentEpisode, isPlaying]);

  // ── seek ───────────────────────────────────────────────────────────────────
  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
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

  return (
    <Ctx.Provider value={{ currentEpisode, isPlaying, currentTime, duration, hasError, toggle, seek, dismiss, isActive, isThisPlaying }}>
      {children}
    </Ctx.Provider>
  );
};