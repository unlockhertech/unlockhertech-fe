import { createContext } from "react";
import type { Episode } from "../data";

export interface AudioPlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  playbackRate: number;
  volume: number;
  hasError: boolean; // true when audio src failed to load/play
  toggle: (episode: Episode) => void;
  seek: (seconds: number) => void;
  skip: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  dismiss: () => void;
  isActive: (id: number) => boolean;
  isThisPlaying: (id: number) => boolean;
}

export const Ctx = createContext<AudioPlayerState | null>(null);
